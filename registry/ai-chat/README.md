# ai-chat

A streaming chat assistant powered by Claude through the [AI SDK](https://ai-sdk.dev). The browser
streams from your own `/api/chat` route, which calls Anthropic server-side, so your key never
reaches the client.

## Install

```bash
pnpm vibe add ai-chat
pnpm install
```

## Setup

Set `ANTHROPIC_API_KEY` in `.env.local`. Visit `/chat`, or drop `<Chat />` into any page.

The model is set in `app/api/chat/route.ts` — update it to the latest Claude model when a newer
one ships.
