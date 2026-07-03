# Security model

Every app scaffolded from vibe-starter ships these defaults. They are the reason the project
exists: a non-expert should not be able to ship an insecure site by accident.

## Headers and CSP

`next.config.ts` sets HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, a strict
`Referrer-Policy`, and a locked-down `Permissions-Policy`. `X-Powered-By` is removed.

`middleware.ts` sets a per-request **nonce-based Content Security Policy**. In production the
`script-src` is `'self' 'nonce-…' 'strict-dynamic'` with no `unsafe-inline` and no `unsafe-eval`.
Next.js applies the nonce to its own scripts, and modules extend the policy through
`lib/security/csp.generated.ts` rather than weakening it.

Styles use `'unsafe-inline'` deliberately: nonce-based styles break React and Tailwind hydration,
and style injection is a far weaker vector than script injection. Scripts are the strict part.

## Environment variables

`lib/env.ts` validates every variable with Zod at build time through `@t3-oss/env-nextjs`. A
missing or malformed variable fails the build instead of surfacing as a runtime surprise. Server
secrets are never exposed to the client, and modules add their own validated variables through
`lib/env.generated.ts`.

## Input and data

- Every input crossing a trust boundary is parsed with a Zod schema.
- Mutations run in server actions or POST route handlers, never on a GET.
- Database access goes through Drizzle with parameterized queries only.
- User-supplied HTML is escaped or sanitized before it is rendered or emailed.

## Authentication

The `auth-better-auth` module stores users in your own Postgres with HttpOnly, Secure, SameSite
session cookies and hashed passwords. Server code guards work with `requireSession()`, and should
check ownership, not just authentication.

## Abuse resistance

Unauthenticated forms and public endpoints are rate-limited. The bundled limiter is in-memory,
which is correct for a single server; on serverless, move to a shared store such as Upstash or
Arcjet so limits hold across instances.

## Secrets and supply chain

`.env.local` is gitignored; only `.env.example` is committed. A gitleaks scan runs in the
pre-commit hook and in CI. `pnpm audit` runs in CI, and Renovate keeps dependencies current.

## Auditing

Run the `vibe-security` skill before shipping. It checks headers, secret exposure, input
validation, authorization, dependencies, and accessibility, and reports findings by severity.
