"use client";

export default function CopyButton({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="shop-deposit-copy"
      onClick={() => void navigator.clipboard.writeText(value)}
    >
      Copy
    </button>
  );
}
