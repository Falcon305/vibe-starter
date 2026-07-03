# auth-clerk

Fully hosted authentication with [Clerk](https://clerk.com), including prebuilt sign-in and sign-up
UI. Ships a middleware that runs Clerk while preserving the app's Content Security Policy. This is a
hosted alternative to `auth-better-auth` — pick one.

## Install

```bash
pnpm vibe add auth-clerk
pnpm install
```

## Setup

1. Wrap `{children}` in `app/layout.tsx`:

   ```tsx
   import { ClerkProvider } from "@clerk/nextjs";
   // <ClerkProvider>{children}</ClerkProvider>
   ```

2. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`.

3. Protect a page with `requireUser` from `@/lib/auth-clerk/user`.

This module replaces `middleware.ts`; removing the module restores the original from a backup.
Clerk's hosts are added to the CSP automatically; for a production custom domain, add
`clerk.yourdomain.com` to `lib/security/csp.ts`.
