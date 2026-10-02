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

  const marqueePills = [
    "Meta Profiles",
    "Meta Pages",
    "Meta Business Managers",
    "Individual Assets",
    "Packaged Assets",
    "Much more",
  ];

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
    <main className="shop-home">
      <div className="shop-banner">
        <img src="/shop-banner.png" alt="" />
        <div className="shop-banner-fade" />
      </div>
      <section className="shop-hero">
        <div className="shop-hero-inner">
          <p className="shop-hero-pill">
            <span aria-hidden="true">✦</span>
            Everything you need to scale, all in one place.
          </p>
          <p className="shop-hero-title">
            Simple to buy. Fast to deliver. Built to scale.
          </p>
          <p className="shop-hero-copy">
            Profiles, Business Managers, and Pages from one wallet, delivered
            when payment clears. Delivery is immediate, and support is available
            day and night.
          </p>
          <div className="shop-hero-actions">
            <a className="shop-hero-primary" href="#products">
              Browse the shop
            </a>
            <SignUpButton>
              <button type="button" className="shop-hero-secondary">
                Create account
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>
      <div className="shop-wrap">
        <div className="shop-marquee">
          <p className="shop-marquee-label">
            <span className="shop-marquee-blue">Placeholder</span>
            <span className="shop-marquee-dot" />
            <span className="shop-marquee-gray">Placeholder</span>
          </p>
          <div className="shop-marquee-viewport">
            <div className="shop-marquee-track">
              {[0, 1].map((copy) => (
                <div className="shop-marquee-set" key={copy}>
                  {marqueePills.map((label) => (
                    <span className="shop-pill" key={`${copy}-${label}`}>
                      {label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="shop-kicker">Shop</p>
        <h1>Shop</h1>
        <p className="shop-sub">Sign in, add funds, and buy a key.</p>
        <p className="shop-modules">
          <a className="shop-btn" href="/playbook/">
            Modules
          </a>
        </p>

        <div className="shop-strip">
          <div className="shop-strip-item">
            <div className="shop-strip-word">Premium</div>
            <div className="shop-strip-line">Assets, ready for you</div>
          </div>
          <div className="shop-strip-item">
            <div className="shop-strip-word">Clear</div>
            <div className="shop-strip-line">Guided, module by module</div>
          </div>
          <div className="shop-strip-item">
            <div className="shop-strip-word">Yours</div>
            <div className="shop-strip-line">Every order, kept safe</div>
          </div>
          <div className="shop-strip-item">
            <div className="shop-strip-word">Here</div>
            <div className="shop-strip-line">Real support on Discord</div>
          </div>
        </div>

        <section className="shop-clients">
          <p className="shop-clients-label">Trusted</p>
          <h2>Used by thousands</h2>
          <p className="shop-clients-copy">
            A name clients already know. Join Discord and see why people stay.
          </p>
          <a
            className="shop-discord"
            href="https://discord.gg/RwWRrpu3Z"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Discord
          </a>
        </section>

        {q.err === "balance" && <p className="shop-note">Not enough balance.</p>}
        {q.err === "stock" && <p className="shop-note">Out of stock.</p>}
        {q.err === "signin" && <p className="shop-note">Sign in first.</p>}
        {q.key && (
          <p className="shop-note">
            Your key: <b>{q.key}</b>
          </p>
        )}

        {!userId ? (
          <div className="shop-account">
            <p>Create an account or sign in.</p>
            <SignInButton />
            <span> </span>
            <SignUpButton />
          </div>
        ) : (
          <div className="shop-account">
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
          </div>
        )}

        <h2 id="products">Products</h2>
        {products.length === 0 && <p className="shop-muted">No products yet.</p>}
        <div className="shop-products">
          {products.map((product) => (
            <article key={product.id} className="shop-card">
              <h3>{product.name}</h3>
              <p className="shop-price">
                ${(product.priceCents / 100).toFixed(2)}
              </p>
              <p className="shop-muted">{product.stock.length} in stock</p>
              {userId ? (
                <form action={buyProduct}>
                  <input type="hidden" name="slug" value={product.slug} />
                  <button className="shop-btn" type="submit">
                    Buy
                  </button>
                </form>
              ) : (
                <p className="shop-signin">Sign in to buy.</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}