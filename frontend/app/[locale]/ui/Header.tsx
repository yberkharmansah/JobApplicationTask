import Link from "next-intl/link";
import { getTranslations } from "next-intl/server";
import CartBadge from "./cart/CartBadge";
import LocaleSwitcher from "./locale/LocaleSwitcher";

type Props = {
  locale: string;
};

export default async function Header({ locale }: Props) {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Pulse
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-200 md:flex">
            <Link href="/" className="transition hover:text-white">
              {t("home")}
            </Link>
            <Link href="/products" className="transition hover:text-white">
              {t("products")}
            </Link>
            <Link href="/cart" className="transition hover:text-white">
              {t("cart")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <LocaleSwitcher currentLocale={locale} />
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
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
