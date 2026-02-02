import Image from "next/image";
import Link from "next-intl/link";
import { getTranslations } from "next-intl/server";
import { fetchProducts } from "@/src/lib/api";
import ProductCard from "./products/ProductCard";

export default async function HomePage() {
  const t = await getTranslations();
  const products = await fetchProducts({});

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12">
      <section className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 p-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Pulse Commerce
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-slate-300">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {t("hero.ctaPrimary")}
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              {t("hero.ctaSecondary")}
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>SSR + ISR ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>JWT-secured services</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Redis cache optimized</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <Image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            alt="Featured product"
            width={520}
            height={640}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-white">
            {t("products.title")}
          </h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            {t("hero.ctaPrimary")}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addLabel={t("product.addToCart")}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
