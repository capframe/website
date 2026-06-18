@AGENTS.md

# Capframe website — agent context

This is the **marketing and documentation website** for [Capframe](https://capframe.ai), a capability-based security platform for AI agents. Deployed on Vercel from the `main` branch.

## Project layout

```
src/
  app/                  Next.js App Router pages
    page.tsx            Homepage (large file — ~64 KB, all inline)
    blog/               Blog index + [slug] dynamic route
    docs/               Docs (findings-v1 schema docs today)
    changelog/          Changelog page
    leaderboard/        Public MCP leaderboard
    quickstart/         Getting-started page
    layout.tsx          Root layout (fonts, analytics, metadata)
    globals.css         Global styles + Tailwind base
  content/
    blog/               Markdown blog posts (gray-matter + marked)
  lib/                  Shared utilities (blog loader, etc.)
public/                 Static assets
next.config.ts          Redirects (/install, /install.ps1, /schema, /find, /bind, /guard) + security headers
```

## Critical constraints

- **Do not remove or break `/install` or `/install.ps1` redirects** in `next.config.ts`. They are referenced in `capframe/capframe`'s README and used by real users running `curl capframe.ai/install | sh`.
- **CSP is strict.** `script-src` is locked to `'self'` + Vercel Analytics. Adding any inline scripts or new third-party scripts requires updating the CSP in `next.config.ts` first.
- **Next.js version is 16** with the App Router. File-based routing lives in `src/app/`. Use Server Components by default; add `'use client'` only when you need browser APIs or React hooks.
- **No test suite yet.** `npm run build` + `npm run lint` are the gates. Make sure both pass before considering a change done.
- **Tailwind v4** — configuration is in `postcss.config.mjs`, not `tailwind.config.js`. The v4 API differs from v3.

## How blog posts work

Files in `src/content/blog/*.md` are parsed at build time via `gray-matter`. Required frontmatter fields: `title`, `date`, `description`. The slug is derived from the filename.

## Capframe product context

Capframe is a three-module security platform for AI agents:

| Module | Subcommand | What it does |
|---|---|---|
| **Find** | `capframe find` | Enumerates MCP tool surfaces, classifies security risks |
| **Bind** | `capframe bind` | Issues scoped capability tokens (ed25519, macaroon-style) |
| **Guard** | `capframe guard` | Evaluates every tool call against a deterministic policy |
| **Report** | `capframe report` | Generates HTML/PDF audit reports from findings |

The platform CLI lives at [capframe/capframe](https://github.com/capframe/capframe). The three modules are in separate repos under `euanmcrosson-dotcom`.

## Tone and voice

- Technical, direct, no marketing fluff.
- Security-tool audience: developers, security engineers, compliance teams.
- Every claim should be backed by something real (a number, a finding, a test).
- "Find. Bind. Guard." is the product tagline — use it consistently.
