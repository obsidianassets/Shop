import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const { userId } = await auth();
  let balanceCents = 0;

  if (userId) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress ?? `${userId}@shop.local`;

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
      <Show when="signed-out">
        <p>Create an account or sign in.</p>
        <SignInButton />
        <span> </span>
        <SignUpButton />
      </Show>
      <Show when="signed-in">
        <p>You are signed in.</p>
        <p>Balance: ${(balanceCents / 100).toFixed(2)}</p>
        <UserButton />
      </Show>
    </main>
  );
}