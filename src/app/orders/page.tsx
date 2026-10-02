import { SignInButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ShopBar from "../shop-bar";
import ShopRoomNav from "../shop-room-nav";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const accountLabel = email || user?.username || "";

  if (!userId) {
    return (
      <main className="shop-home">
        <ShopBar userId={null} accountLabel="" />
        <div className="shop-wrap shop-room">
          <ShopRoomNav />
          <h1>Your keys</h1>
          <p className="shop-sub">Sign in first.</p>
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

  const items = await prisma.stockItem.findMany({
    where: { soldTo: userId, status: "sold" },
    orderBy: { id: "desc" },
  });

  return (
    <main className="shop-home">
      <ShopBar userId={userId} accountLabel={accountLabel} />
      <div className="shop-wrap shop-room">
        <ShopRoomNav />
        <h1>Your keys</h1>
        <section className="shop-panel">
          {items.length === 0 ? (
            <p className="shop-muted">No purchases yet.</p>
          ) : (
            <ul className="shop-lines">
              {items.map((item) => (
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
