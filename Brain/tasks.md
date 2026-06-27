---
name: tasks
description: "Current active tasks, in-progress items, blockers, and next actions"
last_updated: "2026-06-27"
related_modules:
  - bounties
  - revenue
  - agency
  - decisions
status: active
---

# Active Tasks

## Priority 1: Monitor Live GitHub PR

- [ ] Monitor djjrip/kickama-cash-grab-hacks PR #37 for maintainer response
- [ ] Patch only if maintainer requests changes and payout authority is clear
- [ ] Request payout only after merge/acceptance and only if payment instructions are explicit
- [ ] Treat issue #2 as risky: issue title/body mismatch and competing PRs #38/#48 are already present

## Priority 2: Quantum Payout Policy

- [ ] Wait for @pbtc21 / @lekanbams response on goodwill/policy escalation for quantum-visualizer #74/#75
- [ ] Do not do more quantum-visualizer maintenance unless payout terms are explicit before work starts

## Priority 3: Find New Clean Bounties

- [ ] Search GitHub/Algora/Opire/Polar for fresh, explicit, low-competition bounty issues
- [ ] **Pre-bounty validation checklist WAJIB sebelum claim (see lessons.md #7 + case study)**
- [ ] Reject saturated repos and moving-scope maintainers before coding
- [ ] Claim only after checking: (a) fork relationship, (b) Brain history for repo, (c) duplicate PRs, (d) payout rules documented externally
- [ ] Current triage result: no high-confidence clean bounty selected; PR #37 is open but ambiguous/saturated
- [ ] Only use verified bounty platforms: Algora (algora.io), Opire (opire.dev), Polar.sh, BountyHub — NOT self-issued fork bounties

## Priority 4: Paused (Do Not Touch)

- ItzFireable Portfolio PR #10 (moving scope)
- maifetch PRs #10/#12/#13/#15 (closed; moving scope)
- Frailbox PR #15 (closed 2026-06-23 UTC; fork was not active intake/payment authority)
- **quickops-shadow-arena Issues #1/#2/#3 + 11 PRs (closed 2026-06-27; fork NOT verified payment authority — see lessons.md case study)**
- lobster-trap/Kickama #414/#415 (repo not live-verifiable)
- Agency outreach (paused per user)
- Sibyl-Memory #8 (bug real, no explicit bounty payout — skip per SOP Section 4)
- CyberNinja-Dojo #2/#10 (27 PRs, owner-only merges — saturated/self-dealing)

## Priority 5: Revenue Scout

- [ ] Continue scanning HN Show HN for new opportunities
- [ ] Run `full_auto_revenue_scout.py` periodically

## Blocked / Waiting

- Agency outreach: paused per user
- No confirmed payments yet
- djjrip/kickama-cash-grab-hacks #37: open, clean, no checks/reviews/comments; competing PRs exist and payout quality is uncertain
- Quantum #74/#75: waiting for admin/policy response after DRI declined bounty-window payout

## Session Resume Checklist

1. Read `Brain/index.md`
2. Read `Brain/tasks.md`
3. Check `bounty_program_tracker.csv` for PR statuses
4. Check `docs/non_agency_revenue_log.md` for latest updates
5. Run `gh pr view 37 --repo djjrip/kickama-cash-grab-hacks --json state,mergeStateStatus,statusCheckRollup,comments,reviews,updatedAt`
6. Execute highest-priority unblocked task
