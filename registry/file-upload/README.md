# file-upload

Authenticated direct-to-storage uploads using presigned URLs, for S3 or Cloudflare R2. Only
signed-in users can request an upload URL, the file type is validated, and the file goes straight
to storage without passing through your server. Depends on `auth-better-auth`.

## Install

```bash
pnpm vibe add file-upload
pnpm install
```

## Setup

Set the `S3_*` variables in `.env.local`. For R2, set `S3_REGION=auto` and `S3_ENDPOINT` to your
R2 endpoint. Drop `<FileUploader />` into a page for signed-in users.

The AWS and R2 hosts are added to the CSP `connect-src` automatically. If you use a different
S3-compatible host, add it to `lib/security/csp.ts`.
