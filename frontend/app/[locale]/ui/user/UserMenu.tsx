
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { clearAuth, setAuth } from "@/src/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export default function UserMenu() {
  const t = useTranslations("nav");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const email = useAppSelector((state) => state.auth.email);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("authEmail");
    const storedToken = localStorage.getItem("authToken");
    if (storedEmail && storedToken) {
      dispatch(setAuth({ email: storedEmail, token: storedToken }));
    }
    setHydrated(true);
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("authEmail");
    localStorage.removeItem("authToken");
    dispatch(clearAuth());
    router.push("/");
  };

  if (!hydrated) {
    return null;
  }

  if (!email) {
    return (
      <>
        <Link
          href="/auth/login"
          className="rounded-full border border-white/20 px-4 py-2 text-slate-200 transition hover:border-white hover:text-white"
        >
          {t("login")}
        </Link>
        <Link
          href="/auth/register"
          className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {t("register")}
        </Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <div className="flex flex-col text-left text-xs text-slate-200">
        <span className="text-[10px] uppercase tracking-widest text-slate-400">
          {t("signedInAs")}
        </span>
        <span className="font-semibold text-white">{email}</span>
      </div>
      <button
        onClick={logout}
        className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white hover:text-white"
      >
        {t("logout")}
      </button>
    </div>
  );
}