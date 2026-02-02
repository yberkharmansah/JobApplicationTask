"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";

type Labels = {
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

type Props = {
  labels: Labels;
};

type FilterState = {
  category: string;
  min: string;
  max: string;
  sort: string;
};

export default function ProductFilters({ labels }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = useMemo<FilterState>(
    () => ({
      category: searchParams.get("category") ?? "",
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      sort: searchParams.get("sort") ?? ""
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const buildParams = useCallback((current: FilterState) => {
    const params = new URLSearchParams();
    if (current.category) params.set("category", current.category);
    if (current.min) params.set("min", current.min);
    if (current.max) params.set("max", current.max);
    if (current.sort) params.set("sort", current.sort);
    return params;
  }, []);

  const apply = useCallback(() => {
    const params = buildParams(filters);
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products");
    router.refresh();
  }, [buildParams, filters, router]);

  const reset = useCallback(() => {
    const emptyState = { category: "", min: "", max: "", sort: "" };
    setFilters(emptyState);
    router.push("/products");
    router.refresh();
  }, [router]);

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
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
          placeholder="Sneaker / Tech / Home"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          {labels.priceRange}
          <input
            value={filters.min}
            onChange={(event) => updateFilter("min", event.target.value)}
            placeholder="Min"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </label>
        <label className="text-sm text-slate-300">
          <span className="opacity-0">range</span>
          <input
            value={filters.max}
            onChange={(event) => updateFilter("max", event.target.value)}
            placeholder="Max"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </label>
      </div>
      <label className="text-sm text-slate-300">
        {labels.sortBy}
        <select
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value)}
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