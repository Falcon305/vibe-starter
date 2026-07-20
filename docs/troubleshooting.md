# Troubleshooting

The failure modes people actually hit, with the fix first.

## Build fails with "Invalid environment variables"

A required env key is missing or empty. The error names the key. Add it to `.env.local` (see
[environment.md](./environment.md)); empty strings count as missing. `pnpm vibe doctor` lists
everything an installed module still needs.

## Migrations fail with "relation already exists" (code 42P07)

Your database has tables from an earlier run but the migration history does not match — common
after regenerating migrations. Reset both sides:

```bash
rm -rf lib/db/migrations
docker exec <postgres-container> psql -U <user> -d <db> \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS drizzle CASCADE;"
pnpm db:generate && pnpm db:migrate
```

For the bundled Docker Postgres, `docker compose down -v` wipes the volume entirely — the named
volume survives a plain `docker compose down`, which is usually the surprise.

## db:generate says "No schema changes, nothing to migrate" but tables are missing

Stale files in `lib/db/migrations/` make Drizzle think the work is done. Delete the directory and
regenerate as above. Migrations live in `lib/db/migrations/`, not `drizzle/`.

## The dev server port is already in use

A previous server is still holding it. Find and stop it by port, not by name:

```bash
lsof -ti:3000 | xargs -r kill
```

## Stale behavior after switching env values or modules

Next.js caches aggressively. Delete the build cache and restart:

```bash
rm -rf .next
pnpm dev
```

Symptoms include 500s that vanish on rebuild, Origin-mismatch auth errors after changing
`NEXT_PUBLIC_SITE_URL`, and module UI not appearing after an install.

## An auth endpoint returns 404 that should exist

The plugin is not wired. Check that the module's files exist under `lib/auth/plugins/` and
`lib/auth/client-plugins/` and that the generated barrels import them — then rebuild. A protected
endpoint that is wired correctly returns `401` to an anonymous request, never `404`.

## pnpm or Node version mismatch

The repo pins pnpm via the `packageManager` field and Node via `.nvmrc`. With corepack enabled
(`corepack enable`), pnpm picks the right version automatically; `nvm use` reads `.nvmrc`.

## vibe add refuses with "multiple providers"

You are installing a second `auth` or `db` module while one is already installed. That is the
guardrail working. Remove the old provider first (`pnpm vibe remove <module>`), then add the new
one.

## Something else

Run `pnpm vibe doctor` and `pnpm run check` — between them they diagnose most states. Failing
that, [open an issue](https://github.com/Falcon305/vibe-starter/issues) with the output.
