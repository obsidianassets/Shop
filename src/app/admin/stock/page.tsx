import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { addKeys } from "../../actions";

export default async function StockPage() {
  const user = await currentUser();
  const isAdmin =
    user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;

  if (!isAdmin) return <main style={{ padding: 48 }}>Not admin.</main>;

  const available = await prisma.stockItem.count({
    where: { status: "available" },
  });
  const sold = await prisma.stockItem.count({
    where: { status: "sold" },
  });

  return (
    <main style={{ padding: 48, fontFamily: "sans-serif" }}>
      <p><a href="/">Back</a></p>
      <h1>Stock</h1>
      <p>Available: {available}</p>
      <p>Sold: {sold}</p>
      <form action={addKeys}>
        <p>One key per line</p>
        <textarea name="keys" rows={10} cols={40} />
        <p>
          <button type="submit">Add keys</button>
        </p>
      </form>
    </main>
  );
}