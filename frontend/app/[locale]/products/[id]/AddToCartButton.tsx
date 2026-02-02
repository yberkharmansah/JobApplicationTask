"use client";

import { addToCart } from "@/src/store/cartSlice";
import { useAppDispatch } from "@/src/store/hooks";
import type { Product } from "@/src/types/product";

type Props = {
  product: Product;
  label: string;
};

export default function AddToCartButton({ product, label }: Props) {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(addToCart(product))}
      className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
    >
      {label}
    </button>
  );
}