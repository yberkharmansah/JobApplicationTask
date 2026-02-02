import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { fetchProduct } from "@/src/lib/api";
import AddToCartButton from "./AddToCartButton";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const { id } = params;
  const product = await fetchProduct(id);

  return {
    title: product.name,
    description: product.description?.slice(0, 140)
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const t = await getTranslations();
  const product = await fetchProduct(id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <Link
        href="/products"
        className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
      >
        ← {t("product.backToProducts")}
      </Link>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <Image
            src={product.imageUrl || "https://via.placeholder.com/800x600.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              {t("product.details")}
            </span>
            <h1 className="text-3xl font-semibold text-white">
              {product.name}
            </h1>
            <p className="text-slate-300">{product.description}</p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>{t("product.categoryLabel")}</span>
              <span className="font-semibold text-white">
                {product.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("product.priceLabel")}</span>
              <span className="text-lg font-semibold text-white">
                {product.price.toFixed(2)} ₺
              </span>
            </div>
            <AddToCartButton
              product={product}
              label={t("product.addToCart")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}