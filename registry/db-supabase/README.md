# db-supabase

Hosted Postgres through [Supabase](https://supabase.com), with SSR-safe cookie handling via
`@supabase/ssr`. This is a hosted alternative to `db-drizzle-neon` — pick one, not both.

## Install

```bash
pnpm vibe add db-supabase
pnpm install
```

## Setup

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("posts").select();
```

Use `@/lib/supabase/client` in Client Components. The Supabase host is added to the CSP
`connect-src` automatically. Always enable Row Level Security on your tables.
