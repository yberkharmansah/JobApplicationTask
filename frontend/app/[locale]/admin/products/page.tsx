import { getTranslations } from "next-intl/server";
import ProductAdminClient from "./ProductAdminClient";

export async function generateMetadata() {
  const t = await getTranslations("admin");

  return {
    title: t("title")
  };
}

export default async function AdminProductsPage() {
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("subtitle")}</p>
      </div>
      <ProductAdminClient />
    </div>
  );
}