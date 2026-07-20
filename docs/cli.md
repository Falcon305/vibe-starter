# CLI reference

The `vibe` CLI manages the module registry. Run any command with `pnpm vibe <command>`; `pnpm vibe`
alone prints this list.

## list

Shows every module in the registry with a one-line description, marking the installed ones.

```bash
pnpm vibe list
```

## search

Filters the list by a term matched against module names, titles, and descriptions.

```bash
pnpm vibe search auth
```

## info

Prints a module's manifest: category, dependencies, capabilities, env keys, and routes.

```bash
pnpm vibe info payments-stripe
```

## add

Installs one or more modules. Dependencies from `dependsOn` install first, in order. The installer
copies the module's files in, merges its npm dependencies and scripts, appends its env keys to
`.env.example`, regenerates the derived files (env schema, CSP, legal, schema barrel, auth
plugins), and prints any manual next steps.

```bash
pnpm vibe add auth-better-auth dashboard
pnpm install
```

Two modules that provide the same exclusive capability (`auth`, `db`) cannot be installed
together — the second is refused.

## update

Re-copies an installed module's files from the registry, picking up fixes without a
remove-and-add. Base-file backups are preserved.

```bash
pnpm vibe update contact-form
```

## remove

Uninstalls modules: deletes exactly the files each module installed, restores any base files it
had overwritten from backup, and regenerates the derived files. A module still required by another
installed module is refused.

```bash
pnpm vibe remove contact-form
```

## doctor

Audits the installed set and exits non-zero on any error, so it works as a CI gate:

- capability conflicts (two `auth` or two `db` providers)
- route collisions between modules
- lockfile drift (tracked files missing on disk)
- required env keys absent from `.env.local` (warning)
- client components reading non-`NEXT_PUBLIC_` env values
- damage to the generated CSP

```bash
pnpm vibe doctor
```

See [testing.md](./testing.md) for how doctor fits into the wider verification story.
