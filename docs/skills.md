# The skills

Four Claude Code skills live in `.claude/skills/` and operate the starter for you. They are the
intended way to build with this repo: you describe outcomes in plain English, the skills hold the
security and legal line. Other agents (Codex, Cursor) get the same rules from `AGENTS.md` and can
drive the `vibe` CLI directly.

## /vibe-starter — scaffold from an idea

Run this once, at the start. It interviews you about your business — what you sell, what data you
collect, who your users are — then picks and installs the right modules, fills in your site
config, and generates legal pages that match what the app actually does. You end with a running,
deployable app tailored to your idea.

Use it when: you have a fresh clone and an idea.

## /vibe-build — add features safely

The day-to-day skill. Describe a feature ("let users save favorites", "add a pricing page") and it
builds the feature to the base's standard: every input validated with Zod, mutations through
server actions, no secrets in client code, the CSP extended only through module manifests, types
strict. It checks whether a registry module already covers the request before writing anything by
hand.

Use it when: the app exists and you want more of it.

## /vibe-security — audit the result

Walks the security checklist against the current state of the app: headers and CSP intact, env
discipline holding, inputs validated, auth guarding what it should. It reports concrete findings
with file references rather than vague advice. `pnpm vibe doctor` covers the mechanical subset of
these checks and runs in CI.

Use it when: before a launch, after a burst of vibe-built features, or any time you want
confidence.

## /vibe-legal — keep the legal pages true

Regenerates the privacy policy, terms, and cookie policy from your legal config and the installed
modules' declared subprocessors, cookies, and data collection. The legal pages are only correct
while they match reality — run this after your data practices change.

Use it when: you added or removed a module by hand, changed providers, or started collecting
something new.

## How they relate

`/vibe-starter` runs the [installer](./architecture.md); `/vibe-build` writes code the
[security model](./security.md) constrains; `/vibe-security` verifies it;
`/vibe-legal` keeps [the legal model](./architecture.md) in sync. All four read the same
conventions from `CLAUDE.md`.
