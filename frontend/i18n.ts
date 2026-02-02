import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["tr", "en"];

export default getRequestConfig(async ({ locale }) => {
  const activeLocale =
    locale && supportedLocales.includes(locale) ? locale : "tr";

  return {
    locale: activeLocale,
    messages: (await import(`./messages/${activeLocale}.json`)).default
  };
});