# BugBox — Deployment Guide

This project deploys as **two free-tier pieces**:

1. **Database** — Supabase Postgres (free, no credit card).
2. **App runtime** — any Node host with GitHub integration (Render free web service,
   or fly.io free tier). The repo is GitHub-native (push to deploy).

Both honor the operator's zero-cash rule (Brain/identity.md).

## 1. Database — Supabase Postgres (free)

1. Create a project at https://supabase.com (free tier).
2. Project Settings → Database → Connection string.
3. Copy two URLs:
   - **Pooled** (port `6543`, `?pgbouncer=true`) → `DATABASE_URL`
   - **Direct** (port `5432`) → `DIRECT_URL` (used for migrations only)
4. Set them as environment variables on your host (and locally in `.env.local`).

## 2. Run migrations + seed

```bash
cp .env.example .env.local   # fill in DATABASE_URL + DIRECT_URL + SESSION_PASSWORD
npm install
npm run db:migrate           # creates tables (uses DIRECT_URL)
npm run db:seed              # seeds demo user demo@bugbox.dev / demo1234 + 5 bugs
```

## 3. App runtime — Render free web service (GitHub-integrated)

1. Push this repo to GitHub.
2. Render → New → Web Service → connect the GitHub repo.
3. Settings:
   - **Runtime**: Node
   - **Build**: `npm install && npm run build && npm run db:migrate`
   - **Start**: `npm start`
   - **Env vars**: `DATABASE_URL`, `DIRECT_URL`, `SESSION_PASSWORD`,
     `NEXT_PUBLIC_APP_URL` (your Render public URL), `NODE_ENV=production`
4. Deploy. Render gives a public HTTPS URL — that is your `--target-url` for
   TestSprite.

> Render free web services spin down after 15 min idle and cold-start in ~50s.
> That is fine for the hackathon — the TestSprite run `--wait` (default 600s)
   covers the cold start.

### Alternative hosts (also free, GitHub-integrated)
- **fly.io** free tier — `fly launch` from the repo; persistent volumes optional.
- **Railway** — has a $5/mo Hobby plan (NOT free — violates zero-cash rule; avoid).

## 4. TestSprite project link

```bash
testsprite project list --output json          # find or note the project id
# write it into .testsprite/config.json:
echo '{"projectId":"<your-project-id>"}' > .testsprite/config.json
```

## 5. Environment variables (all required in production)

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Supabase pooled Postgres URL (port 6543) |
| `DIRECT_URL` | Supabase direct Postgres URL (port 5432) — migrations only |
| `SESSION_PASSWORD` | ≥32 char random hex — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_APP_URL` | The public HTTPS URL of the deployment |
| `NODE_ENV` | `production` |

Never commit `.env.local`. `SESSION_PASSWORD` and DB credentials are secrets.
