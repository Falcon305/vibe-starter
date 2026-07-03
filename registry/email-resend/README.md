# email-resend

Transactional email through [Resend](https://resend.com). Provides the `email` capability that
modules like `contact-form`, `waitlist`, and `payments-stripe` depend on.

## Install

```bash
pnpm vibe add email-resend
pnpm install
```

## After installing

Set these in `.env.local`:

- `RESEND_API_KEY` — from your Resend dashboard.
- `EMAIL_FROM` — a verified sender address on your domain.

## Usage

```ts
import { sendEmail } from "@/lib/email/client";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome",
  html: "<p>Thanks for signing up.</p>",
});
```

Resend is added to your privacy policy subprocessor list automatically.
