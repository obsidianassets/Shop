import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { confirmTopUp, submitTopUp } from "../actions";

export default async function TopUpPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const isAdmin =
    user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;

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
    <main style={{ padding: 48, fontFamily: "sans-serif" }}>
      <p><a href="/">Back</a></p>
      <h1>Add funds — USDT TRC20</h1>
<p>Signed in as: {user?.emailAddresses[0]?.emailAddress ?? "not signed in"}</p>
      <p>Send USDT on the Tron / TRC20 network to:</p>
      <p><b>{process.env.USDT_TRC20_ADDRESS}</b></p>
      <p>Then paste the transaction hash.</p>

      <form action={submitTopUp}>
        <p>
          <input name="amount" type="number" step="0.01" placeholder="Amount in USD" />
        </p>
        <p>
          <input name="txHash" placeholder="Transaction hash" />
        </p>
        <button type="submit">Submit hash</button>
      </form>

      <h2>Your top-ups</h2>
      <ul>
        {mine.map((t) => (
          <li key={t.id}>
            ${ (t.amountCents / 100).toFixed(2) } — {t.status} — {t.txHash}
          </li>
        ))}
      </ul>

      {isAdmin && (
        <>
          <h2>Admin — pending</h2>
          <ul>
            {pending.map((t) => (
              <li key={t.id}>
                ${ (t.amountCents / 100).toFixed(2) } — {t.txHash}
                <form action={confirmTopUp}>
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit">Confirm paid</button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}