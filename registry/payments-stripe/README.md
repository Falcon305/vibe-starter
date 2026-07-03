# payments-stripe

Subscription billing with Stripe: hosted checkout, a customer portal, and verified webhooks.
Because checkout and the portal are hosted redirects, no client-side Stripe.js or CSP change is
needed. Depends on `auth-better-auth` and `email-resend`.

## Install

```bash
pnpm vibe add payments-stripe
pnpm install
pnpm db:generate && pnpm db:migrate
```

## Setup

1. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `STRIPE_PRICE_ID` in `.env.local`.
2. Add a webhook in the Stripe dashboard pointing at `/api/webhooks/stripe`, subscribed to
   `customer.subscription.*` events. Use the signing secret as `STRIPE_WEBHOOK_SECRET`.
3. Render `<UpgradeButton />` and `<ManageBillingButton />` where you want them, for example on the
   dashboard.

## How it works

`startCheckout` creates (or reuses) a Stripe customer for the signed-in user and redirects to
hosted checkout. The webhook verifies the Stripe signature and mirrors the subscription status
into the `customer` table so your app can gate features on it.
