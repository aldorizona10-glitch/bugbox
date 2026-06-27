# BugBox — a bug tracker hardened by the loop

> Built for **TestSprite Hackathon Season 3** — *Build the Loop.*
> The loop is the product. BugBox is the surface area the loop exercises.

BugBox is a small bug/issue tracker web app. Every user flow (auth, create,
list, filter, search, edit, comment, close/reopen) is a real TestSprite test
that runs against the **live deployed URL**. When a flow breaks, the TestSprite
CLI returns a `blocked` verdict + failure bundle; the agent reads it, root-causes
it, fixes it, and re-runs. That catch-and-fix story is recorded in
[`LOOP.md`](./LOOP.md) and is the core of what's judged (Loop Quality, 40 pts).

## Live URL

**https://bugbox-eta.vercel.app**

Demo account: `demo@bugbox.dev` / `demo1234`

## What the loop covered

The TestSprite verify loop ran 4 frontend test plans against the live URL.

**Iteration 1 — all 4 tests BLOCKED:**
TestSprite caught a real production bug: all HTML form submissions returned
`{"error":"Invalid JSON"}` because the API routes only accepted JSON bodies,
not form-encoded data from HTML `<form>` submissions. This blocked registration,
login, create-bug, update-bug, and add-comment flows.

**RCA (from failure bundle):**
> "Submitting the registration form returned {\"error\":\"Invalid JSON\"}
> instead of navigating to the dashboard."

**Fix:**
Added `parseBody()` to all 4 API route files — checks `Content-Type` and parses
JSON or `application/x-www-form-urlencoded`. Added redirect-after-submit for
HTML form flows. Also refactored dashboard from HTTP fetch (session cookie not
forwarded on serverless) to direct DB query.

Commit: `aa7f516` — `fix: all API routes handle form-encoded POST (TestSprite RCA: 'Invalid JSON')`

**Iteration 2 — re-verify after fix:**
- Test 1 (register → login → create bug → see in list): **PASSED** (13/13 steps)
- Test 2 (filter by status + search by title): **PASSED**
- Test 3 (edit priority → add comment → close bug): running
- Test 4 (reopen closed bug): pending rerun

See [`LOOP.md`](./LOOP.md) for the full per-iteration log.

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js 22 |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| DB | PostgreSQL (Supabase free tier) |
| ORM | Drizzle ORM |
| Auth | iron-session (cookie-based) |
| Hosting | Vercel Hobby (free, no card) |
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
testsprite test create-batch --plans testsprite-plans/plans.jsonl \
  --run --wait --target-url https://bugbox-eta.vercel.app --timeout 600
```

## Project structure

```
bugbox/
├── app/                        # Next.js App Router (pages + API routes)
├── lib/                        # db, schema, session, auth
├── scripts/                    # migrate.ts, seed.ts
├── test/                       # unit tests
├── testsprite-plans/           # 4 TestSprite FE test plan specs
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
