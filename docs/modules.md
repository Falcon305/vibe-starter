# Module catalog

Install any module with `pnpm vibe add <name>`, or let the `vibe-starter` skill choose for you.
Run `pnpm vibe list` to see what is available in your copy.

## Data and auth

| Module             | Provides | Depends on | Notes                                            |
| ------------------ | -------- | ---------- | ------------------------------------------------ |
| `db-drizzle-neon`  | db       | —          | Drizzle + Postgres, Docker Compose for local dev |
| `db-supabase`      | db       | —          | Hosted Postgres via the Supabase client          |
| `auth-better-auth` | auth     | db         | Email/password auth you own                      |
| `auth-supabase`    | auth     | db         | Hosted Supabase auth with SSR session refresh    |
| `auth-clerk`       | auth     | —          | Fully hosted auth with prebuilt UI               |

Pick one `db` and one `auth`. The Supabase and Clerk modules are hosted escape hatches for
beginners; the Better Auth + Drizzle default keeps your users in your own database.

## App surface

| Module        | Provides  | Depends on       | Notes                                  |
| ------------- | --------- | ---------------- | -------------------------------------- |
| `dashboard`   | dashboard | auth             | Sign-in, sign-up, protected dashboard  |
| `admin`       | admin     | auth             | Email-allowlisted admin page           |
| `teams-orgs`  | teams     | auth-better-auth | Organizations, members, roles, invites |
| `file-upload` | —         | auth-better-auth | Authenticated presigned S3/R2 uploads  |

## Monetization and comms

| Module            | Provides | Depends on  | Notes                                    |
| ----------------- | -------- | ----------- | ---------------------------------------- |
| `payments-stripe` | payments | auth, email | Subscriptions, portal, verified webhooks |
| `email-resend`    | email    | —           | Transactional email via Resend           |
| `notifications`   | —        | auth, email | In-app notifications                     |

## Growth and content

| Module                | Provides  | Depends on | Notes                                |
| --------------------- | --------- | ---------- | ------------------------------------ |
| `waitlist`            | —         | db, email  | Email capture before launch          |
| `contact-form`        | —         | email      | Validated, rate-limited contact form |
| `blog-mdx`            | blog      | —          | File-based markdown blog with RSS    |
| `analytics-plausible` | analytics | —          | Consent-gated Plausible              |
| `analytics-umami`     | analytics | —          | Consent-gated Umami                  |

## AI, i18n, and ops

| Module              | Provides   | Depends on | Notes                                  |
| ------------------- | ---------- | ---------- | -------------------------------------- |
| `ai-chat`           | ai-chat    | —          | Streaming Claude chat via the AI SDK   |
| `i18n`              | i18n       | —          | Cookie-based locales with next-intl    |
| `monitoring-sentry` | monitoring | —          | Runtime error and performance tracking |

## Writing your own

See [module-authoring.md](./module-authoring.md).
