# vibe-starter

A secure, legally-complete Next.js starter plus Claude Code skills that scaffold a
tailored app from a plain-English business idea. Built for non-technical builders who
should not have to know about CSP, GDPR, or session cookies to ship something safe.

## Architecture

- **Base** (`app/`, `lib/`, `components/`, `content/`) is always present and secure on its own.
- **`registry/`** holds optional feature modules copied into the app on demand, shadcn-style.
- **`.claude/skills/`** holds the four skills: `vibe-starter`, `vibe-build`, `vibe-security`, `vibe-legal`.

## Conventions

- No code comments. Self-documenting names, small functions.
- Commit messages: one short imperative sentence, no AI attribution, no conventional-commit prefixes.
- TypeScript strict, no `any`. Validate every input with Zod. Mutations via server actions.
- Run `pnpm run check` (typecheck + lint + format) before committing.

## Stack

Next.js 16 App Router, React 19, Tailwind v4 + shadcn/ui, Better Auth, Drizzle + Neon
Postgres, Zod, Arcjet. Vercel-first.
