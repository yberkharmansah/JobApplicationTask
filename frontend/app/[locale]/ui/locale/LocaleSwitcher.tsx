"use client";

import Link from "next-intl/link";

type Props = {
  currentLocale: string;
};

const locales = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" }
];

export default function LocaleSwitcher({ currentLocale }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href="/"
          locale={locale.code}
          className={`rounded-full px-2 py-1 transition ${
            currentLocale === locale.code
              ? "bg-white text-slate-900"
              : "text-slate-200 hover:text-white"
          }`}
        >
          {locale.label}
        </Link>
      ))}
    </div>
  );
}
