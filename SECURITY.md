# Security Policy

## Reporting a vulnerability

Do not open a public issue for security problems. Email the maintainer or use GitHub's
private vulnerability reporting under the repository's Security tab. Expect an initial
response within 72 hours.

## What this starter gives you

Every app scaffolded from vibe-starter ships with:

- Nonce-based Content Security Policy and a strict set of security headers
- Typed, validated environment variables that fail the build when missing
- Zod validation at every trust boundary
- Parameterized database access only
- HttpOnly, Secure, SameSite session cookies
- Rate limiting and bot defense on auth, forms, and API routes
- Secret scanning in the pre-commit hook and in CI

## Your responsibilities

- Keep dependencies current (Renovate is configured).
- Never commit real secrets. Use `.env.local`, which is gitignored.
- Rotate any credential that is ever exposed.
- Review the output of `/vibe-security` before shipping.
