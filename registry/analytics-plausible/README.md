# analytics-plausible

Privacy-friendly analytics through [Plausible](https://plausible.io). The script is wrapped in
a `ConsentGate`, so it loads only after the visitor grants analytics consent.

## Install

```bash
pnpm vibe add analytics-plausible
```

## After installing

1. Render the component in `app/layout.tsx` inside `<body>`:

   ```tsx
   import { PlausibleAnalytics } from "@/components/analytics/plausible";
   // ...
   <PlausibleAnalytics />;
   ```

2. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.local` to the domain you registered in Plausible.

The module extends the Content Security Policy `connect-src` to allow `plausible.io`, and adds
Plausible to the subprocessor list in your privacy policy automatically.
