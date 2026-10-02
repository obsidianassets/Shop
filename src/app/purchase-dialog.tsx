"use client";

import { useState } from "react";

export default function PurchaseDialog({ delivery }: { delivery: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function close() {
    setOpen(false);
    window.history.replaceState(null, "", "/");
  }

  function copy() {
    const line = delivery.replace(/\r\n|\n|\r/g, " ");
    void navigator.clipboard.writeText(line);
  }

  return (
    <div className="shop-purchase">
      <div
        className="shop-purchase-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-complete-title"
      >
        <button
          type="button"
          className="shop-purchase-close"
          aria-label="Close"
          onClick={close}
        >
          ×
        </button>
        <h2 id="purchase-complete-title">Purchase complete</h2>
        <textarea className="shop-purchase-key" readOnly value={delivery} />
        <div className="shop-purchase-actions">
          <button type="button" className="shop-purchase-btn" onClick={copy}>
            Copy
          </button>
          <a className="shop-purchase-btn" href="/orders">
            View orders
          </a>
          <a className="shop-purchase-btn" href="/">
            Back to shop
          </a>
        </div>
      </div>
    </div>
  );
}
