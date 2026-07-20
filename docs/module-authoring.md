# Module authoring

A module is a self-contained feature that the registry can copy into an app on demand. Modules
live in `registry/<name>/` and are installed with `pnpm vibe add <name>`.

## Anatomy

```
registry/my-module/
├─ module.json      # manifest (validated on load)
├─ files/           # copied into the app, preserving relative paths
│  └─ components/my-module/widget.tsx  ->  components/my-module/widget.tsx
└─ README.md        # what it does and any manual steps
```

Everything under `files/` is mirrored to the project root on install. Use `@/` imports; they
resolve against the app once copied.

## Manifest

The manifest is validated against a Zod schema (`scripts/registry/schema.ts`) when loaded, so a
malformed field fails loudly at install time. A maximal example:

```json
{
  "name": "my-module",
  "title": "My Module",
  "description": "One line shown in `vibe list`",
  "category": "growth",
  "version": "0.1.0",
  "dependsOn": ["db", "email"],
  "provides": ["contact"],
  "dependencies": { "some-lib": "^1.0.0" },
  "devDependencies": { "some-cli": "^2.0.0" },
  "scripts": { "my-task": "tsx scripts/my-task.ts" },
  "env": [
    {
      "key": "SOME_KEY",
      "required": true,
      "secret": true,
      "description": "API key for Example",
      "example": ""
    }
  ],
  "routes": ["/contact"],
  "csp": {
    "scriptSrc": ["https://js.example.com"],
    "connectSrc": ["https://api.example.com"],
    "imgSrc": ["https://img.example.com"],
    "frameSrc": ["https://frames.example.com"]
  },
  "postInstall": ["Do this manual step"],
  "legal": {
    "subprocessors": [
      { "name": "Example", "purpose": "Email delivery", "url": "https://example.com/privacy" }
    ],
    "cookies": [
      {
        "name": "_example",
        "category": "analytics",
        "purpose": "Usage measurement",
        "provider": "Example",
        "retention": "13 months"
      }
    ],
    "dataCollected": ["Messages you submit"]
  }
}
```

Field notes:

- `version` defaults to `0.1.0`; bump it when a module's files change so `vibe update` has
  something meaningful to report.
- `dependsOn` lists module names, installed first in dependency order.
- `provides` declares capabilities. `auth` and `db` are exclusive — the installer refuses a second
  provider of either.
- `dependencies`, `devDependencies`, and `scripts` merge into `package.json`; existing script names
  are never overwritten.
- `env` entries generate validated config in `lib/env.generated.ts`. `secret` keys stay
  server-only; only `NEXT_PUBLIC_*` keys reach the client. `description` documents the key,
  `example` seeds `.env.example`.
- `csp` supports `scriptSrc`, `connectSrc`, `imgSrc`, and `frameSrc`. Sources are merged into the
  generated policy — the base directives can never be weakened from here.
- `overwrites` lists base files the module intentionally replaces (for example `auth-clerk`
  declares `middleware.ts`). Overwriting an existing file without declaring it is a hard error,
  and `next.config.ts`, `lib/env.ts`, `lib/security/`, `lib/consent/`, and `*.generated.ts` can
  never be replaced by any module.
- `legal.cookies` entries need all five fields (`name`, `category` of
  `necessary | analytics | marketing`, `purpose`, `provider`, `retention`) — they render directly
  into the cookie policy table.

## What the installer does

1. Resolves `dependsOn` and installs dependencies first.
2. Copies `files/` into the app and records them in `.vibe/installed.json`.
3. Merges `dependencies` / `devDependencies` into `package.json`.
4. Appends any new `env` keys to `.env.example`.
5. Regenerates `lib/legal/modules.generated.ts` and `lib/security/csp.generated.ts` from every
   installed module, so the privacy policy, cookie table, and CSP stay accurate.
6. Prints `postInstall` steps and the env keys you still need to fill in.

## Extension points

Drop a file into one of these directories and the installer wires it into the matching generated
barrel automatically:

- `lib/db/schema/<name>.ts` — Drizzle tables, exported from the schema barrel.
- `lib/config-plugins/<name>.ts` — default-export a `(config) => config` wrapper for `next.config`.
- `lib/auth/plugins/<name>.ts` and `lib/auth/client-plugins/<name>.ts` — default-export a Better
  Auth server or client plugin. The filename becomes an identifier in the generated barrel, so use
  camelCase (`twoFactor.ts`), not kebab-case.
- `lib/auth/social/<name>.ts` — default-export a social-provider object (or `{}` when its env is
  unset); providers merge into the `socialProviders` option.

## Rules

- Never hardcode secrets. Declare them in `env` and read them through validated config.
- Extend the CSP through the `csp` field, never by weakening the base policy.
- Declare every third party you send data to under `legal.subprocessors`.
- Keep files self-contained and idempotent. `pnpm vibe remove <name>` deletes exactly the files the
  module installed and restores any base files it had overwritten from a backup.
