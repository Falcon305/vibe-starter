# Security audit checklist

Judge each item against the evidence you gathered. A failed item is a finding.

## Transport and headers

- HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all present.
- CSP present on every response via middleware.
- Production `script-src` is nonce + `strict-dynamic`, no `unsafe-inline`, no `unsafe-eval`.
- `X-Powered-By` is absent.

## Secrets

- No server secret referenced in a client component.
- No secret exposed through `NEXT_PUBLIC_`.
- `.env`, `.env.local` gitignored; only `.env.example` committed.
- No secret anywhere in git history.

## Input and data

- Every external input is validated with Zod at the boundary.
- No mutation on a GET request or during render.
- Database access is parameterized through the ORM; no string-built SQL.
- Uploaded files are type- and size-checked.

## Authorization

- Protected routes and actions check the session.
- Ownership is enforced, not just authentication.
- Admin surfaces check the role.

## Abuse resistance

- Unauthenticated forms and public APIs are rate-limited.
- User HTML is sanitized before rendering.
- Redirects from user input are allowlisted.

## Errors

- Client-facing errors never leak stack traces or internals.

## Supply chain

- `pnpm audit --prod` has no high or critical advisories, or they are documented and accepted.
- Lockfile is committed.

## Accessibility

- jsx-a11y lint passes.
- Interactive elements have accessible names; forms have labels; images have alt text.
- Color is not the only signal; focus states are visible.
