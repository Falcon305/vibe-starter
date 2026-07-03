# waitlist

Collect emails before launch. Validates and rate-limits submissions, stores them in Postgres, and
sends a confirmation email. Depends on `db-drizzle-neon` and `email-resend`.

## Install

```bash
pnpm vibe add waitlist
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Use

Visit `/waitlist`, or drop `<WaitlistForm />` onto your landing page. Emails are stored uniquely in
the `waitlist` table, so duplicates are ignored.
