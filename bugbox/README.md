# BugBox — a bug tracker hardened by the loop

> Built for **TestSprite Hackathon Season 3** — *Build the Loop.*
> The loop is the product. BugBox is the surface area the loop exercises.

BugBox is a small bug/issue tracker web app. Every user flow (auth, create,
list, filter, search, edit, comment, close/reopen) is a real TestSprite test
that runs against the **live deployed URL**. When a flow breaks, the TestSprite
CLI returns a `failed` verdict + failure bundle; the agent reads it, root-causes
it, fixes it, and re-runs. That catch-and-fix story is recorded in
[`LOOP.md`](./LOOP.md) and is the core of what's judged (Loop Quality, 40 pts).

## Live URL

> **Deploy pending operator account provisioning** (Supabase + Render free
> tiers). See [`DEPLOY.md`](./DEPLOY.md). The app code is complete, type-checks,
> builds, and passes its unit suite — it is deploy-ready the moment the operator
> provisions the two free accounts and sets the env vars.

Once deployed, the public URL will be recorded here and in
`Brain/architecture.md`.

## What the loop covered

Each shipped feature triggered a TestSprite run against the live URL. See
`LOOP.md` for the per-iteration log (maker → what ran → verdict). The verify
loop follows the protocol in `skills/testsprite-verify.skill.md`:

```
Plan → Implement → Verify → Root Cause Analysis → Fix → Review → Verify Again
```

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js 22 |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| DB | PostgreSQL (Supabase free tier) |
| ORM | Drizzle ORM |
| Auth | iron-session (cookie-based) |
| Hosting | Render free web service (GitHub-integrated) |
| Checker | TestSprite CLI (the loop) |

## Run locally

```bash
cp .env.example .env.local      # fill in DATABASE_URL, DIRECT_URL, SESSION_PASSWORD
npm install
npm run db:migrate              # creates tables
npm run db:seed                 # seeds demo user + 5 sample bugs
npm run dev                     # http://localhost:3000
```

Demo account after seeding: `demo@bugbox.dev` / `demo1234`.

## Verify

```bash
npm run typecheck               # tsc --noEmit
npm test                        # node:test unit suite (auth hash/verify)
npm run build                   # next build (production)
```

## TestSprite loop

The `.testsprite/config.json` holds the TestSprite project id. The
`.github/workflows/testsprite.yml` gates PRs on real test verdicts (+5
Innovation). To run the loop manually against the live URL:

```bash
testsprite test create --plan-from plans/<feature>.json \
  --run --wait --target-url <LIVE_URL> --timeout 600
```

## Project structure

```
bugbox/
├── app/                        # Next.js App Router (pages + API routes)
├── lib/                        # db, schema, session, auth
├── scripts/                    # migrate.ts, seed.ts
├── test/                       # unit tests
├── .testsprite/config.json     # TestSprite project link
├── .github/workflows/          # CI/CD gate
├── DEPLOY.md                   # free-tier deploy guide
└── README.md                   # this file
```

## Repo layout (this ferment)

This repo also carries the autonomy bootstrap (the dev environment the project
was built inside):

- `Brain/` — distributed project memory (extended for the hackathon)
- `Memory/lessons_learned.md` — persistent loop lessons
- `vendor/` — 5 cloned reference repos studied for the bootstrap
- `skills/testsprite-verify.skill.md` — the authoritative verify-loop protocol
- `reviews/` — mandatory self-review records
- `LOOP.md` — the agent-written loop log (judges read this first)
