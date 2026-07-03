# auth-passkeys

Passwordless [WebAuthn passkey](https://www.better-auth.com) sign-in on top of `auth-better-auth`,
via the `@better-auth/passkey` plugin. Ships the server and client plugins through the auth plugin
slots and adds the `passkey` table.

## Install

```bash
pnpm vibe add auth-passkeys
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Usage

```ts
import { authClient } from "@/lib/auth/client";

await authClient.passkey.addPasskey();
await authClient.signIn.passkey();
```

Passkeys require HTTPS (or localhost) and a signed-in user to register.
