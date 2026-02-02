import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Footer from "./ui/Footer";
import Header from "./ui/Header";
import Providers from "./ui/Providers";

export const metadata: Metadata = {
  title: {
    default: "Pulse Commerce",
    template: "%s | Pulse Commerce"
  },
  description:
    "Multi-language, SEO-focused commerce experience powered by Next.js.",
  metadataBase: new URL("http://localhost:3000")
};

const supportedLocales = ["tr", "en"];

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex min-h-screen flex-col bg-slate-950 text-white">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
