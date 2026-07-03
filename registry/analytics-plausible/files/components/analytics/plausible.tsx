"use client";

import Script from "next/script";
import { ConsentGate } from "@/components/consent/consent-gate";

export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <ConsentGate category="analytics">
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    </ConsentGate>
  );
}
