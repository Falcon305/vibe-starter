"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  defaultConsent,
  parseConsent,
  serializeConsent,
} from "@/lib/consent/consent";
import type { ConsentCategory, ConsentState } from "@/lib/consent/types";

type ConsentContextValue = {
  categories: ConsentState;
  decided: boolean;
  ready: boolean;
  save: (categories: ConsentState) => void;
  has: (category: ConsentCategory) => boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

function readConsentCookie(): string {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
      ?.split("=")[1] ?? ""
  );
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readConsentCookie, () => "");
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const record = useMemo(() => parseConsent(raw || undefined), [raw]);
  const categories = useMemo(() => record?.categories ?? defaultConsent(), [record]);
  const decided = record?.decided ?? false;

  const save = useCallback((next: ConsentState) => {
    document.cookie = `${CONSENT_COOKIE}=${serializeConsent(next)}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`;
    notify();
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      categories,
      decided,
      ready,
      save,
      has: (category) => categories[category],
    }),
    [categories, decided, ready, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within ConsentProvider");
  return context;
}
