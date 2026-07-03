import { env } from "@/lib/env";

export const site = {
  name: "vibe-starter",
  description:
    "A secure, legally-complete Next.js starter that scaffolds only the parts your business needs.",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  github: "https://github.com/Falcon305/vibe-starter",
} as const;
