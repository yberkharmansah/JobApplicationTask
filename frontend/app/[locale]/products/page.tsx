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

export async function generateMetadata() {
  const t = await getTranslations("products");

  return {
    title: t("title")
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const t = await getTranslations();
  const products = await fetchProducts({
    category: searchParams?.category,
    min: searchParams?.min,
    max: searchParams?.max,
    sort: searchParams?.sort,
    revalidate: 0
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">
          {t("nav.products")}
        </h1>
        <p className="text-sm text-slate-400">{t("hero.subtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
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
        {products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
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
  );
}
