# i18n

Internationalization with [next-intl](https://next-intl.dev), using a cookie to select the locale
so no locale-prefixed routing or extra middleware is needed.

## Install

```bash
pnpm vibe add i18n
pnpm install
```

## Setup

1. Wrap `{children}` in `app/layout.tsx`:

   ```tsx
   import { NextIntlClientProvider } from "next-intl";
   // ...
   <NextIntlClientProvider>{children}</NextIntlClientProvider>;
   ```

2. Add translations as `messages/<locale>.json`.

3. Read them:

   ```tsx
   import { getTranslations } from "next-intl/server";
   const t = await getTranslations("common");
   t("greeting");
   ```

Drop `<LocaleSwitcher />` anywhere to let visitors change language.
