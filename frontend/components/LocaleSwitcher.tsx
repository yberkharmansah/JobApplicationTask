"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const href =
    pathname === "/products/[id]"
      ? {
          pathname,
          params: { id: String(params?.id ?? "") },
        }
      : pathname;

  return (
    <div className="flex items-center gap-2 text-sm">
      {locales.map((option) => (
        <Link
          key={option}
          href={href}
          locale={option}
          className={`rounded-full border px-3 py-1 ${
            option === locale ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200"
          }`}
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}