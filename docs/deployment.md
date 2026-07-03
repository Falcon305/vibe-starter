# Deployment

vibe-starter is optimized for Vercel and self-hostable anywhere Node runs.

## Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add your environment variables (everything in `.env.example`) in the Vercel project settings.
3. Deploy.

If you use a database, point `DATABASE_URL` at a serverless Postgres such as Neon, and use the
**pooled** connection string so serverless functions do not exhaust connections.

## Environment variables

`.env.example` is the source of truth. Each module appends the variables it needs when installed.
Copy it to `.env.local` for development and set real values. Required variables fail the build
when missing, so a green build means your configuration is complete.

## Database

Local development uses the `docker-compose.yml` that ships with `db-drizzle-neon`:

```bash
docker compose up -d
pnpm db:generate
pnpm db:migrate
```

In production, run `pnpm db:migrate` against your production database as part of your release
step, after setting `DATABASE_URL`.

## Self-hosting

```bash
pnpm install
pnpm build
pnpm start
```

Put the app behind a TLS-terminating proxy so HSTS and Secure cookies work. Provide the same
environment variables you would on Vercel, and run migrations against your database before the
first start.

## Before you go live

- Run `pnpm run check` and the `vibe-security` skill.
- Fill in real values in `lib/site.ts` and `lib/legal/config.ts`.
- Have a lawyer review the generated legal pages.
- Confirm the CSP allows every third party you actually use (installed modules do this for you).
