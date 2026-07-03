# notifications

In-app notifications stored in Postgres, listed at `/notifications`. Depends on
`auth-better-auth` and `email-resend`.

## Install

```bash
pnpm vibe add notifications
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Use

```ts
import { createNotification } from "@/lib/notifications";

await createNotification({ userId, title: "Welcome", body: "Thanks for joining." });
```

Signed-in users see their notifications at `/notifications`.
