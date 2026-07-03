# auth-better-auth

Email and password authentication through [Better Auth](https://better-auth.com), stored in your
own Postgres via Drizzle. You own the users. Depends on `db-drizzle-neon`.

## Install

```bash
pnpm vibe add auth-better-auth
pnpm install
```

## Setup

1. Generate a secret and set it in `.env.local`:

   ```bash
   openssl rand -base64 32
   ```

   ```
   BETTER_AUTH_SECRET=your-generated-secret
   ```

2. Create the auth tables:

   ```bash
   pnpm db:generate && pnpm db:migrate
   ```

## Usage

Server side, guard work with the session:

```ts
import { requireSession } from "@/lib/auth/guard";

const session = await requireSession();
```

Client side, use the auth client:

```ts
import { signIn, signUp, signOut, useSession } from "@/lib/auth/client";
```

The auth API is mounted at `/api/auth`. A session cookie (`better-auth.session_token`) is added to
your cookie policy automatically.
