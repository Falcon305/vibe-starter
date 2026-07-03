# Changelog

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
