# Environment variables

Every env key is declared, typed, and validated at build time through `lib/env.ts` — the app
refuses to build with a missing required key rather than failing at runtime. Module keys are
generated into `lib/env.generated.ts` when the module installs, and `pnpm vibe add` appends each
new key to `.env.example`.

Put real values in `.env.local` (gitignored). Never commit them. Keys marked **secret** are
server-only and can never reach the client; only `NEXT_PUBLIC_*` keys are exposed to the browser.

## Base

| Key                    | Required | Notes                                                   |
| ---------------------- | -------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | yes      | The canonical URL, e.g. `http://localhost:3000` in dev. |

## Per module

| Module                | Key                                                      | Required | Secret             | Notes                                             |
| --------------------- | -------------------------------------------------------- | -------- | ------------------ | ------------------------------------------------- |
| `db-drizzle-neon`     | `DATABASE_URL`                                           | yes      | yes                | Postgres connection string (pooled URL on Neon).  |
| `db-supabase`         | `NEXT_PUBLIC_SUPABASE_URL`                               | yes      | no                 | Supabase project URL.                             |
| `db-supabase`         | `NEXT_PUBLIC_SUPABASE_ANON_KEY`                          | yes      | no                 | Supabase anon key.                                |
| `auth-better-auth`    | `BETTER_AUTH_SECRET`                                     | yes      | yes                | 32+ random characters; signs sessions.            |
| `auth-clerk`          | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`                      | yes      | no                 | Clerk publishable key.                            |
| `auth-clerk`          | `CLERK_SECRET_KEY`                                       | yes      | yes                | Clerk secret key.                                 |
| `auth-social`         | `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`              | no       | id no / secret yes | GitHub OAuth app; provider is skipped when unset. |
| `auth-social`         | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`              | no       | id no / secret yes | Google OAuth app; provider is skipped when unset. |
| `email-resend`        | `RESEND_API_KEY`                                         | yes      | yes                | From the Resend dashboard.                        |
| `email-resend`        | `EMAIL_FROM`                                             | yes      | no                 | Verified sender address.                          |
| `contact-form`        | `CONTACT_EMAIL`                                          | yes      | no                 | Where submissions are sent.                       |
| `payments-stripe`     | `STRIPE_SECRET_KEY`                                      | yes      | yes                | Stripe secret key (test mode until launch).       |
| `payments-stripe`     | `STRIPE_WEBHOOK_SECRET`                                  | yes      | yes                | Signing secret for the webhook endpoint.          |
| `payments-stripe`     | `STRIPE_PRICE_ID`                                        | yes      | no                 | The recurring price checkout subscribes to.       |
| `file-upload`         | `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`              | yes      | yes                | Storage credentials.                              |
| `file-upload`         | `S3_BUCKET` / `S3_REGION`                                | yes      | no                 | Bucket and region (`auto` for R2).                |
| `file-upload`         | `S3_ENDPOINT`                                            | no       | no                 | Custom endpoint for R2 or S3-compatible storage.  |
| `admin`               | `ADMIN_EMAILS`                                           | yes      | no                 | Comma-separated allowlist for the admin panel.    |
| `ai-chat`             | `ANTHROPIC_API_KEY`                                      | yes      | yes                | From the Anthropic console.                       |
| `analytics-plausible` | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`                           | no       | no                 | Domain registered in Plausible.                   |
| `analytics-umami`     | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` / `NEXT_PUBLIC_UMAMI_SRC` | no       | no                 | Umami site ID and script URL.                     |
| `monitoring-sentry`   | `NEXT_PUBLIC_SENTRY_DSN`                                 | no       | no                 | Sentry project DSN.                               |
| `rate-limit-upstash`  | `UPSTASH_REDIS_REST_URL`                                 | yes      | no                 | Upstash Redis REST URL.                           |
| `rate-limit-upstash`  | `UPSTASH_REDIS_REST_TOKEN`                               | yes      | yes                | Upstash Redis REST token.                         |

`pnpm vibe doctor` warns about any required key an installed module needs that is missing from
`.env.local`. `pnpm vibe info <module>` shows a single module's keys.
