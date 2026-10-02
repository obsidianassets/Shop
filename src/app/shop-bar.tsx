import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function ShopBar({
  userId,
  accountLabel,
}: {
  userId: string | null;
  accountLabel: string;
}) {
  return (
    <header className="shop-topbar">
      <div className="shop-topbar-inner">
        <a className="shop-brand" href="/">
          Obsidian Assets
        </a>
        {userId ? (
          <div className="shop-topbar-user">
            <a className="shop-topbar-email" href="/account">
              {accountLabel}
            </a>
            <UserButton />
          </div>
        ) : (
          <div className="shop-topbar-auth">
            <SignInButton>
              <button type="button" className="shop-topbar-login">
                Log in
              </button>
            </SignInButton>
            <SignUpButton>
              <button type="button" className="shop-topbar-start">
                Get started
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
}
