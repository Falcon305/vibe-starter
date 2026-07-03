# Module catalog

Install any module with `pnpm vibe add <name>`, or let the `vibe-starter` skill choose for you.
Run `pnpm vibe list` to see what is available in your copy.

## Available

| Module                | Provides  | Depends on  | Notes                                            |
| --------------------- | --------- | ----------- | ------------------------------------------------ |
| `db-drizzle-neon`     | db        | —           | Drizzle + Postgres, Docker Compose for local dev |
| `auth-better-auth`    | auth      | db          | Email/password auth you own                      |
| `dashboard`           | dashboard | auth        | Sign-in, sign-up, protected dashboard            |
| `admin`               | admin     | auth        | Email-allowlisted admin page                     |
| `payments-stripe`     | payments  | auth, email | Subscriptions, portal, verified webhooks         |
| `email-resend`        | email     | —           | Transactional email via Resend                   |
| `notifications`       | —         | auth, email | In-app notifications                             |
| `waitlist`            | —         | db, email   | Email capture before launch                      |
| `contact-form`        | —         | email       | Validated, rate-limited contact form             |
| `blog-mdx`            | blog      | —           | File-based markdown blog with RSS                |
| `analytics-plausible` | analytics | —           | Consent-gated Plausible                          |
| `analytics-umami`     | analytics | —           | Consent-gated Umami                              |

## Roadmap

These capabilities are not yet packaged as modules. The `vibe-build` skill generates them on
demand against the same security checklist, and they will land in the registry over time:

- `teams-orgs` — multi-tenant organizations and roles
- `i18n` — internationalized routing with next-intl
- `ai-chat` — streaming chat with Claude via the AI SDK
- `file-upload` — validated uploads to S3/R2
- `monitoring-sentry` — runtime error tracking
- `auth-clerk`, `auth-supabase`, `db-supabase` — hosted escape hatches for beginners

## Writing your own

See [module-authoring.md](./module-authoring.md).
