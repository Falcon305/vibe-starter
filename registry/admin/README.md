# admin

A role-gated admin page at `/admin` that lists users. Access is restricted to an email allowlist,
so it works without adding roles to your schema. Depends on `auth-better-auth`.

## Install

```bash
pnpm vibe add admin
pnpm install
```

## Setup

Set `ADMIN_EMAILS` in `.env.local` to a comma-separated list of admin emails:

```
ADMIN_EMAILS=you@example.com,partner@example.com
```

Use `requireAdmin()` from `@/lib/admin/guard` to protect your own admin-only server code.
