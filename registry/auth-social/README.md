# auth-social

Google and GitHub OAuth sign-in on top of `auth-better-auth`. Each provider is enabled only when
its client id and secret are set, so you can ship just the ones you use.

## Install

```bash
pnpm vibe add auth-social
pnpm install
```

## Setup

For each provider, create an OAuth app, set the redirect URL to
`{your-site}/api/auth/callback/{github|google}`, and put the credentials in `.env.local`
(`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`).

Then drop the buttons onto your sign-in page:

```tsx
import { SocialButtons } from "@/components/auth/social-buttons";

<SocialButtons callbackURL="/dashboard" />;
```
