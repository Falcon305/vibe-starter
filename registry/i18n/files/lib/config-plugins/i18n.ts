import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default function wrap(config: NextConfig): NextConfig {
  return withNextIntl(config);
}
