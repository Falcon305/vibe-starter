---
name: vibe-legal
description: Generate or update a vibe-starter app's legal pages (privacy, terms, cookies) from its config and installed modules. Use when data practices change, a module is added or removed, the business details change, or the user runs /vibe-legal.
---

# vibe-legal

Keep the privacy policy, terms, and cookie policy accurate. The pages render from
`lib/legal/config.ts` plus generated contributions from installed modules, so this skill's job is
to make the facts in that config true and confirm the output reflects reality.

## When to use

- The user set up or changed their business details.
- A module was installed or removed (new subprocessor, new cookie, new data collected).
- The user asks to review or regenerate legal pages.

## Workflow

### 1. Gather the facts

Determine, by asking or by reading the app:

- Legal entity name, operating name, privacy contact email, postal address.
- Jurisdiction: `eu`, `us`, or `global` (which visitors, which laws apply).
- Whether the app sells or shares personal data for value.
- What personal data the app actually collects (from forms, accounts, uploads, analytics).
- Governing law and effective date.

### 2. Update the config

Edit `lib/legal/config.ts` with those facts. Do not edit the generated files by hand — the
installer owns `lib/legal/modules.generated.ts` (subprocessors, cookies, data from modules).

### 3. Reconcile with installed modules

Read `.vibe/installed.json`. Confirm every installed module's subprocessors and cookies appear on
the cookie page and in the privacy policy. If they are missing or stale, re-run the installer's
regeneration:

```bash
pnpm vibe add <an-installed-module>
```

Adding an already-installed module is a no-op that still regenerates the legal contributions.

### 4. Review the rendered pages

Start the app and read `/privacy`, `/terms`, and `/cookies`. Confirm:

- Jurisdiction is right: GDPR section present for EU/global, CCPA for US/global.
- The subprocessor list matches what the app actually uses.
- The cookie table matches the cookies actually set.
- The "Do Not Sell or Share" control appears only if `sellsData` is true or jurisdiction includes
  the US.

### 5. Report

Summarize what changed and remind the user: this is a strong, honest baseline, not legal advice.
Recommend a lawyer review before relying on it for a real business.

## Rules

- Never overstate or understate what data is collected. Accuracy protects the user legally.
- Never edit generated files directly.
