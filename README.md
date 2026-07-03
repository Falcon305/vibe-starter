# vibe-starter

A production-ready Next.js starter for people who want to ship a real website without
first becoming a security engineer or a privacy lawyer.

Most starter templates hand you an empty app and wish you luck. vibe-starter is different:
it is a **secure base** plus a **library of feature modules**, driven by **Claude Code skills**
that interview you about your business idea and assemble only the parts you actually need —
with the legal pages, cookie consent, and security hardening already done the way a senior
engineer would do them.

## What you get out of the box

- Nonce-based Content Security Policy and a full set of security headers
- Typed, validated environment variables that fail the build when misconfigured
- GDPR / CCPA legal pages and a compliant cookie-consent banner, tailored to the data you collect
- Accessible, responsive marketing shell with light and dark themes
- Secret scanning, strict TypeScript, linting, and formatting wired into every commit

## Quickstart

```bash
git clone https://github.com/Falcon305/vibe-starter my-app
cd my-app
pnpm install
cp .env.example .env.local
pnpm dev
```

Then, inside Claude Code, run the scaffolder:

```
/vibe-starter
```

Describe your business in plain English. The skill figures out which modules you need,
installs them, generates your legal pages, and leaves you with a running, deployable app.

## The skills

- `/vibe-starter` — interview you and scaffold a tailored app
- `/vibe-build` — add features by prompting while staying secure and production-ready
- `/vibe-security` — audit the current app against the security checklist
- `/vibe-legal` — regenerate legal pages when your data practices change

## Modules

Run `pnpm vibe list` to see them, or let `/vibe-starter` pick. Available today: `db-drizzle-neon`,
`auth-better-auth`, `dashboard`, `admin`, `payments-stripe`, `email-resend`, `notifications`,
`waitlist`, `contact-form`, `blog-mdx`, `analytics-plausible`, and `analytics-umami`. See the
[module catalog](./docs/modules.md) for the full list and roadmap.

```bash
pnpm vibe add auth-better-auth dashboard
pnpm install
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Better Auth ·
Drizzle ORM · Postgres · Zod. Optimized for Vercel, self-hostable anywhere.

## Documentation

See [`docs/`](./docs) for the architecture, security model, legal model, module-authoring
guide, and deployment instructions.

## License

MIT
