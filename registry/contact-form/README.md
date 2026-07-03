# contact-form

A contact form at `/contact` that validates input with Zod, rate-limits by IP, escapes user
content, and emails you each submission through Resend. Depends on `email-resend`.

## Install

```bash
pnpm vibe add contact-form
pnpm install
```

## Setup

Set `CONTACT_EMAIL` in `.env.local` to the address that should receive submissions, plus the
Resend variables from `email-resend`.

## Note on rate limiting

The included limiter is in-memory, which is enough for a single server or local development. On
serverless (Vercel), swap it for a shared store like Upstash or Arcjet so limits hold across
instances.
