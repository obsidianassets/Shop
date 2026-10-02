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
  const credited = await matchDeposits();
  if (credited > 0 || failed.count > 0) {
    revalidatePath("/topup");
    revalidatePath("/");
    revalidatePath("/account");
  }
  return NextResponse.json({ ok: true, credited });
}

async function matchDeposits() {
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
    where: { status: "pending", expiresAt: { gt: now }, txHash: null },
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
