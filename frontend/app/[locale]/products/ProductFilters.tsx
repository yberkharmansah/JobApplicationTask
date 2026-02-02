"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  labels: {
    filters: string;
    category: string;
    priceRange: string;
    sortBy: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    apply: string;
    reset: string;
  };
};

export default function ProductFilters({ labels }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  const apply = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (sort) params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
  };

  const reset = () => {
    setCategory("");
    setMin("");
    setMax("");
    setSort("");
    router.push("/products");
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{labels.filters}</h3>
        <button
          onClick={reset}
          className="text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:text-white"
        >
          {labels.reset}
        </button>
      </div>
      <label className="text-sm text-slate-300">
        {labels.category}
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Sneaker / Tech / Home"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          {labels.priceRange}
          <input
            value={min}
            onChange={(event) => setMin(event.target.value)}
            placeholder="Min"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </label>
        <label className="text-sm text-slate-300">
          <span className="opacity-0">range</span>
          <input
            value={max}
            onChange={(event) => setMax(event.target.value)}
            placeholder="Max"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </label>
      </div>
      <label className="text-sm text-slate-300">
        {labels.sortBy}
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
        >
          <option value="">{labels.sortNewest}</option>
          <option value="price_asc">{labels.sortPriceAsc}</option>
          <option value="price_desc">{labels.sortPriceDesc}</option>
        </select>
      </label>
      <button
        onClick={apply}
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        {labels.apply}
      </button>
    </div>
  );
}
