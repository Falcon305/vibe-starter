<div align="center">

<img src=".github/assets/banner.svg" alt="vibe-starter" width="100%" />

<br/>

**A production-ready Next.js starter for people who want to ship a real website<br/>without first becoming a security engineer or a privacy lawyer.**

<br/>

[![CI](https://github.com/Falcon305/vibe-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/Falcon305/vibe-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6.svg?style=flat-square)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000.svg?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Modules](https://img.shields.io/badge/modules-20-6366F1.svg?style=flat-square)](./docs/modules.md)

[Quickstart](#-quickstart) · [Modules](#-modules) · [The skills](#-the-skills) · [Docs](./docs)

</div>

---

Most starter templates hand you an empty app and wish you luck. vibe-starter is different: it is a
**secure base** plus a **library of feature modules**, driven by **Claude Code skills** that
interview you about your business idea and assemble only the parts you actually need — with the
legal pages, cookie consent, and security hardening already done the way a senior engineer would.

<div align="center">
  <img src=".github/assets/app-preview.svg" alt="The secure, legally-complete base app" width="840" />
</div>

## ✨ What you get out of the box

|                              |                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 🛡️ **Secure by default**     | Nonce-based Content Security Policy, hardened headers, and Zod-validated inputs wired in before you write a line.                              |
| ⚖️ **Legally complete**      | GDPR / CCPA privacy, terms, and cookie pages with a compliant, equal-weight consent banner — generated to match the data you actually collect. |
| 🧩 **Only what you need**    | A secure base plus a registry of 20 modules the scaffolder pulls in on demand — auth, payments, AI, and more.                                  |
| 🤖 **Built to be prompted**  | Keep building by describing features in plain English while the skills keep the code production-ready.                                         |
| 🔑 **Typed environment**     | Env vars validated at build time; server secrets can never reach the client.                                                                   |
| 🚦 **Green from commit one** | Strict TypeScript, ESLint, Prettier, secret scanning, and CI on every push.                                                                    |

## 🚀 Quickstart

```bash
git clone https://github.com/Falcon305/vibe-starter my-app
cd my-app
pnpm install
cp .env.example .env.local
pnpm dev
```

Then, inside Claude Code, run the scaffolder and describe your business in plain English:

```
/vibe-starter
```

It figures out which modules you need, installs them, generates your legal pages, and leaves you
with a running, deployable app.

### Add capabilities anytime

The `vibe` CLI composes modules shadcn-style — it copies real source into your repo and rewires
dependencies, env, database schema, CSP, and legal pages to match.

<div align="center">
  <img src=".github/assets/vibe-cli.svg" alt="pnpm vibe list and pnpm vibe add" width="720" />
</div>

## 🤖 The skills

| Skill            | What it does                                                       |
| ---------------- | ------------------------------------------------------------------ |
| `/vibe-starter`  | Interviews you and scaffolds a tailored app from your idea.        |
| `/vibe-build`    | Adds features by prompting while enforcing the security checklist. |
| `/vibe-security` | Audits the current app against the security baseline.              |
| `/vibe-legal`    | Regenerates legal pages when your data practices change.           |

## 🧩 Modules

Run `pnpm vibe list` to see them, or let `/vibe-starter` pick. Twenty modules cover the full stack —
pick one `db` and one `auth`, add the rest as you need them.

| Group                    | Modules                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Data & auth**          | `db-drizzle-neon` · `db-supabase` · `auth-better-auth` · `auth-supabase` · `auth-clerk` |
| **App surface**          | `dashboard` · `admin` · `teams-orgs` · `file-upload`                                    |
| **Monetization & comms** | `payments-stripe` · `email-resend` · `notifications`                                    |
| **Growth & content**     | `waitlist` · `contact-form` · `blog-mdx` · `analytics-plausible` · `analytics-umami`    |
| **AI, i18n & ops**       | `ai-chat` · `i18n` · `monitoring-sentry`                                                |

See the [module catalog](./docs/modules.md) for what each one provides and depends on.

```bash
pnpm vibe add auth-better-auth dashboard
pnpm install
```

## 🧱 Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Better Auth
· Drizzle ORM · Postgres · Zod. Optimized for Vercel, self-hostable anywhere.

## 📚 Documentation

- [Architecture](./docs/architecture.md) — the base, the registry, and how the installer works
- [Security model](./docs/security.md) — CSP, headers, validation, and the threat model
- [Module catalog](./docs/modules.md) & [authoring guide](./docs/module-authoring.md)
- [Deployment](./docs/deployment.md) — Vercel and self-host

## 📄 License

[MIT](./LICENSE)
