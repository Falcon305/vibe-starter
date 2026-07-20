# Changelog

## 1.1.0 — 2026-07-20

### Added

- Four modules: `auth-social` (Google and GitHub OAuth through a generated `socialProviders`
  seam), `auth-passkeys` (WebAuthn via `@better-auth/passkey`), `auth-2fa` (TOTP with backup
  codes), and `rate-limit-upstash` (distributed rate limiting that swaps in for the in-memory
  default).
- CLI commands: `vibe search` to find modules, `vibe update` to pull registry fixes into an
  installed module, and `vibe doctor` to audit the installed set for capability conflicts, route
  collisions, lockfile drift, missing env, client-side secret reads, and CSP damage.
- Install-time enforcement: two modules providing the same exclusive capability (`auth`, `db`)
  can no longer be installed together.
- Vitest unit suite covering the CSP builder, rate limiting, and module resolution, plus a
  Playwright end-to-end suite asserting security headers, the nonce-based CSP, legal pages, the
  consent banner, and an axe accessibility pass.
- CI now gates on unit tests, a production `pnpm audit`, dependency review on pull requests, a
  `vibe doctor` smoke install, and the Playwright suite.
- Dynamic Open Graph image, structured logger wired into the error boundaries, and a demo app
  scaffolded from the starter linked from the README.

### Changed

- `rateLimit` is async so distributed backends can implement the same signature.
- The base `user` table carries `two_factor_enabled`, matching the Better Auth CLI schema.

## 1.0.0 — 2026-07-03

### Added

- Secure Next.js 16 base: nonce-based CSP, hardened headers, typed and validated environment,
  SEO, health check, themed marketing shell.
- Legal and consent: config-driven privacy, terms, and cookie pages with GDPR and CCPA sections,
  a compliant consent banner, consent-gated scripts, and a Do Not Sell control.
- Registry engine and `vibe` CLI: install and remove feature modules that merge dependencies,
  environment variables, scripts, database schema, CSP sources, `next.config` plugins, Better Auth
  plugins, and legal contributions. Overwritten base files are backed up and restored on removal.
- Twenty modules across the full stack:
  - Data and auth: `db-drizzle-neon`, `db-supabase`, `auth-better-auth`, `auth-supabase`,
    `auth-clerk`.
  - App surface: `dashboard`, `admin`, `teams-orgs`, `file-upload`.
  - Monetization and comms: `payments-stripe`, `email-resend`, `notifications`.
  - Growth and content: `waitlist`, `contact-form`, `blog-mdx`, `analytics-plausible`,
    `analytics-umami`.
  - AI, i18n, and ops: `ai-chat`, `i18n`, `monitoring-sentry`.
- Skills: `vibe-starter`, `vibe-build`, `vibe-security`, `vibe-legal`.
- Documentation: architecture, security model, module catalog, module authoring, and deployment.
