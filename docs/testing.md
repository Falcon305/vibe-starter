# Testing

vibe-starter ships its own test suites and a health check for the registry. Everything here runs
locally with the same commands CI uses, so a green local run means a green pipeline.

## Commands

| Command            | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `pnpm run check`   | Typecheck, lint, and format check — run this before every commit. |
| `pnpm test`        | Vitest unit suite (`tests/**/*.test.ts`).                         |
| `pnpm test:e2e`    | Playwright end-to-end suite (`tests/e2e/**/*.spec.ts`).           |
| `pnpm vibe doctor` | Static audit of the installed module set.                         |

## Unit tests

Vitest covers the security-critical pure logic that must never regress:

- **CSP** — production `script-src` is nonce-based with `'strict-dynamic'` and no `unsafe-inline`,
  and module additions merge without weakening the base.
- **Rate limiting** — the limit, window, and reset behaviour of `lib/rate-limit.ts`.
- **Registry** — `resolveInstallOrder` returns a correct topological order, deduplicates shared
  dependencies, and throws on an unknown module.

Add a test by dropping a `*.test.ts` file under `tests/`. Imports resolve through the `@` alias,
same as the app.

## End-to-end tests

Playwright builds the app, starts it on an isolated port, and asserts the guarantees a browser
actually sees:

- Security headers are present on `/` (HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`).
- The response CSP uses a nonce with no `unsafe-inline` in `script-src`.
- `/privacy`, `/terms`, and `/cookies` each render a heading.
- `/api/health` returns `200`.
- The cookie banner offers equal-weight Accept and Reject controls.
- An [axe](https://github.com/dequelabs/axe-core) accessibility pass on `/` finds no serious or
  critical violations.

The first run downloads a browser once with `pnpm exec playwright install --with-deps chromium`.

## vibe doctor

`pnpm vibe doctor` reads `.vibe/installed.json` and the installed manifests, then reports:

- **Capability conflicts** — more than one provider of an exclusive capability (`auth`, `db`).
- **Route collisions** — two modules claiming the same route.
- **Lockfile drift** — a tracked file that is missing on disk.
- **Missing env** — a `required` env key that is not set in `.env.local`.
- **Client secret leaks** — a `"use client"` file reading a non-`NEXT_PUBLIC_` env variable.
- **CSP sanity** — the generated policy still parses and keeps its base directives.

It exits non-zero on any error, so it doubles as a CI gate. Installing a second module that provides
an already-provided exclusive capability is blocked at `vibe add` time as well.

## How modules are verified

Auth and database modules are validated against a real Postgres before release, not mocked:

1. Start a throwaway Postgres in Docker on an isolated port (never your local `5432`).
2. `pnpm vibe add <module>`, then `pnpm install`.
3. `pnpm db:generate && pnpm db:migrate` and confirm the expected tables and columns exist.
4. `pnpm build`, start the app, and exercise the new endpoints (an unauthenticated call to a
   protected route should return `401`, not `404` — proof the plugin is wired).
5. `pnpm vibe remove <module>` and confirm the base files are restored from backup.

Better Auth schema tables are generated with `npx @better-auth/cli generate` against that Postgres,
so the shipped Drizzle schema matches the plugin exactly.

## Continuous integration

`.github/workflows/ci.yml` runs the whole story on every push and pull request: `check`, `test`, a
production `pnpm audit`, `build`, and a `vibe doctor` smoke install, plus a separate Playwright job,
`gitleaks`, and dependency review on pull requests.
