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

```json
{
  "name": "my-module",
  "title": "My Module",
  "description": "One line shown in `vibe list`",
  "category": "growth",
  "dependsOn": ["db", "email"],
  "provides": ["contact"],
  "dependencies": { "some-lib": "^1.0.0" },
  "env": [{ "key": "SOME_KEY", "required": true, "secret": true, "example": "" }],
  "routes": ["/contact"],
  "csp": { "connectSrc": ["https://api.example.com"] },
  "postInstall": ["Do this manual step"],
  "legal": {
    "subprocessors": [{ "name": "Example", "purpose": "Email delivery" }],
    "cookies": [],
    "dataCollected": ["Messages you submit"]
  }
}
```

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
  Auth server or client plugin.

## Rules

- Never hardcode secrets. Declare them in `env` and read them through validated config.
- Extend the CSP through the `csp` field, never by weakening the base policy.
- Declare every third party you send data to under `legal.subprocessors`.
- Keep files self-contained and idempotent. `pnpm vibe remove <name>` deletes exactly the files the
  module installed and restores any base files it had overwritten from a backup.
