# Architecture

vibe-starter is two things in one repository: a secure base application, and a registry of
optional feature modules that a skill composes into the base.

## The base

Cloning the repo gives you a complete, deployable, secure marketing site. The base owns:

- `app/` — routing only (App Router). Pages, layouts, error boundaries, health check, SEO.
- `lib/` — cross-cutting concerns: `env` (typed, validated), `security/csp`, `site`, `utils`,
  `rate-limit`, and the `legal` model.
- `components/` — the design system (`components/ui`), site chrome, consent UI, theme.
- `content/legal` and `legal.config.ts` — the source of truth for the legal pages.

The base never assumes a database or auth. A marketing site or a waitlist needs neither.

## The registry

`registry/<name>/` holds optional modules. Each has a `module.json` manifest and a `files/`
directory mirrored into the app on install. Modules are copied in, shadcn-style — there is no
hidden framework and no runtime dependency on the registry.

```
registry/payments-stripe/
├─ module.json
├─ files/            # mirrored to the project root
└─ README.md
```

## The installer

`pnpm vibe add <module>` (implemented in `scripts/`) does the work:

1. Resolves `dependsOn` and installs dependencies first.
2. Copies `files/` into the app and records them in `.vibe/installed.json`.
3. Merges `dependencies`, `devDependencies`, and `scripts` into `package.json`.
4. Appends new env keys to `.env.example`.
5. Regenerates these files from every installed module, so the app stays consistent:
   - `lib/legal/modules.generated.ts` — subprocessors, cookies, and data collected.
   - `lib/security/csp.generated.ts` — extra CSP sources.
   - `lib/env.generated.ts` — validated schema for module env vars.
   - `lib/db/schema/index.ts` — a barrel of every module's Drizzle tables.
   - `lib/config-plugins/index.ts` — composes `next.config` wrappers (used by `i18n`, Sentry).
   - `lib/auth/plugins/index.ts` and `lib/auth/client-plugins/index.ts` — Better Auth server and
     client plugins (used by `teams-orgs`, `auth-passkeys`, `auth-2fa`).
   - `lib/auth/social/index.ts` — merges each `lib/auth/social/*.ts` provider into the
     `socialProviders` object Better Auth consumes (used by `auth-social`).

When a module overwrites an existing file (for example an auth escape hatch replacing
`middleware.ts`), it must declare the path in its manifest's `overwrites` list, and the original is
copied to `.vibe/backups/<module>/` first. The security core — `next.config.ts`, `lib/env.ts`,
`lib/security/`, `lib/consent/`, and every `*.generated.ts` file — can never be replaced by a
module. The lockfile records a SHA-256 hash of every installed file, so `vibe doctor` can tell a
locally edited file from a registry update, and `vibe update` refuses to overwrite local edits
without `--force`.

`pnpm vibe remove <module>` reverses the file copy, restores any backed-up originals, and
regenerates the same files, refusing to remove a module another installed module depends on.

## The skills

`.claude/skills/` holds four skills that operate this machinery:

- `vibe-starter` interviews the user and runs the installer.
- `vibe-build` adds features by hand while enforcing the security checklist.
- `vibe-security` audits the result.
- `vibe-legal` keeps the legal pages true to what is installed.

## Why generated files instead of editing in place

Editing TypeScript source programmatically is fragile. Instead, each concern the modules extend
(legal, CSP, env, database schema) has a generated file that the installer rewrites wholesale from
the set of installed modules. This is deterministic, reversible, and easy to reason about: the
generated file is always exactly the sum of what is installed.
