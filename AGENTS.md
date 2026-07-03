# Agent guide

This file is for Codex, Cursor, and any other coding agent working in this repo. Claude Code reads
the same rules from `CLAUDE.md`. Follow these exactly — they keep generated code secure and
production-ready.

## What this repo is

A secure, legally-complete Next.js starter. A secure **base** (`app/`, `lib/`, `components/`,
`content/`) is always present, and `registry/` holds optional feature modules copied into the app
on demand with the `vibe` CLI.

## How to add capabilities

Prefer composing an existing module over hand-writing a feature:

```bash
pnpm vibe list                       # see the 20 available modules
pnpm vibe add <module> [<module>...] # copy it in and rewire deps, env, schema, CSP, legal
pnpm install
```

The installer regenerates env validation, CSP sources, the Drizzle schema barrel, and the legal
pages from whatever is installed — never edit the `*.generated.ts` files by hand.

## Conventions (do not break)

- **No code comments.** Use self-documenting names and small functions.
- **TypeScript strict, no `any`.** Validate every input with Zod at the trust boundary.
- **Mutations go through server actions or POST route handlers**, never unguarded.
- **No secrets in client code.** Declare env vars and read them through `@/lib/env`.
- **Extend the CSP through a module's `csp` field**, never by weakening `lib/security/csp.ts`.
- **Commit messages:** one short imperative sentence. No AI attribution, no `Co-Authored-By`, no
  conventional-commit prefixes.
- Run `pnpm run check` (typecheck + lint + format) before committing.

## Stack

Next.js 16 App Router · React 19 · Tailwind v4 + shadcn/ui · Better Auth · Drizzle + Neon Postgres ·
Zod. Vercel-first.

See [`docs/`](./docs) for the architecture, security model, and module-authoring guide.
