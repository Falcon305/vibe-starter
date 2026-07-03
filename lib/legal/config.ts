import type { ConsentCategory } from "@/lib/consent/types";
import {
  moduleCookies,
  moduleDataCollected,
  moduleSubprocessors,
} from "@/lib/legal/modules.generated";
import { site } from "@/lib/site";

export type Jurisdiction = "eu" | "us" | "global";

export type Subprocessor = {
  name: string;
  purpose: string;
  url?: string;
};

export type CookieEntry = {
  name: string;
  category: ConsentCategory;
  purpose: string;
  provider: string;
  retention: string;
};

export type LegalConfig = {
  companyName: string;
  legalEntity: string;
  contactEmail: string;
  address: string;
  jurisdiction: Jurisdiction;
  governingLaw: string;
  collectsPersonalData: boolean;
  sellsData: boolean;
  effectiveDate: string;
  dataCollected: string[];
  subprocessors: Subprocessor[];
  cookies: CookieEntry[];
};

export const legalConfig: LegalConfig = {
  companyName: "Your Company",
  legalEntity: "Your Company, Inc.",
  contactEmail: "privacy@example.com",
  address: "123 Example Street, City, Country",
  jurisdiction: "global",
  governingLaw: "the State of Delaware, United States",
  collectsPersonalData: true,
  sellsData: false,
  effectiveDate: "2026-01-01",
  dataCollected: [
    "Contact details you submit, such as your name and email address",
    "Account credentials, if you create an account",
    "Usage, device, and log information collected automatically",
    ...moduleDataCollected,
  ],
  subprocessors: [
    {
      name: "Vercel",
      purpose: "Application hosting and content delivery",
      url: "https://vercel.com/legal/privacy-policy",
    },
    ...moduleSubprocessors,
  ],
  cookies: [
    {
      name: "vs-consent",
      category: "necessary",
      purpose: "Stores your cookie preferences",
      provider: site.name,
      retention: "1 year",
    },
    {
      name: "theme",
      category: "necessary",
      purpose: "Remembers your light or dark mode choice",
      provider: site.name,
      retention: "1 year",
    },
    ...moduleCookies,
  ],
};

export function includesEu(config: LegalConfig): boolean {
  return config.jurisdiction === "eu" || config.jurisdiction === "global";
}

export function includesUs(config: LegalConfig): boolean {
  return config.jurisdiction === "us" || config.jurisdiction === "global";
}
