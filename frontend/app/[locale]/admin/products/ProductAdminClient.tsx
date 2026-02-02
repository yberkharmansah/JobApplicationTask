"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/src/types/product";
import {
  createProduct,
  deleteProduct,
  fetchProductsClient,
  updateProduct
} from "@/src/lib/api";
import { useAppSelector } from "@/src/store/hooks";

type FormState = Omit<Product, "id">;

const emptyForm: FormState = {
  name: "",
  description: "",
  price: 0,
  category: "",
  imageUrl: ""
};

export default function ProductAdminClient() {
  const t = useTranslations("admin");
  const token = useAppSelector((state) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadProducts = async () => {
    const data = await fetchProductsClient({});
    setProducts(data);
  };

  useEffect(() => {
    loadProducts().catch(() => {
      setStatus(t("loadError"));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "price" ? Number(value) : value
    }));
    if (key === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!token) {
      setStatus(t("authRequired"));
      return;
    }
    if (!form.imageUrl) {
      setStatus(t("imageUrlRequired"));
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form, token);
        setStatus(t("updateSuccess"));
      } else {
        await createProduct(form, token);
        setStatus(t("createSuccess"));
      }
      setForm(emptyForm);
      setImagePreview(null);
      setEditingId(null);
      await loadProducts();
    } catch {
      setStatus(t("saveError"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl ?? ""
    });
    setImagePreview(product.imageUrl ?? null);
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setStatus(t("authRequired"));
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await deleteProduct(id, token);
      await loadProducts();
      setStatus(t("deleteSuccess"));
    } catch {
      setStatus(t("deleteError"));
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {editingId ? t("editTitle") : t("createTitle")}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:text-white"
            >
              {t("cancel")}
            </button>
          ) : null}
        </div>
        <label className="text-sm text-slate-300">
          {t("name")}
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
          />
        </label>
        <label className="text-sm text-slate-300">
          {t("description")}
          <textarea
            required
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="mt-2 min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            {t("price")}
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
            />
          </label>
          <label className="text-sm text-slate-300">
            {t("category")}
            <input
              required
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
            />
          </label>
        </div>
        <label className="text-sm text-slate-300">
          {t("imageUrl")}
          <input
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
          />
        </label>
        {imagePreview ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {t("preview")}
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={imagePreview}
                alt={t("previewAlt")}
                className="h-48 w-full object-cover"
              />
            </div>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
        >
          {editingId ? t("updateButton") : t("createButton")}
        </button>
        {status ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            {status}
          </p>
        ) : null}
      </form>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">{t("listTitle")}</h2>
        <div className="flex flex-col gap-3">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              {t("empty")}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {product.category} · {product.price.toFixed(2)} ₺
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white hover:text-white"
                    >
                      {t("editButton")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
                    >
                      {t("deleteButton")}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  {product.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}