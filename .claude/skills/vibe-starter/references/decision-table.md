# Decision table

Map answers to a concrete module set. The base (security headers, CSP, legal pages, consent,
SEO) is always present, so nothing here covers it.

## Availability

Always run `pnpm vibe list` first and install only what it shows. All twenty catalog modules ship
in the registry: `db-drizzle-neon`, `db-supabase`, `auth-better-auth`, `auth-supabase`,
`auth-clerk`, `dashboard`, `admin`, `teams-orgs`, `file-upload`, `payments-stripe`, `email-resend`,
`notifications`, `waitlist`, `contact-form`, `blog-mdx`, `analytics-plausible`, `analytics-umami`,
`ai-chat`, `i18n`, `monitoring-sentry`.

Anything the catalog does not cover is built on demand with the `vibe-build` skill, which keeps the
code to the same security bar.

## Capabilities to default modules

| Capability           | Default module        | Requires                 |
| -------------------- | --------------------- | ------------------------ |
| Authentication       | `auth-better-auth`    | `db-drizzle-neon`        |
| Database             | `db-drizzle-neon`     | —                        |
| Payments             | `payments-stripe`     | auth, db, `email-resend` |
| Transactional email  | `email-resend`        | —                        |
| App dashboard        | `dashboard`           | auth, db                 |
| Admin panel          | `admin`               | auth, db                 |
| Teams / multi-tenant | `teams-orgs`          | auth, db                 |
| Waitlist             | `waitlist`            | `email-resend`           |
| Contact form         | `contact-form`        | `email-resend`           |
| Blog / content       | `blog-mdx`            | —                        |
| Analytics            | `analytics-plausible` | —                        |
| Internationalization | `i18n`                | —                        |
| AI chat              | `ai-chat`             | —                        |
| File uploads         | `file-upload`         | —                        |
| Error monitoring     | `monitoring-sentry`   | —                        |

## Escape hatches for beginners

If the user wants zero-config hosted services instead of owning the stack:

- Hosted auth → `auth-clerk` instead of `auth-better-auth`.
- Hosted database + auth → `auth-supabase` + `db-supabase`.

Recommend the owned default (`auth-better-auth` + `db-drizzle-neon`) unless the user explicitly
wants a hosted option.

## Business type shortcuts

- **Landing page / waitlist**: `waitlist` + `email-resend` + `analytics-plausible`. No auth.
- **Blog / personal site**: `blog-mdx` + `contact-form` + `email-resend`.
- **SaaS**: `auth-better-auth` + `db-drizzle-neon` + `dashboard` + `payments-stripe` + `email-resend`.
- **Marketplace / community**: add `teams-orgs` and `file-upload`.
- **Internal tool**: `auth-better-auth` + `db-drizzle-neon` + `dashboard` + `admin`. No payments.

Always resolve required dependencies; the installer does this, but plan for the env and setup they
add (a database URL, a Stripe key, a Resend key).
