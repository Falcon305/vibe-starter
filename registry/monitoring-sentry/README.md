# monitoring-sentry

Runtime error and performance monitoring with [Sentry](https://sentry.io). Installs the
instrumentation files and wraps `next.config.ts` through the config-plugin extension point.

## Install

```bash
pnpm vibe add monitoring-sentry
pnpm install
```

## Setup

Set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`. For source map upload in CI, set `SENTRY_AUTH_TOKEN`
and add your org and project to `lib/config-plugins/sentry.ts`.

Sentry's ingest host is added to the CSP `connect-src` automatically.
