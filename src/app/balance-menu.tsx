"use client";

import { useEffect, useRef, useState } from "react";

export default function BalanceMenu({ balanceCents }: { balanceCents: number }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggledAt = useRef(0);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      className="shop-balance-menu"
      ref={rootRef}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        if (Date.now() - toggledAt.current < 400) return;
        setOpen(false);
      }}
    >
      <button
        type="button"
        className="shop-balance-btn"
        aria-expanded={open}
        onClick={() => {
          toggledAt.current = Date.now();
          setOpen((value) => !value);
        }}
      >
        Balance
      </button>
      {open && (
        <div className="shop-balance-panel">
          <p>Balance: ${(balanceCents / 100).toFixed(2)}</p>
          <a href="/topup">Add funds with USDT</a>
          <a href="/orders">Your keys</a>
        </div>
      )}
    </div>
  );
}
