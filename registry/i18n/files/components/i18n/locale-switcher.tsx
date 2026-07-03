"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const locales = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function LocaleSwitcher() {
  const router = useRouter();

  function setLocale(locale: string) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Button key={locale.code} variant="ghost" size="sm" onClick={() => setLocale(locale.code)}>
          {locale.label}
        </Button>
      ))}
    </div>
  );
}
