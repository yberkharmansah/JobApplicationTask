import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always"
});

export const config = {
  matcher: ["/", "/(tr|en)/:path*"]
};