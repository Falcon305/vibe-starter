# blog-mdx

A file-based markdown blog with front matter, an index at `/blog`, individual posts at
`/blog/[slug]`, and an RSS feed at `/blog/rss.xml`. Post HTML is sanitized before rendering.

## Install

```bash
pnpm vibe add blog-mdx
pnpm install
```

## Write posts

Add markdown files to `content/blog/`:

```markdown
---
title: My post
description: A short summary.
date: 2026-02-01
---

# My post

Write in **markdown**.
```

Posts are statically generated at build time and sorted by date.

Posts come from files in your repository, which are trusted content. If you ever render markdown
from untrusted users, sanitize the HTML (for example with `sanitize-html`) before output.
