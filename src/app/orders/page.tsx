import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) return <main style={{ padding: 48 }}>Sign in first.</main>;

  const items = await prisma.stockItem.findMany({
    where: { soldTo: userId, status: "sold" },
    orderBy: { id: "desc" },
  });

  return (
    <main style={{ padding: 48, fontFamily: "sans-serif" }}>
      <p><a href="/">Back</a></p>
      <h1>Your keys</h1>
      {items.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.payload}</li>
          ))}
        </ul>
      )}
    </main>
  );
}