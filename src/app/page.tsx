import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { buyProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; err?: string }>;
}) {
  const q = await searchParams;
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const isAdmin = email === process.env.ADMIN_EMAIL;
  let balanceCents = 0;

  if (userId) {
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: email || `${userId}@shop.local` },
      create: { id: userId, email: email || `${userId}@shop.local` },
    });

    const sum = await prisma.ledger.aggregate({
      where: { userId },
      _sum: { amountCents: true },
    });
    balanceCents = sum._sum.amountCents ?? 0;
  }

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      stock: {
        where: { status: "available" },
        select: { id: true },
      },
    },
  });

  return (
    <main style={{ padding: 48, fontFamily: "sans-serif" }}>
      <h1>Shop</h1>

      {q.err === "balance" && <p>Not enough balance.</p>}
      {q.err === "stock" && <p>Out of stock.</p>}
      {q.err === "signin" && <p>Sign in first.</p>}
      {q.key && (
        <p>
          Your key: <b>{q.key}</b>
        </p>
      )}

      {!userId ? (
        <>
          <p>Create an account or sign in.</p>
          <SignInButton />
          <span> </span>
          <SignUpButton />
        </>
      ) : (
        <>
          <p>You are signed in.</p>
          <p>Balance: ${(balanceCents / 100).toFixed(2)}</p>
          <p>
            <a href="/topup">Add funds with USDT</a>
          </p>
          {isAdmin && (
            <p>
              <a href="/admin/stock">Admin stock</a>
            </p>
          )}
          <p>
            <a href="/orders">Your keys</a>
          </p>
          <UserButton />
        </>
      )}

      <h2>Products</h2>
      {products.length === 0 && <p>No products yet.</p>}
      {products.map((product) => (
        <div key={product.id} style={{ margin: "16px 0" }}>
          <p>
            <b>{product.name}</b> — $
            {(product.priceCents / 100).toFixed(2)} — {product.stock.length} in
            stock
          </p>
          {userId ? (
            <form action={buyProduct}>
              <input type="hidden" name="slug" value={product.slug} />
              <button type="submit">Buy</button>
            </form>
          ) : (
            <p>Sign in to buy.</p>
          )}
        </div>
      ))}
    </main>
  );
}