# Contributing

Thanks for helping improve vibe-starter.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Conventions

- **No code comments.** Write self-documenting code with clear names and small functions.
- **Commit messages** are one short imperative sentence. No prefixes, no noise.
- TypeScript runs in strict mode. `any` is not allowed.
- Run `pnpm run check` before opening a pull request. It must pass.
- Every input crossing a trust boundary is validated with Zod.
- Mutations go through server actions or POST route handlers, never GET.

## Adding a registry module

Modules live in `registry/<name>/` with a `module.json` manifest. See
`docs/module-authoring.md` for the manifest schema and the rules a module must follow.

## Pull requests

Keep them focused. Include a short description of what changed and why. CI must be green.
