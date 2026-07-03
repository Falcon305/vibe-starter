# db-drizzle-neon

Type-safe Postgres access with [Drizzle ORM](https://orm.drizzle.team). Provides the `db`
capability. Works with any Postgres, including [Neon](https://neon.tech) (use the pooled
connection string on serverless).

## Install

```bash
pnpm vibe add db-drizzle-neon
pnpm install
```

## Local database

A `docker-compose.yml` is included for local development:

```bash
docker compose up -d
```

Then set `DATABASE_URL` in `.env.local`:

```
DATABASE_URL=postgresql://vibe:vibe@localhost:5432/vibe
```

## Schema and migrations

Add your tables in `lib/db/schema/app.ts` (or new files in that folder). Every file there is
picked up automatically. Then:

```bash
pnpm db:generate   # create a migration from the schema
pnpm db:migrate    # apply it
pnpm db:studio     # browse the data
```

## Usage

```ts
import { db } from "@/lib/db";
import { app } from "@/lib/db/schema/app";

const rows = await db.select().from(app);
```
