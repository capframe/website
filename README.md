# capframe/website

Marketing website and documentation for [Capframe](https://capframe.ai) — capability-based security for AI agents.

**Live at:** [capframe.ai](https://capframe.ai)  
**Deployed on:** Vercel (auto-deploy from `main`)

---

## What this repo is

This is the Next.js 16 website for Capframe. It serves:

| Route | What it is |
|---|---|
| `/` | Marketing homepage |
| `/blog` | Technical blog (MDX content in `src/content/blog/`) |
| `/docs` | Documentation (starting with `findings-v1` schema docs) |
| `/changelog` | Product changelog |
| `/leaderboard` | Public MCP server security leaderboard |
| `/quickstart` | Getting-started guide |
| `/schema` | Redirect → `findings.v1.json` in `capframe/capframe` |
| `/install` | Redirect → `install.sh` (used by `curl capframe.ai/install \| sh`) |
| `/install.ps1` | Redirect → `install.ps1` (used by `iwr capframe.ai/install.ps1`) |
| `/find`, `/bind`, `/guard` | Memorable shortcuts to each module's GitHub repo |

> **The `/install` and `/install.ps1` routes are load-bearing.** They are referenced directly in the main `capframe/capframe` README. Do not remove or break them.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Blog/docs content:** Markdown files in `src/content/` parsed with `gray-matter` + `marked`
- **Analytics:** Vercel Analytics (`@vercel/analytics`)
- **Deployment:** Vercel

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## Adding a blog post

1. Create a new `.md` file in `src/content/blog/`.
2. Add frontmatter:

```md
---
title: "Your post title"
date: "2026-06-18"
description: "One-sentence summary shown in the blog index."
---

Post body here.
```

3. The post is automatically picked up by the blog index at `/blog`.

---

## Security headers

Security headers (CSP, HSTS, `X-Frame-Options`, etc.) are set in `next.config.ts`. The CSP is strict — `script-src` is locked to `'self'` and Vercel Analytics. If you add a third-party script, update the CSP before merging.

---

## Related repos

| Repo | Role |
|---|---|
| [capframe/capframe](https://github.com/capframe/capframe) | CLI dispatcher + `findings.v1` schema |
| [euanmcrosson-dotcom/mcp-recon](https://github.com/euanmcrosson-dotcom/mcp-recon) | Find module |
| [euanmcrosson-dotcom/capnagent](https://github.com/euanmcrosson-dotcom/capnagent) | Bind module |
| [euanmcrosson-dotcom/mcp-guard](https://github.com/euanmcrosson-dotcom/mcp-guard) | Guard module |
| [euanmcrosson-dotcom/purple-scaffold](https://github.com/euanmcrosson-dotcom/purple-scaffold) | Research / purple-team harness |
