---
name: vibe-security
description: Audit a vibe-starter app against the security checklist and report findings. Use when the user wants a security review or audit, asks whether the app is safe to ship, or runs /vibe-security.
---

# vibe-security

Audit the current app and report concrete findings, most severe first. This is a read-and-check
skill: it inspects, it does not silently change code. Offer fixes after reporting.

## When to use

Before shipping, after a batch of `/vibe-build` changes, or whenever the user wants assurance.

## How to run the audit

Work through `references/audit.md`. Gather evidence with the tools below, then judge each item.

### Headers and CSP

Build and start the app, then inspect the response:

```bash
curl -sI http://localhost:3105/ | grep -iE "content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy"
```

Confirm every header is present, and that the production `script-src` uses a nonce with
`strict-dynamic` and has no `unsafe-inline` or `unsafe-eval`.

### Secret exposure

```bash
grep -rnE "process\.env\.[A-Z_]+" app components lib | grep -v "NEXT_PUBLIC_"
```

Flag any server secret referenced inside a file marked `"use client"`. Confirm `.env.local` is
gitignored and only `.env.example` is committed.

### Input and mutations

Read server actions and route handlers. Flag any that accept input without a Zod parse, any
mutation on a GET, and any database call built with string concatenation.

### Authorization

Flag any protected route, action, or admin surface that does not check the session and ownership.

### Dependencies and secrets in history

```bash
pnpm audit --prod
gitleaks detect --no-banner 2>/dev/null || echo "install gitleaks for history scanning"
```

### Accessibility

```bash
pnpm run lint
```

Confirm the jsx-a11y rules pass and interactive elements have accessible names.

## Reporting

Produce a short report: each finding with a severity (high / medium / low), the file and line,
what is wrong, and the fix. End with a one-line verdict on whether it is safe to ship. If the user
approves, apply the fixes following the `vibe-build` conventions.
