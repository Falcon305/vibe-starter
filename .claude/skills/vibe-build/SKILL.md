---
name: vibe-build
description: Add a feature to a vibe-starter app by prompting, while keeping the code secure and production-ready. Use when the user wants to build or add a feature, page, form, or API endpoint in a vibe-starter project, or runs /vibe-build.
---

# vibe-build

Build what the user asks for without introducing the security holes that hand-written app code
usually ships with. This skill is the guardrail between a plain-English request and production
code.

## When to use

The user wants to add something to an existing vibe-starter app: "add a page where users can
update their profile", "make a newsletter signup", "build an API for the mobile app".

## Workflow

### 1. Prefer a module over hand-written code

Check whether the registry already solves this:

```bash
pnpm vibe list
```

If a module fits (a contact form, a waitlist, payments), install it with `pnpm vibe add` instead
of writing it from scratch. Modules are already hardened.

### 2. Restate the feature and its trust boundaries

Say back what you will build and name every point where untrusted input enters: form fields,
route params, query strings, request bodies, uploaded files. Every one of these gets validated.

### 3. Build against the checklist

Read `references/checklist.md` and follow it while writing. The non-negotiables:

- Validate every input with a Zod schema at the boundary. Parse, do not trust.
- Mutations go through server actions or POST route handlers, never GET.
- Guard protected work with the auth helper; check ownership, not just authentication.
- Never read a secret in a client component or expose one through `NEXT_PUBLIC_`.
- Use the database through the ORM only. No string-built SQL.
- Rate-limit anything unauthenticated (forms, public APIs).
- Reuse existing helpers in `lib/` and components in `components/ui`. Match the surrounding code.
- No code comments. Clear names instead.

### 4. Keep the app compliant

If the feature collects new personal data or calls a new third party, update
`lib/legal/config.ts` and run the `vibe-legal` skill so the privacy policy stays accurate. If it
talks to a new external host, extend the CSP through the proper mechanism, never by weakening it.

### 5. Verify before declaring done

- `pnpm run check` passes (typecheck, lint, format).
- Run the `vibe-security` skill against the change.
- Exercise the feature once to confirm it actually works, not just compiles.

## Rules

- If you cannot make it secure, stop and explain the risk rather than shipping it.
- One short single-sentence commit, no AI attribution.
