import { getTranslations } from "next-intl/server";
import AuthForm from "../AuthForm";

export default async function LoginPage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Pulse Access
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {t("auth.title")}
        </h1>
        <p className="text-base text-slate-300">{t("auth.subtitle")}</p>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <p>JWT + Redis + CQRS ready backend.</p>
          <p>Use your credentials to get a fresh token.</p>
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}