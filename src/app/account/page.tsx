import { SignInButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ShopBar from "../shop-bar";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const accountLabel = email || user?.username || "";

  if (!userId) {
    return (
      <main className="shop-home">
        <ShopBar userId={null} accountLabel="" />
        <div className="shop-wrap shop-room">
          <h1>Account</h1>
          <p className="shop-sub">Log in to see your balance, funds, and orders.</p>
          <div className="shop-actions">
            <SignInButton>
              <button type="button" className="shop-primary">
                Log in
              </button>
            </SignInButton>
          </div>
        </div>
      </main>
    );
  }

  const [sum, ledger, topUps, keys] = await Promise.all([
    prisma.ledger.aggregate({
      where: { userId },
      _sum: { amountCents: true },
    }),
    prisma.ledger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.topUp.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.stockItem.findMany({
      where: { soldTo: userId, status: "sold" },
      orderBy: { id: "desc" },
    }),
  ]);
  const balanceCents = sum._sum.amountCents ?? 0;

  return (
    <main className="shop-home">
      <ShopBar userId={userId} accountLabel={accountLabel} />
      <div className="shop-wrap shop-room">
        <h1>Account</h1>
        <p className="shop-sub">{email || accountLabel}</p>
        <p className="shop-balance">
          Balance: ${(balanceCents / 100).toFixed(2)}
        </p>
        <div className="shop-actions">
          <a className="shop-primary" href="/topup">
            Add funds
          </a>
          <a className="shop-primary" href="/orders">
            Your orders
          </a>
          <a className="shop-primary" href="/">
            Back to shop
          </a>
          <a className="shop-primary" href="/playbook/">
            Modules
          </a>
        </div>

        <section className="shop-panel">
          <h2>Recent ledger</h2>
          {ledger.length === 0 ? (
            <p className="shop-muted">No ledger lines yet.</p>
          ) : (
            <ul className="shop-lines">
              {ledger.map((line) => (
                <li key={line.id}>
                  <span>${(line.amountCents / 100).toFixed(2)}</span>
                  <span className="shop-muted">{line.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="shop-panel">
          <h2>Recent top-ups</h2>
          {topUps.length === 0 ? (
            <p className="shop-muted">No top-ups yet.</p>
          ) : (
            <ul className="shop-lines">
              {topUps.map((topUp) => (
                <li key={topUp.id}>
                  <span>${(topUp.amountCents / 100).toFixed(2)}</span>
                  <span className="shop-muted">{topUp.status}</span>
                  <span className="shop-hash">{topUp.txHash}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="shop-panel">
          <h2>Delivered keys</h2>
          {keys.length === 0 ? (
            <p className="shop-muted">No delivered keys yet.</p>
          ) : (
            <ul className="shop-lines">
              {keys.map((item) => (
                <li key={item.id}>
                  <span className="shop-hash">{item.payload}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
