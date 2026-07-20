import { z } from "zod";
import type { ConsentCategory, ConsentRecord, ConsentState } from "@/lib/consent/types";

const consentRecordSchema = z.object({
  version: z.number(),
  decided: z.boolean().default(false),
  categories: z
    .object({
      necessary: z.boolean().default(true),
      analytics: z.boolean().default(false),
      marketing: z.boolean().default(false),
    })
    .default({ necessary: true, analytics: false, marketing: false }),
});

export const CONSENT_COOKIE = "vs-consent";
const CONSENT_VERSION = 1;
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
    const parsed = consentRecordSchema.safeParse(JSON.parse(decodeURIComponent(value)));
    if (!parsed.success || parsed.data.version !== CONSENT_VERSION) return null;
    return {
      version: parsed.data.version,
      decided: parsed.data.decided,
      categories: { ...parsed.data.categories, necessary: true },
    };
  } catch {
    return null;
  }
}
