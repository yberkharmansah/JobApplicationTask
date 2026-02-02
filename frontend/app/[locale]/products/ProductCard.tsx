"use client";

import Image from "next/image";
import { addToCart } from "@/src/store/cartSlice";
import { useAppDispatch } from "@/src/store/hooks";
import type { Product } from "@/src/types/product";
import { Link } from "@/i18n/navigation";

type Props = {
  product: Product;
  addLabel: string;
};

export default function ProductCard({ product, addLabel }: Props) {
  const dispatch = useAppDispatch();
  const imageSrc =
    product.imageUrl || "https://via.placeholder.com/640x480.png";
  const isInlineImage =
    imageSrc.startsWith("data:") || imageSrc.startsWith("blob:");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <Link href={`/products/${product.id}`} className="relative block h-48">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized={isInlineImage}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="rounded-full border border-white/10 px-2 py-1">
            {product.category}
          </span>
          <span>{product.price.toFixed(2)} ₺</span>
        </div>
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">
          {product.description || "Premium selection with modern styling."}
        </p>
        <button
          onClick={() => dispatch(addToCart(product))}
          className="mt-auto rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}