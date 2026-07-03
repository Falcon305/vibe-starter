"use client";

import Script from "next/script";
import { ConsentGate } from "@/components/consent/consent-gate";

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  if (!websiteId || !src) return null;

  return (
    <ConsentGate category="analytics">
      <Script defer data-website-id={websiteId} src={src} strategy="afterInteractive" />
    </ConsentGate>
  );
}
