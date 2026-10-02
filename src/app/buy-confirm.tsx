"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { buyProduct } from "./actions";

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function ConfirmButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="shop-confirm-go" disabled={disabled || pending}>
      Confirm
    </button>
  );
}

export default function BuyConfirm({
  name,
  slug,
  priceCents,
  balanceCents,
  stock,
}: {
  name: string;
  slug: string;
  priceCents: number;
  balanceCents: number;
  stock: number;
}) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const affordable = priceCents > 0 ? Math.floor(balanceCents / priceCents) : stock;
  const max = Math.min(stock, affordable);
  const needsFunds = priceCents > 0 && affordable < 1;

  function openDialog() {
    setQuantity(1);
    setOpen(true);
  }

  return (
    <div className="shop-buy">
      <button type="button" className="shop-btn" onClick={openDialog}>
        Buy
      </button>
      {open && (
        <div className="shop-confirm">
          <form action={buyProduct} className="shop-confirm-card">
            <h2>{name}</h2>
            <p>Unit price {dollars(priceCents)}</p>
            <p>Balance {dollars(balanceCents)}</p>
            <div className="shop-confirm-qty">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={max < 1 || quantity >= max}
                onClick={() => setQuantity((current) => Math.min(max, current + 1))}
              >
                +
              </button>
            </div>
            <p className="shop-confirm-total">Total {dollars(priceCents * quantity)}</p>
            {needsFunds && <p className="shop-confirm-funds">You need to add funds.</p>}
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="quantity" value={quantity} />
            <div className="shop-confirm-actions">
              <button type="button" className="shop-confirm-cancel" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <ConfirmButton disabled={needsFunds || max < 1 || quantity > max} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
