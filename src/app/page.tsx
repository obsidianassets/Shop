import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
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
        <UserButton />
      </Show>
    </main>
  );
}