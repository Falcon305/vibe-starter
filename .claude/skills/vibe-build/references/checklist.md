# Build checklist

Work through this while writing the feature.

## Input

- [ ] Every external input has a Zod schema and is parsed before use.
- [ ] Schemas reject unexpected fields and constrain length, type, and format.
- [ ] File uploads validate type and size before storage.

## Mutations

- [ ] All writes go through a server action or a POST/PUT/DELETE route handler.
- [ ] No mutation happens in a GET request or during render.
- [ ] Server actions re-validate input; never trust the client.

## Authorization

- [ ] Protected work checks the session with the auth helper.
- [ ] Ownership is checked, not just authentication (the user can only touch their own rows).
- [ ] Admin-only work checks the role.

## Secrets and data

- [ ] No secret is imported into a client component.
- [ ] No secret is exposed through a `NEXT_PUBLIC_` variable.
- [ ] New env vars are added to `.env.example` and validated in the env config.
- [ ] Database access uses the ORM with parameterized queries only.

## Abuse

- [ ] Unauthenticated endpoints and forms are rate-limited.
- [ ] User-supplied HTML is sanitized before rendering.
- [ ] Redirects and links built from user input are validated against an allowlist.

## Output and errors

- [ ] Errors shown to the user never include stack traces or internal details.
- [ ] Server logs the real error; the client sees a generic message.

## Compliance

- [ ] New personal data is reflected in `lib/legal/config.ts`.
- [ ] New third parties are declared as subprocessors and, if they set cookies, gated by consent.
- [ ] New external hosts are added to the CSP through the module or generated mechanism.

## Conventions

- [ ] No code comments.
- [ ] Reuses existing `lib/` helpers and `components/ui` primitives.
- [ ] `pnpm run check` passes.
