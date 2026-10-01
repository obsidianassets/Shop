"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitTopUp(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Sign in first." };

  const txHash = String(formData.get("txHash") || "").trim();
  const amount = Number(formData.get("amount"));
  if (!txHash || !amount || amount <= 0) {
    return { error: "Hash and amount required." };
  }

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
    return { error: "That hash was already submitted." };
  }

  revalidatePath("/topup");
  return { ok: true };
}

export async function confirmTopUp(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    return { error: "Not admin." };
  }

  const id = String(formData.get("id") || "");
  const topUp = await prisma.topUp.findUnique({ where: { id } });
  if (!topUp || topUp.status !== "pending") return { error: "Invalid." };

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
}

export async function createProduct(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    return { error: "Not admin." };
  }

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const price = Number(formData.get("price"));
  if (!name || !slug || !price || price <= 0) return { error: "Fill all fields." };

  await prisma.product.create({
    data: { name, slug, priceCents: Math.round(price * 100) },
  });

  revalidatePath("/");
  revalidatePath("/admin/stock");
}

export async function addKeys(formData: FormData) {
  const user = await currentUser();
  if (user?.emailAddresses[0]?.emailAddress !== process.env.ADMIN_EMAIL) {
    return { error: "Not admin." };
  }

  const raw = String(formData.get("keys") || "");
  const keys = raw
    .split("\n")
    .map((k) => k.trim())
    .filter(Boolean);

  const slug = String(formData.get("slug") || "test-key");
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { error: "Product not found." };

  for (const payload of keys) {
    await prisma.stockItem.create({
      data: { productId: product.id, payload, status: "available" },
    });
  }

  revalidatePath("/admin/stock");
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

  if (balance < product.priceCents) redirect("/?err=balance");

  const item = await prisma.stockItem.findFirst({
    where: { productId: product.id, status: "available" },
  });
  if (!item) redirect("/?err=stock");

  await prisma.$transaction([
    prisma.stockItem.update({
      where: { id: item.id },
      data: { status: "sold", soldTo: userId },
    }),
    prisma.ledger.create({
      data: {
        userId,
        amountCents: -product.priceCents,
        reason: `buy:${product.slug}`,
      },
    }),
  ]);

  redirect("/?key=" + item.payload);
}

export async function buyTestKey() {
  const formData = new FormData();
  formData.set("slug", "test-key");
  return buyProduct(formData);
}