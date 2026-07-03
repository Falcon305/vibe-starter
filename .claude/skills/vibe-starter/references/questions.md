# Interview questions

Ask only what you cannot infer from the idea. Map plain answers to config and modules.

## Accounts

"Will people need to sign in or have accounts?"

- Yes → needs `auth` + `db`. Likely a `dashboard`.
- No → skip auth entirely. Simpler and more secure.

## Money

"Will you charge money, now or soon?"

- Subscriptions or one-time → `payments-stripe` (requires auth + db + email).
- No → skip payments.

## Personal data and region

"Do you collect personal data (names, emails, uploads)? Do you expect visitors from the EU?"

- EU visitors → `jurisdiction: "global"` or `"eu"`, GDPR sections on.
- US only → `jurisdiction: "us"`.
- Sells or shares data for value → `sellsData: true` (turns on the Do Not Sell control).

## Content and capture

"Do you need a blog, a contact form, or an email waitlist?"

- Blog / articles / SEO content → `blog-mdx`.
- Contact / support → `contact-form` (requires email).
- Collect emails before launch → `waitlist`.

## Extras

"Any of these: file uploads, multiple languages, an AI feature, analytics?"

- Uploads → `file-upload`.
- Languages → `i18n`.
- AI chat / assistant → `ai-chat`.
- Analytics → `analytics-plausible`.

## Identity

Always collect: company or product name, contact email, and country the business operates from.
These populate `lib/site.ts` and `lib/legal/config.ts`.
