# dashboard

Sign-in, sign-up, and a protected dashboard, wired to Better Auth. Depends on `auth-better-auth`.

## Install

```bash
pnpm vibe add dashboard
pnpm install
```

This pulls in `auth-better-auth` and `db-drizzle-neon`. Follow their setup (database URL, secret,
migrations) and you have working authentication with pages at `/sign-in`, `/sign-up`, and a
protected `/dashboard`.

## Extend

`app/dashboard/page.tsx` reads the session with `getSession()` and redirects to `/sign-in` when
there is none. Add your own protected pages the same way, or with `requireSession()`.
