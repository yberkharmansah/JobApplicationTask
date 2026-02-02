"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { login, register } from "@/src/lib/api";
import { setAuth } from "@/src/store/authSlice";
import { useAppDispatch } from "@/src/store/hooks";

type Props = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: Props) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasLetterAndNumber = (value: string) =>
    /[A-Za-z]/.test(value) && /\d/.test(value);

  const validateInputs = () => {
    if (email.length < 5 || email.length > 100) {
      setStatus(t("auth.emailHint"));
      return false;
    }
    if (password.length < 5 || password.length > 25 || !hasLetterAndNumber(password)) {
      setStatus(t("auth.passwordHint"));
      return false;
    }
    if (mode === "register" && password !== confirmPassword) {
      setStatus(t("auth.passwordMismatch"));
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      if (!validateInputs()) {
        setLoading(false);
        return;
      }
      const handler = mode === "login" ? login : register;
      const response = await handler({ email, password });
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authEmail", response.email);
      localStorage.setItem("authRole", response.role);
      dispatch(
        setAuth({ email: response.email, token: response.token, role: response.role })
      );
      setStatus(t("auth.success"));
      router.push("/");
    } catch (error) {
      console.error("AuthForm submit failed", error);
      setStatus("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8"
    >
      <label className="text-sm text-slate-300">
        {t("auth.email")}
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          minLength={5}
          maxLength={100}
          title={t("auth.emailHint")}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
        />
      </label>
      {mode === "register" ? (
        <p className="text-xs text-slate-400">{t("auth.emailHint")}</p>
      ) : null}
      <label className="text-sm text-slate-300">
        {t("auth.password")}
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={5}
          maxLength={25}
          title={t("auth.passwordHint")}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
        />
      </label>
      {mode === "register" ? (
        <label className="text-sm text-slate-300">
          {t("auth.confirmPassword")}
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={5}
            maxLength={25}
            title={t("auth.passwordHint")}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white"
          />
        </label>
      ) : null}
      {mode === "register" ? (
        <p className="text-xs text-slate-400">{t("auth.passwordHint")}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {mode === "login" ? t("auth.loginButton") : t("auth.registerButton")}
      </button>
      {status ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {status}
        </p>
      ) : null}
      <Link
        href={mode === "login" ? "/auth/register" : "/auth/login"}
        className="text-xs font-semibold text-indigo-200 transition hover:text-indigo-100"
      >
        {mode === "login"
          ? t("auth.switchToRegister")
          : t("auth.switchToLogin")}
      </Link>
    </form>
  );
}