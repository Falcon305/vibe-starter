import type { ConsentCategory, ConsentRecord, ConsentState } from "@/lib/consent/types";

export const CONSENT_COOKIE = "vs-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export const consentCategories: {
  id: ConsentCategory;
  label: string;
  description: string;
  locked: boolean;
}[] = [
  {
    id: "necessary",
    label: "Strictly necessary",
    description: "Required for the site to function. These cannot be turned off.",
    locked: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Help us understand how the site is used so we can improve it.",
    locked: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Used to measure campaigns and personalize what you see.",
    locked: false,
  },
];

export function defaultConsent(): ConsentState {
  return { necessary: true, analytics: false, marketing: false };
}

export function acceptAll(): ConsentState {
  return { necessary: true, analytics: true, marketing: true };
}

export function rejectAll(): ConsentState {
  return defaultConsent();
}

export function serializeConsent(categories: ConsentState): string {
  const record: ConsentRecord = { version: CONSENT_VERSION, decided: true, categories };
  return encodeURIComponent(JSON.stringify(record));
}

export function parseConsent(value: string | undefined): ConsentRecord | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: parsed.version,
      decided: Boolean(parsed.decided),
      categories: { ...defaultConsent(), ...parsed.categories, necessary: true },
    };
  } catch {
    return null;
  }
}
