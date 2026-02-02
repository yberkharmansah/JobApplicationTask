import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-semibold text-white">{t("headline")}</p>
          <p className="text-sm text-slate-400">
            Pulse Commerce · Next.js &amp; Redux Toolkit
          </p>
        </div>
        <button className="rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
          {t("cta")}
        </button>
      </div>
    </footer>
  );
}
