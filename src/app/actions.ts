"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { randomInt } from "crypto";
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

export async function createDeposit(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/topup?err=signin");

  const dollars = Number(formData.get("amount"));
  if (!Number.isInteger(dollars) || dollars < 1 || dollars > 20_000_000) {
    redirect("/topup?err=amount");
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  await prisma.user.upsert({
    where: { id: userId },
    update: { email: email || `${userId}@shop.local` },
    create: { id: userId, email: email || `${userId}@shop.local` },
  });

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  let invoice: { id: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      invoice = await prisma.$transaction(
        async (tx) => {
          for (let pick = 0; pick < 25; pick++) {
            const tail = randomInt(1, 1_000_000);
            const exactUnits = (BigInt(dollars) * 1_000_000n + BigInt(tail)).toString();
            await tx.$executeRaw`SELECT pg_advisory_xact_lock((hashtext(${exactUnits}))::bigint)`;
            const clash = await tx.depositInvoice.findFirst({
              where: {
                exactUnits,
                status: "pending",
                expiresAt: { gt: new Date() },
              },
              select: { id: true },
            });
            if (clash) continue;
            const created = await tx.depositInvoice.create({
              data: {
                userId,
                amountCents: dollars * 100,
                exactUnits,
                status: "pending",
                expiresAt,
              },
            });
            return tx.depositInvoice.findUnique({ where: { id: created.id } });
          }
          throw new Error("tail");
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      break;
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code === "P2034" && attempt < 4) continue;
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      redirect("/topup?err=invoice&message=" + encodeURIComponent(message));
    }
  }

  if (!invoice) redirect("/topup?err=invoice");
  revalidatePath("/topup");
  redirect("/topup?invoice=" + invoice.id);
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