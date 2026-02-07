"use client";

import { Link } from "@/i18n/navigation";
import { useAppSelector } from "@/src/store/hooks";

export default function CartBadge() {
  const totalItems = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-slate-200 transition hover:border-white hover:text-white"
      aria-label="Cart"
    >
      <span className="text-base">🛒</span>
      {totalItems > 0 ? (
        <span className="absolute -top-1 -right-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-semibold text-white">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}