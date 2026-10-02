import { auth, currentUser } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import CopyButton from "../../../copy-button";
import { DepositWatch } from "../../../deposit-panel";
import ShopBar from "../../../shop-bar";
import ShopRoomNav from "../../../shop-room-nav";

export const dynamic = "force-dynamic";

function exactAmount(exactUnits: string) {
  const units = BigInt(exactUnits);
  const whole = units / 1_000_000n;
  const fraction = (units % 1_000_000n).toString().padStart(6, "0");
  return `${whole}.${fraction}`;
}

function exactSol(exactUnits: string) {
  const micro = BigInt(exactUnits) / 1000n;
  const whole = micro / 1_000_000n;
  const fraction = (micro % 1_000_000n).toString().padStart(6, "0");
  return `${whole}.${fraction}`;
}

function statusLine(status: string) {
  if (status === "complete") return "Payment complete";
  if (status === "failed") return "Expired";
  return "Waiting for payment";
}

export default async function DepositInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const accountLabel = email || user?.username || "";

  let invoice =
    userId
      ? await prisma.depositInvoice.findFirst({
          where: { id, userId },
        })
      : null;

  if (invoice && invoice.status === "paid") {
    await prisma.depositInvoice.updateMany({
      where: { id: invoice.id, status: "paid" },
      data: { status: "complete" },
    });
    invoice = { ...invoice, status: "complete" };
  }

  if (invoice && invoice.status === "pending" && invoice.expiresAt <= new Date()) {
    await prisma.depositInvoice.updateMany({
      where: { id: invoice.id, status: "pending", expiresAt: { lte: new Date() } },
      data: { status: "failed" },
    });
    invoice = { ...invoice, status: "failed" };
  }

  const sol = invoice?.currency === "sol";
  const wallet = sol
    ? (process.env.SOL_DEPOSIT_ADDRESS ?? "")
    : (process.env.USDT_TRC20_ADDRESS ?? "");
  const qr = wallet
    ? await QRCode.toDataURL(wallet, {
        margin: 1,
        width: 220,
        color: { dark: "#0A0E17", light: "#F4F6FA" },
      })
    : "";
  const exact = invoice ? (sol ? exactSol(invoice.exactUnits) : exactAmount(invoice.exactUnits)) : "";

  return (
    <main className="shop-home">
      <ShopBar userId={userId} accountLabel={accountLabel} />
      <div className="shop-wrap shop-room">
        <ShopRoomNav />
        <h1>Deposit</h1>
        {!userId && <p className="shop-note">Sign in first.</p>}
        {userId && !invoice && <p className="shop-note">Invoice not found.</p>}
        {invoice && (
          <section className="shop-panel">
            <DepositWatch active={invoice.status === "pending"} />
            <p className="shop-deposit-status">{statusLine(invoice.status)}</p>
            {qr && (
              <img className="shop-deposit-qr" src={qr} width={220} height={220} alt="Wallet address" />
            )}
            <p className="shop-muted">Wallet</p>
            <div className="shop-deposit-row">
              <span className="shop-hash">{wallet}</span>
              <CopyButton value={wallet} />
            </div>
            <p>Network: {sol ? "Solana" : "TRC20 (Tron)"}</p>
            {sol ? (
              <>
                <p>You receive: ${(invoice.amountCents / 100).toFixed(2)}</p>
                <p className="shop-muted">Send exactly</p>
                <div className="shop-deposit-row">
                  <span className="shop-deposit-amount">{exact}</span>
                  <span>SOL</span>
                  <CopyButton value={exact} />
                </div>
              </>
            ) : (
              <>
                <p className="shop-muted">Exact amount</p>
                <div className="shop-deposit-row">
                  <span className="shop-deposit-amount">{exact} USDT</span>
                  <CopyButton value={exact} />
                </div>
              </>
            )}
            <ul className="shop-deposit-notes">
              <li>Send the exact amount, including the decimals.</li>
              <li>{sol ? "SOL on Solana only." : "USDT on TRC20 only."}</li>
              <li>A wrong network will not match.</li>
              <li>This invoice expires in 30 minutes.</li>
            </ul>
          </section>
        )}
        <p>
          <a href="/topup">Back to add funds</a>
        </p>
      </div>
    </main>
  );
}
