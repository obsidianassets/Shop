import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

type Trc20Transfer = {
  transaction_id?: string;
  from?: string;
  to?: string;
  value?: string | number;
  type?: string;
  token_info?: { address?: string };
};

export async function GET(request: NextRequest) {
  const header = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (header) {
    if (!cronSecret || header !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  await prisma.depositInvoice.updateMany({
    where: { status: "paid" },
    data: { status: "complete" },
  });
  const failed = await prisma.depositInvoice.updateMany({
    where: { status: "pending", expiresAt: { lte: new Date() } },
    data: { status: "failed" },
  });
  const credited = (await matchUsdt()) + (await matchSol());
  if (credited > 0 || failed.count > 0) {
    revalidatePath("/topup");
    revalidatePath("/");
    revalidatePath("/account");
  }
  return NextResponse.json({ ok: true, credited });
}

async function matchUsdt() {
  const wallet = process.env.USDT_TRC20_ADDRESS;
  if (!wallet) return 0;

  const url = new URL(`https://api.trongrid.io/v1/accounts/${wallet}/transactions/trc20`);
  url.searchParams.set("only_to", "true");
  url.searchParams.set("only_confirmed", "true");
  url.searchParams.set("limit", "50");
  url.searchParams.set("contract_address", USDT_CONTRACT);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return 0;

  const body = (await response.json()) as { data?: Trc20Transfer[] };
  const transfers = Array.isArray(body.data) ? body.data : [];
  const now = new Date();
  const open = await prisma.depositInvoice.findMany({
    where: { currency: "usdt", status: "pending", expiresAt: { gt: now }, txHash: null },
  });
  const byUnits = new Map(open.map((invoice) => [invoice.exactUnits, invoice]));

  let credited = 0;
  for (const transfer of transfers) {
    if (transfer.type !== "Transfer") continue;
    if (transfer.to !== wallet) continue;
    if (transfer.token_info?.address !== USDT_CONTRACT) continue;
    const txHash = String(transfer.transaction_id || "").trim();
    const units = unitsKey(transfer.value);
    if (!txHash || !units) continue;
    const invoice = byUnits.get(units);
    if (!invoice) continue;
    const saved = await creditInvoice(invoice, txHash);
    if (saved) {
      credited += 1;
      byUnits.delete(units);
      revalidatePath(`/topup/invoice/${invoice.id}`);
    }
  }
  return credited;
}

async function matchSol() {
  const address = process.env.SOL_DEPOSIT_ADDRESS;
  if (!address) return 0;

  const now = new Date();
  const open = await prisma.depositInvoice.findMany({
    where: { currency: "sol", status: "pending", expiresAt: { gt: now }, txHash: null },
  });
  if (open.length === 0) return 0;
  const byUnits = new Map(open.map((invoice) => [invoice.exactUnits, invoice]));

  const signatures = await solanaRpc("getSignaturesForAddress", [address, { limit: 20 }]);
  if (!Array.isArray(signatures)) return 0;

  let credited = 0;
  for (const row of signatures) {
    if (!isSignature(row) || row.err) continue;
    const signature = String(row.signature || "").trim();
    if (!signature) continue;
    const tx = await solanaRpc("getTransaction", [
      signature,
      { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 },
    ]);
    if (!isParsedTransaction(tx) || tx.meta?.err) continue;
    for (const units of nativeTransferLamports(tx, address)) {
      const invoice = byUnits.get(units);
      if (!invoice) continue;
      const saved = await creditInvoice(invoice, signature);
      if (saved) {
        credited += 1;
        byUnits.delete(units);
        revalidatePath(`/topup/invoice/${invoice.id}`);
      }
    }
  }
  return credited;
}

async function solanaRpc(method: string, params: unknown[]) {
  const response = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { result?: unknown; error?: unknown };
  if (body.error) return null;
  return body.result ?? null;
}

type SolSignature = { signature?: string; err?: unknown };
type SolInstruction = {
  program?: string;
  parsed?: { type?: string; info?: { destination?: string; lamports?: string | number } };
};
type ParsedSolTransaction = {
  transaction?: { message?: { instructions?: SolInstruction[] } };
  meta?: { err?: unknown; innerInstructions?: { instructions?: SolInstruction[] }[] };
};

function isSignature(row: unknown): row is SolSignature {
  return !!row && typeof row === "object" && "signature" in row;
}

function isParsedTransaction(tx: unknown): tx is ParsedSolTransaction {
  return !!tx && typeof tx === "object";
}

function nativeTransferLamports(tx: ParsedSolTransaction, address: string) {
  const found: string[] = [];
  const groups = [
    tx.transaction?.message?.instructions ?? [],
    ...(tx.meta?.innerInstructions ?? []).map((group) => group.instructions ?? []),
  ];
  for (const instructions of groups) {
    for (const ix of instructions) {
      if (ix.program !== "system") continue;
      if (ix.parsed?.type !== "transfer") continue;
      if (ix.parsed.info?.destination !== address) continue;
      const units = unitsKey(ix.parsed.info.lamports);
      if (units) found.push(units);
    }
  }
  return found;
}

function unitsKey(value: string | number | undefined) {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) return "";
    return String(value);
  }
  if (typeof value !== "string" || !/^\d+$/.test(value)) return "";
  try {
    return BigInt(value).toString();
  } catch {
    return "";
  }
}

async function creditInvoice(
  invoice: { id: string; userId: string; amountCents: number },
  txHash: string,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.depositInvoice.updateMany({
        where: {
          id: invoice.id,
          status: "pending",
          txHash: null,
          expiresAt: { gt: new Date() },
        },
        data: { status: "complete", txHash },
      });
      if (updated.count !== 1) return false;
      await tx.ledger.create({
        data: {
          userId: invoice.userId,
          amountCents: invoice.amountCents,
          reason: "deposit",
        },
      });
      return true;
    });
  } catch {
    return false;
  }
}
