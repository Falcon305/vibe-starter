# teams-orgs

Multi-tenant organizations with members, roles, and invitations, built on the
[Better Auth organization plugin](https://better-auth.com). Adds the server and client plugins
through the auth plugin slots and ships the `organization`, `member`, and `invitation` tables.
Depends on `auth-better-auth`.

## Install

```bash
pnpm vibe add teams-orgs
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Usage

From the client:

```ts
import { authClient } from "@/lib/auth/client";

await authClient.organization.create({ name: "Acme", slug: "acme" });
await authClient.organization.inviteMember({ email: "teammate@acme.com", role: "member" });
await authClient.organization.setActive({ organizationId });
```

The session already carries `activeOrganizationId`, so `setActive` persists across requests.
