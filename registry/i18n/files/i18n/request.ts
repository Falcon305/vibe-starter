import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "es"];
const defaultLocale = "en";

export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get("locale")?.value;
  const locale = requested && locales.includes(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
