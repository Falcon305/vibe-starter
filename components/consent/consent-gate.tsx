"use client";

import type { ReactNode } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import type { ConsentCategory } from "@/lib/consent/types";

export function ConsentGate({
  category,
  children,
}: {
  category: ConsentCategory;
  children: ReactNode;
}) {
  const { has, ready } = useConsent();
  if (!ready || !has(category)) return null;
  return <>{children}</>;
}
