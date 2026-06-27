---
name: architecture
description: "Architecture for BugBox — the selected TestSprite Hackathon S3 project"
last_updated: "2026-06-27"
related_modules:
  - hackathon_ideas
  - hackathon_brief
  - technical
  - frontend_design_principles
status: active
---

# BugBox — Architecture

BugBox is a small bug/issue tracker web app. It is the surface area the TestSprite
verify-loop exercises; the loop is the product (Hackathon judges on Loop Quality).

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Node.js 22 (already installed) | Matches TestSprite CLI's Node ≥20; fastest loop iteration. |
| Framework | Next.js 14 (App Router) | One deploy unit (API + FE); Vercel free-tier deploy in one command; FE testable by TestSprite frontend plans. |
| Language | TypeScript | Type safety; matches existing operator skills. |
| DB | SQLite via `better-sqlite3` (local) → Turso/libSQL or Vercel Postgres (prod) | Free tier; file-based locally = zero friction; a real DB lets BE tests assert persistence. |
| ORM | Drizzle ORM | Lightweight, typed; SQL-first; aligns with SQLite/Postgres. |
| Auth | Cookie-session (iron-session) — single demo user + register/login | No paid auth provider; cookie-based so TestSprite FE flows can log in end-to-end. |
| Hosting | Vercel free tier | One `vercel` deploy; public URL; no localhost; matches CLI requirement. |
| Styling | Plain CSS + CSS variables (no framework) | Avoid AI-slop template look (frontend-design principles); deliberate palette/type. |

## Component Breakdown

```
bugbox/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout, theme tokens, fonts
│   ├── page.tsx              # Dashboard: bug list + filter + create CTA
│   ├── bugs/
│   │   ├── new/page.tsx      # Create bug form
│   │   └── [id]/page.tsx     # Bug detail: view/edit/comment/close
│   ├── login/page.tsx        # Login
│   ├── register/page.tsx     # Register
│   └── api/
│       ├── bugs/route.ts     # GET list (filter/search), POST create
│       ├── bugs/[id]/route.ts# GET/PATCH/DELETE a bug
│       ├── bugs/[id]/comments/route.ts # POST comment
│       └── auth/route.ts     # login/register/logout (session)
├── lib/
│   ├── db.ts                 # Drizzle client + schema
│   ├── schema.ts             # bugs, comments, users tables
│   └── session.ts            # iron-session helpers
├── drizzle/                  # migrations
├── .testsprite/
│   ├── config.json           # projectId
│   └── runs/                 # downloaded failure bundles
├── .github/workflows/testsprite.yml  # CI/CD gate (+5 Innovation)
├── README.md
└── LOOP.md → ../LOOP.md      # lives at repo root (hackathon mandate)
```

## Data Model

```
users      (id, email, passwordHash, name, createdAt)
bugs       (id, title, description, status[open|in_progress|resolved|closed],
            priority[low|med|high|critical], createdBy, createdAt, updatedAt)
comments   (id, bugId, body, authorId, createdAt)
sessions   (handled by iron-session cookies, not a table)
```

Relations: `bugs.createdBy → users.id`; `comments.bugId → bugs.id`;
`comments.authorId → users.id`.

## Integration Points

- **TestSprite CLI** targets `https://<bugbox>.vercel.app` (public URL). FE plans
  drive a browser through the flows; BE tests (if any) hit the API routes.
- **TestSprite project**: `.testsprite/config.json` holds `projectId`; tests
  created via `testsprite test create --plan-from plan.json --run --wait`.
- **CI/CD**: `.github/workflows/testsprite.yml` on `pull_request` runs
  `testsprite test run --all --project $PROJECT_ID --wait` gated on
  `TESTSPRITE_API_KEY` secret (+5 Innovation).
- **LOOP.md** at repo root receives one line per verify iteration.

## Testable User Flows (≥3, drives Loop Quality)

These are the TestSprite FE plan specs that the loop will exercise:

1. **Register → Login → create bug → see it in list.** (auth + create + list)
2. **Filter bugs by status + search by title.** (list + filter + search)
3. **Open a bug → edit its priority → add a comment → close it.** (detail + edit + comment + status change)
4. **Reopen a closed bug.** (status lifecycle — a great loop-catch candidate)

Each flow becomes a TestSprite `plan.json`; each implemented feature triggers a
run; failures drive RCA → fix → re-verify, logged in LOOP.md.

## Deployment Target

Vercel free tier (selected; decision recorded in Brain/decisions.md). Rationale:
one-command deploy, public HTTPS URL, free, Next.js native. Confirmed reachable
via `curl` after deploy.
