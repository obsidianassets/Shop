import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { addKeys, createProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const user = await currentUser();
  const isAdmin =
    user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;

  if (!isAdmin) return <main style={{ padding: 48 }}>Not admin.</main>;

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <main style={{ padding: 48, fontFamily: "sans-serif" }}>
      <p>
        <a href="/">Back</a>
      </p>
      <h1>Products and stock</h1>

      <h2>New product</h2>
      <form action={createProduct}>
        <p>
          <input name="name" placeholder="Name" />
        </p>
        <p>
          <input name="slug" placeholder="slug-like-this" />
        </p>
        <p>
          <input name="price" type="number" step="0.01" placeholder="Price USD" />
        </p>
        <p>
          <button type="submit">Create product</button>
        </p>
      </form>

      <h2>Add keys</h2>
      <form action={addKeys}>
        <p>
          <select name="slug">
            {products.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name} (${(p.priceCents / 100).toFixed(2)})
              </option>
            ))}
          </select>
        </p>
        <p>One key per line</p>
        <textarea name="keys" rows={10} cols={40} />
        <p>
          <button type="submit">Add keys</button>
        </p>
      </form>
    </main>
  );
}