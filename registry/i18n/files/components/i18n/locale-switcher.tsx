"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const locales = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

function persistLocale(locale: string) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleSwitcher() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Button
          key={locale.code}
          variant="ghost"
          size="sm"
          onClick={() => {
            persistLocale(locale.code);
            router.refresh();
          }}
        >
          {locale.label}
        </Button>
      ))}
    </div>
  );
}
