# Getting started

This walks you from nothing to a deployed app. You do not need to know Next.js, Postgres, or
anything about security headers — the starter carries those. You need Node 22, pnpm, and about
fifteen minutes.

## 1. Get the code

```bash
git clone https://github.com/Falcon305/vibe-starter my-app
cd my-app
pnpm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`. That is the only value the base
needs.

```bash
pnpm dev
```

You already have a working site: a themed marketing page, privacy, terms, and cookie pages, a
compliant consent banner, and hardened security headers. Everything else is optional.

## 2. Describe what you are building

Open the project in Claude Code and run:

```
/vibe-starter
```

Describe your business in plain English — "a paid newsletter for home bakers", "a booking tool for
dog groomers". The skill interviews you, picks the right modules, installs them, and rewrites the
legal pages to match the data your app actually collects.

Using another agent (Codex, Cursor)? Point it at `AGENTS.md` and ask for the same thing — the
`vibe` CLI does the work either way.

## 3. Or pick modules yourself

```bash
pnpm vibe list
pnpm vibe add auth-better-auth dashboard
pnpm install
```

Each module prints its next steps after installing. The common ones:

- **Database** (`db-drizzle-neon`): put a Postgres connection string in `DATABASE_URL` — a free
  [Neon](https://neon.tech) database works, or `docker compose up -d` for local dev. Then run
  `pnpm db:generate && pnpm db:migrate`.
- **Auth** (`auth-better-auth`): set `BETTER_AUTH_SECRET` to any long random string
  (`openssl rand -base64 32`).
- **Email** (`email-resend`): a [Resend](https://resend.com) API key and a verified sender.

Every required key is listed in [environment.md](./environment.md), and `pnpm vibe doctor` tells
you which ones are still missing.

## 4. Build features

Run `/vibe-build` and describe the next feature. The skill writes it to the same standard the base
sets: inputs validated with Zod, mutations through server actions, no secrets in client code, CSP
intact. Run `/vibe-security` any time for an audit, and `/vibe-legal` after your data practices
change.

## 5. Check your work

```bash
pnpm run check     # typecheck + lint + format
pnpm test          # unit tests
pnpm vibe doctor   # module conflicts, drift, missing env, leaked secrets
```

## 6. Deploy

Import the repo into [Vercel](https://vercel.com), add the env vars from `.env.local` (with
`NEXT_PUBLIC_SITE_URL` set to your production URL), and deploy. See
[deployment.md](./deployment.md) for self-hosting.

## Where to go next

- [The skills](./skills.md) — what each slash command does.
- [CLI reference](./cli.md) — every `vibe` command.
- [Module catalog](./modules.md) — what you can install.
- [Troubleshooting](./troubleshooting.md) — when something goes sideways.
