# analytics-umami

Privacy-friendly analytics through [Umami](https://umami.is), self-hostable or cloud. The script
is wrapped in a `ConsentGate`, so it loads only after analytics consent.

## Install

```bash
pnpm vibe add analytics-umami
```

## After installing

1. Render `<UmamiAnalytics />` in `app/layout.tsx` inside `<body>`.
2. Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_SRC` in `.env.local`.
3. If you self-host Umami, add your host to `connect-src` and `script-src` in `lib/security/csp.ts`.
