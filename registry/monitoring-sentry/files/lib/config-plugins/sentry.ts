import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

export default function wrap(config: NextConfig): NextConfig {
  return withSentryConfig(config, { silent: true });
}
