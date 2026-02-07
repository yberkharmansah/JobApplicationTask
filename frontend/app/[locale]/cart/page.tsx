"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { removeFromCart, updateQuantity } from "@/src/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export default function CartPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{t("cart.title")}</h1>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
          {t("cart.empty")}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-2xl md:h-24 md:w-32">
                  <Image
                    src={item.imageUrl || "https://via.placeholder.com/400x300.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="text-sm text-slate-400">{item.category}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: Number(event.target.value)
                          })
                        )
                      }
                      className="w-20 rounded-xl border border-white/10 bg-slate-950 px-3 py-1 text-sm text-white"
                    />
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-xs font-semibold uppercase tracking-wide text-rose-300 transition hover:text-rose-200"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-white">
                  {(item.price * item.quantity).toFixed(2)} ₺
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("cart.summary")}
            </h2>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>
                {items.length} {t("cart.items")}
              </span>
              <span>{subtotal.toFixed(2)} ₺</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>{t("cart.subtotal")}</span>
              <span>{subtotal.toFixed(2)} ₺</span>
            </div>
            <button className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
              {t("cart.checkout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}