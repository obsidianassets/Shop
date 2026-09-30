import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { buyTestKey } from "./actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; err?: string }>;
}) {
  const q = await searchParams;
  const { userId } = await auth();
  let balanceCents = 0;

  if (userId) {
    const user = await currentUser();
    const email =
      user?.emailAddresses[0]?.emailAddress ?? `${userId}@shop.local`;

    await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: { id: userId, email },
    });

    const sum = await prisma.ledger.aggregate({
      where: { userId },
      _sum: { amountCents: true },
    });
    balanceCents = sum._sum.amountCents ?? 0;
  }

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

      {userId && (
        <form action={buyTestKey}>
          <button type="submit">Buy Test Key — $1</button>
        </form>
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
          <p>
            <a href="/admin/stock">Admin stock</a>
          </p>
          <UserButton />
        </>
      )}
    </main>
  );
}