import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { confirmTopUp, submitTopUp } from "../actions";
import ShopBar from "../shop-bar";
import ShopRoomNav from "../shop-room-nav";

export const dynamic = "force-dynamic";

export default async function TopUpPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const accountLabel = email || user?.username || "";
  const isAdmin = email === process.env.ADMIN_EMAIL;

  const mine = userId
    ? await prisma.topUp.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const pending = isAdmin
    ? await prisma.topUp.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="shop-home">
      <ShopBar userId={userId} accountLabel={accountLabel} />
      <div className="shop-wrap shop-room">
        <ShopRoomNav />
        <h1>Add funds — USDT TRC20</h1>
        <p className="shop-sub">
          Signed in as: {email || "not signed in"}
        </p>

        <section className="shop-panel">
          <p>Send USDT on the Tron / TRC20 network to:</p>
          <p className="shop-hash">{process.env.USDT_TRC20_ADDRESS}</p>
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
