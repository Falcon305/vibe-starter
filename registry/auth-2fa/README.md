# auth-2fa

TOTP two-factor authentication with backup codes on top of `auth-better-auth`, via Better Auth's
`twoFactor()` plugin. Ships the server and client plugins through the auth plugin slots and adds the
`two_factor` table. The base `user.twoFactorEnabled` column is already present.

## Install

```bash
pnpm vibe add auth-2fa
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Usage

```ts
import { authClient } from "@/lib/auth/client";

const { data } = await authClient.twoFactor.enable({ password });
await authClient.twoFactor.verifyTotp({ code });
```

Enabling returns the TOTP URI and backup codes to show the user once.
