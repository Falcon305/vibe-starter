---
name: vibe-starter
description: Scaffold a secure, legally-complete web app from a plain-English business idea. Use when the user wants to start a new project or website from the vibe-starter template, describes a business they want to build, or runs /vibe-starter.
---

# vibe-starter

Turn a business idea into a running, secure, legally-complete app by interviewing the user,
mapping their needs to registry modules, and installing only what they need.

## When to use

The user describes something they want to build ("I want a site that lets photographers sell
prints"), or explicitly runs `/vibe-starter`. This skill assumes it runs inside a fresh clone of
the vibe-starter repo.

## Workflow

Follow these steps in order. Do not skip the confirmation step.

### 1. Understand the idea

If the user has not described their business, ask for it in one sentence. Then restate what you
understood and classify it (SaaS, marketplace, content/blog, portfolio, waitlist/landing page,
internal tool, e-commerce, community). Classification drives which questions matter.

### 2. Ask only the questions that matter

Read `references/questions.md`. Ask only the questions whose answers you cannot infer. Keep it
short — never more than five questions. The answers you need are:

- Will people sign in / have accounts?
- Will you charge money?
- Do you collect personal data, and do you have visitors in the EU? (drives legal config)
- Do you need content (a blog), a contact form, or an email waitlist?
- Company name, contact email, and where the business is based.

### 3. Decide the module set

Read `references/decision-table.md` and map the answers to a concrete module list plus the auth
and database choice. Then check what is actually installable:

```bash
pnpm vibe list
```

Only plan to install modules that appear in that list. For a needed capability with no module
yet, note that it will be built by hand with `/vibe-build` after scaffolding.

### 4. Confirm the plan

Show the user: the modules you will install, the auth/database choice, and the legal
configuration (jurisdiction, what data is collected). Get an explicit yes before touching files.

### 5. Install

Run the installer for the confirmed modules:

```bash
pnpm vibe add <module> <module> ...
pnpm install
```

Then apply the configuration that the modules cannot do themselves:

- Edit `lib/site.ts`: set `name`, `description`, and `url`.
- Edit `lib/legal/config.ts`: set `companyName`, `legalEntity`, `contactEmail`, `address`,
  `jurisdiction`, `sellsData`, and `dataCollected`. Read `references/legal-setup.md`.
- Perform each module's `postInstall` steps (for example, rendering a component in
  `app/layout.tsx`). The installer prints these.

### 6. Verify and hand off

- Run `pnpm run check` and fix anything it reports.
- Run the `vibe-security` skill to confirm the app is clean.
- Tell the user which environment variables in `.env.example` still need real values in
  `.env.local`, and how to run the app (`pnpm dev`).
- For any capability that had no module, tell the user to run `/vibe-build` to add it safely.

## Rules

- Never install a module that `pnpm vibe list` does not show.
- Never invent secrets. Leave env placeholders and tell the user what to fill in.
- Keep the base secure defaults intact. Do not weaken the CSP or headers.
- Follow the repo conventions: no code comments, short single-sentence commits.
