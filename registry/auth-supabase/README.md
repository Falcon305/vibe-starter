# auth-supabase

Hosted email and password authentication with [Supabase Auth](https://supabase.com/auth). Ships a
middleware that refreshes the session on every request while preserving the app's Content Security
Policy, plus sign-in and sign-up pages and server actions. Depends on `db-supabase`, and is a
hosted alternative to `auth-better-auth` — pick one.

## Install

```bash
pnpm vibe add auth-supabase
pnpm install
```

## Setup

Enable the email provider in your Supabase project's auth settings. Protect a page:

```tsx
import { requireUser } from "@/lib/auth-supabase/user";

export default async function Page() {
  const user = await requireUser();
  return <p>Signed in as {user.email}</p>;
}
```

This module replaces `middleware.ts`; removing the module restores the original from a backup.
