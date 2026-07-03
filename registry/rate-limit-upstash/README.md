# rate-limit-upstash

Serverless-safe rate limiting backed by [Upstash Redis](https://upstash.com). The base
`lib/rate-limit.ts` uses an in-memory counter, which is per-instance on serverless platforms like
Vercel — fine for local dev, but not a real global limit in production. This module swaps in a
distributed sliding-window limiter with the same API, so every instance shares one counter.

## Install

```bash
pnpm vibe add rate-limit-upstash
pnpm install
```

## Setup

Create an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in
`.env.local`. Nothing else changes — callers already use `await rateLimit(key, limit, windowMs)`.

Removing the module restores the in-memory limiter from a backup.
