"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function formatExactUnits(exactUnits: string) {
  const units = BigInt(exactUnits);
  const whole = units / 1_000_000n;
  const fraction = (units % 1_000_000n).toString().padStart(6, "0");
  return `${whole}.${fraction}`;
}

export function DepositWatch({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    let stopped = false;

    async function tick() {
      if (stopped) return;
      try {
        await fetch("/api/deposits/watch");
      } catch {
        return;
      }
      if (!stopped) router.refresh();
    }

    void tick();
    const id = setInterval(() => void tick(), 15_000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [active, router]);

  return null;
}

export function DepositInvoiceCard({
  address,
  exactUnits,
  expiresAt,
}: {
  address: string;
  exactUnits: string;
  expiresAt: string;
}) {
  const exact = formatExactUnits(exactUnits);
  const [left, setLeft] = useState(() => Math.max(0, new Date(expiresAt).getTime() - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);
  const timeLeft = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="shop-deposit-open">
      <p className="shop-muted">Wallet</p>
      <div className="shop-deposit-row">
        <span className="shop-hash">{address}</span>
        <button type="button" className="shop-deposit-copy" onClick={() => void navigator.clipboard.writeText(address)}>
          Copy
        </button>
      </div>
      <p className="shop-muted">Exact amount</p>
      <div className="shop-deposit-row">
        <span className="shop-deposit-amount">{exact} USDT</span>
        <button type="button" className="shop-deposit-copy" onClick={() => void navigator.clipboard.writeText(exact)}>
          Copy
        </button>
      </div>
      <p>Time left {left > 0 ? timeLeft : "0:00"}</p>
      <p className="shop-deposit-note">
        Send that exact amount on TRC20 only. A wrong network or a rounded amount will not match.
      </p>
    </div>
  );
}
