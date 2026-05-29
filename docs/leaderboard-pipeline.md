# Leaderboard pipeline (Phase 5 wiring)

Daily flow that keeps `/leaderboard` fresh.

```
  GitHub Actions (07:00 UTC)
        │
        ├─ checkout capframe + mcp-recon + capframe-website
        ├─ cargo build --release -p capframe-leaderboard
        │
        ├─ mcp-recon producer registry \
        │    examples/registry-corpus.example.json \
        │    --out-dir /tmp/findings/ \
        │    --pretty
        │
        ├─ capframe-leaderboard build \
        │    --findings /tmp/findings/ \
        │    --out src/lib/leaderboard/sample.json \
        │    --pretty
        │
        └─ git commit + push (only if leaderboard.json changed)
              │
              ▼
        Vercel Git integration auto-deploys
              │
              ▼
  Vercel Cron (07:30 UTC) ──→ POST /api/cron/leaderboard-refresh
                                  │
                                  └─ revalidatePath("/leaderboard")
```

## Why this split (Vercel Cron + GitHub Actions, not Vercel Cron alone)

Vercel serverless functions can't easily run a Rust binary chain — the
pipeline needs `cargo build`, multiple binaries (`mcp-recon`,
`capframe-leaderboard`), tens of MB of crates, and minutes of runtime.
That's a perfect fit for GitHub Actions and a poor fit for a 10-second
serverless function.

What Vercel Cron *is* good for: poking the deployment to bump caches
on a known cadence so any future ISR / SWR layer doesn't drift. The
`/api/cron/leaderboard-refresh` route is that poke — it's idempotent
(just calls `revalidatePath`) and authenticated via `CRON_SECRET`.

## Setup checklist

1. **Env var** — set `CRON_SECRET` in Vercel project (`vercel env add
   CRON_SECRET production`). Match it in the GitHub Actions workflow
   if you also want a webhook trigger.

2. **GitHub Actions secret** — `LEADERBOARD_PUSH_TOKEN` (PAT or
   GitHub App installation token) with `contents: write` on the
   capframe-website repo so the daily workflow can commit the
   refreshed `sample.json`.

3. **Workflow file** — `.github/workflows/leaderboard-daily.yml`
   (not yet committed; lives in the capframe repo, not the website).
   That workflow does the Rust build + run + cross-repo commit.

4. **Cron schedule** — currently `30 7 * * *` (07:30 UTC daily) in
   `vercel.json`. Sits 30 min after the GHA cron so the new
   sample.json is already deployed when Vercel revalidates.

## Local dry-run

```bash
# In the capframe repo:
cd ../capframe
cargo run --release -p capframe-leaderboard -- build \
  --findings ./fixtures/findings/ \
  --out ../capframe-website/src/lib/leaderboard/sample.json \
  --pretty

# In capframe-website:
cd ../capframe-website
npm run dev
# → visit http://localhost:3000/leaderboard
```

## Phase-5 status

- ✅ vercel.json cron entry
- ✅ /api/cron/leaderboard-refresh route + auth gate
- ✅ This doc explaining the GHA companion
- ⬜ .github/workflows/leaderboard-daily.yml (next session — needs
     cross-repo PAT or app token to commit back to capframe-website)
- ⬜ Wire CRON_SECRET into Vercel prod env (operator step)
