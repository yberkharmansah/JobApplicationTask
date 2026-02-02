import { getTranslations } from "next-intl/server";
import { fetchProducts } from "@/src/lib/api";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

type Props = {
  searchParams?: {
    category?: string;
    min?: string;
    max?: string;
    sort?: string;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = searchParams ?? {};
  const t = await getTranslations();
  const products = await fetchProducts(params);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProductFilters
          labels={{
            filters: t("products.filters"),
            category: t("products.category"),
            priceRange: t("products.priceRange"),
            sortBy: t("products.sortBy"),
            sortNewest: t("products.sortNewest"),
            sortPriceAsc: t("products.sortPriceAsc"),
            sortPriceDesc: t("products.sortPriceDesc"),
            apply: t("products.apply"),
            reset: t("products.reset")
          }}
        />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              {t("products.title")}
            </h1>
            <span className="text-sm text-slate-400">
              {products.length} items
            </span>
          </div>
          {products.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              {t("products.empty")}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addLabel={t("product.addToCart")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
