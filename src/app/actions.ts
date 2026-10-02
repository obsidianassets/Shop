"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitTopUp(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/topup?err=signin");

  const txHash = String(formData.get("txHash") || "").trim();
  const amount = Number(formData.get("amount"));
  if (!txHash || !amount || amount <= 0) redirect("/topup?err=fields");

  try {
    await prisma.topUp.create({
      data: {
        userId,
        txHash,
        amountCents: Math.round(amount * 100),
        status: "pending",
      },
    });
  } catch {
    redirect("/topup?err=used");
  }

  revalidatePath("/topup");
  redirect("/topup?ok=1");
}

export async function confirmTopUp(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    redirect("/topup?err=admin");
  }

  const id = String(formData.get("id") || "");
  const topUp = await prisma.topUp.findUnique({ where: { id } });
  if (!topUp || topUp.status !== "pending") redirect("/topup?err=invalid");

  await prisma.$transaction([
    prisma.topUp.update({ where: { id }, data: { status: "paid" } }),
    prisma.ledger.create({
      data: {
        userId: topUp.userId,
        amountCents: topUp.amountCents,
        reason: `usdt_trc20:${topUp.txHash}`,
      },
    }),
  ]);

  revalidatePath("/topup");
  revalidatePath("/");
  redirect("/topup?ok=confirmed");
}

export async function createProduct(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    redirect("/admin/stock?err=admin");
  }

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const price = Number(formData.get("price"));
  if (!name || !slug || !price || price <= 0) redirect("/admin/stock?err=fields");

  await prisma.product.create({
    data: { name, slug, priceCents: Math.round(price * 100) },
  });

  revalidatePath("/");
  revalidatePath("/admin/stock");
  redirect("/admin/stock?ok=1");
}

export async function addKeys(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    redirect("/admin/stock?err=admin");
  }

  const raw = String(formData.get("keys") || "");
  const keys = raw
    .split("\n")
    .map((k) => k.trim())
    .filter(Boolean);

  const slug = String(formData.get("slug") || "test-key");
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) redirect("/admin/stock?err=product");

  for (const payload of keys) {
    await prisma.stockItem.create({
      data: { productId: product.id, payload, status: "available" },
    });
  }

  revalidatePath("/admin/stock");
  redirect("/admin/stock?ok=keys");
}

export async function buyProduct(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/?err=signin");

  const slug = String(formData.get("slug") || "test-key");
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) redirect("/?err=stock");

  const balance =
    (
      await prisma.ledger.aggregate({
        where: { userId },
        _sum: { amountCents: true },
      })
    )._sum.amountCents ?? 0;

  const quantity = Number(formData.get("quantity"));
  if (!Number.isSafeInteger(quantity) || quantity < 1) redirect("/?err=stock");

  const totalCents = product.priceCents * quantity;
  if (balance < totalCents) redirect("/?err=balance");

  let bought: { error: "stock" | "balance" } | { ids: string[] };
  try {
    bought = await prisma.$transaction(async (tx) => {
      const available = await tx.stockItem.findMany({
        where: { productId: product.id, status: "available" },
        orderBy: { id: "asc" },
        take: quantity,
      });
      if (available.length < quantity) return { error: "stock" as const };

      const fresh =
        (
          await tx.ledger.aggregate({
            where: { userId },
            _sum: { amountCents: true },
          })
        )._sum.amountCents ?? 0;
      if (fresh < totalCents) return { error: "balance" as const };

      const ids = available.map((item) => item.id);
      const updated = await tx.stockItem.updateMany({
        where: { id: { in: ids }, status: "available" },
        data: { status: "sold", soldTo: userId },
      });
      if (updated.count !== quantity) throw new Error("stock");

      await tx.ledger.create({
        data: {
          userId,
          amountCents: -totalCents,
          reason: `buy:${product.slug}`,
        },
      });
      return { ids };
    });
  } catch (error) {
    if (error instanceof Error && error.message === "stock") redirect("/?err=stock");
    throw error;
  }

  if ("error" in bought) redirect("/?err=" + bought.error);
  redirect("/?delivered=" + encodeURIComponent(bought.ids.join(",")));
}