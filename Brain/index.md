---
name: brain-index
description: "Master index of all Brain modules. Read this first to resume work."
last_updated: "2026-06-26"
related_modules:
  - identity
  - project-context
  - revenue
  - agency
  - bounties
  - technical
  - tasks
  - decisions
  - lessons
status: active
---

# Brain Index

## Quick Status (2026-06-26)

- **Confirmed Revenue:** $0
- **Live-Verified Pending Bounties:** 1 open PR, $20 potential (djjrip/kickama-cash-grab-hacks #37)
- **Merged But Unpaid:** quantum-visualizer #74/#75 merged; payout declined as post-bounty-window, goodwill/policy escalation pending
- **Not Live-Verifiable:** lobster-trap/Kickama #414/#415 repo currently no access/not found; do not count as active or revenue
- **Agency Outreach:** PAUSED per user directive
- **Top Blocker:** No clean high-confidence bounty is active; PR #37 is open but saturated/ambiguous, and Frailbox #15 was closed as non-authoritative.
- **Active Focus:** Non-agency revenue (bounties only)

## Module Map

| Module | Description | Status | Updated |
|--------|------------|--------|---------|
| [identity](./identity.md) | Operator profile, preferences, rules | active | 2026-06-26 |
| [project-context](./project-context.md) | What is QuickOps AI, goals, repo layout | active | 2026-06-22 |
| [revenue](./revenue.md) | Revenue tracking, financial targets | active | 2026-06-23 |
| [agency](./agency.md) | Outreach pipeline, clients, templates | paused | 2026-06-21 |
| [bounties](./bounties.md) | Bounty programs, PRs, competitors | active | 2026-06-23 |
| [technical](./technical.md) | Tech stack, scripts, tools, environment | active | 2026-06-21 |
| [tasks](./tasks.md) | Current tasks, blockers, next actions | active | 2026-06-23 |
| [decisions](./decisions.md) | Key decisions with rationale | active | 2026-06-22 |
| [lessons](./lessons.md) | Mistakes to avoid, feedback | active | 2026-06-21 |

## Resume Protocol

1. Read this file (you are here)
2. Read [tasks.md](./tasks.md) — know what to do NOW
3. Read relevant module based on task type
4. Check [decisions.md](./decisions.md) before making new decisions
5. Check [lessons.md](./lessons.md) before repeating known mistakes
6. After work done, update affected Brain modules

## Change Log

- 2026-06-26: SOP v2.0 published. Added Failure Handling, Session Recovery (WSL Restart Procedure), Review Cadence, and tiered offers (USD 100 / 250 / 500). Replaced shell-string rule with pointer to runbook.
- 2026-06-26: Payment-info split. Bank account and USDT wallet moved from `Brain/identity.md` to gitignored `Brain/private/payment_details.md`. Five tracked files (tools, proposal, client_reply_playbook, agency_closing_templates, landing/index) updated with placeholders. Note: pre-fix values still exist in git history prior to commit `0a37a94`.
- 2026-06-26: Brain/ added to version control. SOP Section 8 Session Recovery now functional (was a no-op before). `Brain/private/` stays gitignored.
- 2026-06-23: Live check found Frailbox #15 closed by owner as non-authoritative fork intake; added djjrip/kickama-cash-grab-hacks #37 as the only open authored bounty PR.
- 2026-06-22: Formalized Brain as the AI-assisted Distributed Project Memory System and single source of truth.
- 2026-06-22: Removed generated binary test artifacts from Frailbox PR #15; CI remains passing; no explicit Frailbox payment deadline found.
- 2026-06-22: Synced GitHub PR status after live audit. Only Frailbox #15 remains active/open.
- 2026-06-21: Brain created. 9 modules + index. Extracted from existing project files.
