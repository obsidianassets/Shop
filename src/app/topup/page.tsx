import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { confirmTopUp, createDeposit, submitTopUp } from "../actions";
import ShopBar from "../shop-bar";
import ShopRoomNav from "../shop-room-nav";

export const dynamic = "force-dynamic";

export default async function TopUpPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; message?: string }>;
}) {
  const q = await searchParams;
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const accountLabel = email || user?.username || "";
  const isAdmin = email === process.env.ADMIN_EMAIL;
  const now = new Date();

  if (userId) {
    await prisma.depositInvoice.updateMany({
      where: { userId, status: "paid" },
      data: { status: "complete" },
    });
    await prisma.depositInvoice.updateMany({
      where: { userId, status: "pending", expiresAt: { lte: now } },
      data: { status: "failed" },
    });
  }

  const [mine, pending, invoices] = await Promise.all([
    userId
      ? prisma.topUp.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.topUp.findMany({
          where: { status: "pending" },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    userId
      ? prisma.depositInvoice.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const wallet = process.env.USDT_TRC20_ADDRESS ?? "";

  return (
    <main className="shop-home">
      <ShopBar userId={userId} accountLabel={accountLabel} />
      <div className="shop-wrap shop-room">
        <ShopRoomNav />
        <h1>Add funds</h1>
        <p className="shop-sub">USDT on TRC20</p>
        {q.err === "signin" && <p className="shop-note">Sign in first.</p>}
        {q.err === "amount" && (
          <p className="shop-note">Enter a whole number of USDT, at least 1.</p>
        )}
        {q.err === "sol" && (
          <p className="shop-note">Enter a SOL amount of at least 0.01.</p>
        )}
        {q.err === "invoice" && <p className="shop-note">{q.message}</p>}

        <section className="shop-panel">
          <h2>Create deposit</h2>
          <form action={createDeposit}>
            <p>
              <label className="shop-muted" htmlFor="deposit-currency">
                Currency
              </label>
            </p>
            <p>
              <select id="deposit-currency" name="currency" defaultValue="usdt">
                <option value="usdt">USDT</option>
                <option value="sol">SOL</option>
              </select>
            </p>
            <p>
              <label className="shop-muted" htmlFor="deposit-amount">
                Amount
              </label>
            </p>
            <p>
              <input id="deposit-amount" name="amount" type="number" min="0.01" step="any" required />
            </p>
            <button className="shop-primary" type="submit">
              Create deposit
            </button>
          </form>
          {userId && (
            <>
              <h2>Your invoices</h2>
              {invoices.length === 0 ? (
                <p className="shop-muted">No invoices yet.</p>
              ) : (
                <ul className="shop-lines">
                  {invoices.map((invoice) => (
                    <li key={invoice.id}>
                      <span>${(invoice.amountCents / 100).toFixed(2)}</span>
                      <span className="shop-muted">{invoice.currency === "sol" ? "SOL" : "USDT"}</span>
                      <span className="shop-muted">{invoice.status}</span>
                      <a href={`/topup/invoice/${invoice.id}`}>View</a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <section className="shop-panel">
          <h2>Manual hash</h2>
          <p>Send USDT on the Tron / TRC20 network to:</p>
          <p className="shop-hash">{wallet}</p>
          <p className="shop-muted">Then paste the transaction hash.</p>
          <form action={submitTopUp}>
            <p>
              <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount in USD"
              />
            </p>
            <p>
              <input name="txHash" placeholder="Transaction hash" />
            </p>
            <button className="shop-primary" type="submit">
              Submit hash
            </button>
          </form>
        </section>

        <section className="shop-panel">
          <h2>Your top-ups</h2>
          {mine.length === 0 ? (
            <p className="shop-muted">No top-ups yet.</p>
          ) : (
            <ul className="shop-lines">
              {mine.map((t) => (
                <li key={t.id}>
                  <span>${(t.amountCents / 100).toFixed(2)}</span>
                  <span className="shop-muted">{t.status}</span>
                  <span className="shop-hash">{t.txHash}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isAdmin && (
          <section className="shop-panel">
            <h2>Admin — pending</h2>
            {pending.length === 0 ? (
              <p className="shop-muted">No pending top-ups.</p>
            ) : (
              <ul className="shop-lines">
                {pending.map((t) => (
                  <li key={t.id}>
                    <span>${(t.amountCents / 100).toFixed(2)}</span>
                    <span className="shop-hash">{t.txHash}</span>
                    <form action={confirmTopUp}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="shop-primary" type="submit">
                        Confirm paid
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
