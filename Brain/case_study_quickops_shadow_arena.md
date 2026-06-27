---
name: case-study-quickops-shadow-arena
description: "Full case study of quickops-shadow-arena red flag — mistakes, timeline, root causes, and lessons learned"
last_updated: "2026-06-27"
related_modules:
  - lessons
  - bounties
  - decisions
status: active
---

# Case Study: quickops-shadow-arena Red Flag (2026-06-27)

> This document is a full forensic analysis of a reputation-damaging mistake.
> Read this before creating any bounty issue, closing any PR, or confirming any payment.

## Background

`quickops-shadow-arena` is a fork of `Soengkit/frailbox-checkpoint`, created as part of the frailbox bounty commission structure. The commission model stated: "You can earn an extra $5 for every bounty issue you create on your own fork, provided you keep up with submissions."

**Critical fact already in Brain (2026-06-23):** PR #15 to upstream was closed because "owner said fork is not active bounty intake/payment authority."

This fact was recorded in:
- `Brain/bounties.md` line 129
- `Brain/revenue.md` line 53
- `Brain/tasks.md` Priority 4

## Timeline of Events

| Time (2026-06-27) | Action | Mistake? |
|---|---|---|
| Session start | User asked to check GitHub inbox | — |
| ~Turn 5 | Listed 11 open PRs in quickops-shadow-arena | — |
| ~Turn 8 | Drafted reply to `chenlinxi890-spec` confirming $10 bounty | **YES** — confirmed payment without verifying authority |
| ~Turn 9 | Posted reply to 3 issues (#1, #2, #3) | **YES** — posted before verification |
| ~Turn 12 | User warned: "verify payment authority" | — |
| ~Turn 13 | Verified: fork is NOT payment authority (confirmed via `gh api` fork relationship + Brain record) | — |
| ~Turn 14 | Posted correction to 3 issues | Mitigation |
| ~Turn 15 | Closed 3 issues + 11 PRs with generic comment | **YES** — batch-closed with copy-paste |
| ~Turn 16 | PR #15 (StealthEyeLLC) discovered still open — closed with same template | **YES** — PR arrived AFTER issues closed; contributor didn't know |
| ~Turn 17 | User questioned: "why did you close PR #15?" | — |
| ~Turn 18 | Posted personal apology to StealthEyeLLC | Mitigation |

## Root Cause Analysis (5 Layers)

### Layer 1: Did not read Brain before acting

Brain already contained the answer. `bounties.md`, `revenue.md`, and `tasks.md` all recorded that the fork was NOT a payment authority. The agent skipped reading its own memory before posting payment confirmations.

**Fix:** Before ANY action involving a repo, search Brain for that repo name. `grep -r "repo-name" Brain/` takes 1 second.

### Layer 2: Did not run pre-bounty validation checklist

Lesson #7 (created earlier same session) lists 4 checks:
1. Repo accepts external PRs
2. Official payout documentation exists
3. Issue is not just a "payment tracker"
4. Clear payment instructions (method, platform, trigger)

None were run before posting the $10 confirmation.

**Fix:** The checklist must be a hard gate. No confirmation of any kind until all 4 pass.

### Layer 3: Confirmed payment without proof

SOP Section 1 Rule 3: "Do not claim revenue until payment is actually received."

The agent extended this to mean "don't count it in revenue.md" — but the spirit of the rule is broader: **do not make any payment claim to any person unless you have verified proof that payment will occur.**

**Fix:** Expand SOP Rule 3 interpretation: "Do not confirm, promise, or imply any payment to any contributor unless a verified payment mechanism is documented."

### Layer 4: Batch-closed PRs with copy-paste comment

11 PRs closed with identical text. PR #15 (StealthEyeLLC) arrived AFTER issues were closed — the contributor didn't know the bounty was invalid. Closing with the same generic message was impersonal and damaged goodwill.

**Fix:** When closing multiple PRs:
- Group by submission time (before vs after issue closure)
- For PRs submitted AFTER issues closed: post a personal comment acknowledging their effort, explain they couldn't have known, recommend verified platforms
- For PRs submitted BEFORE: explain the discovery and apologize
- Never use identical copy-paste for more than 3 PRs in a row

### Layer 5: Eager to act, slow to verify

The agent posted the confirmation reply within 1 turn of drafting it. The verification (fork relationship, Brain history, upstream docs) took 2 turns and was only triggered by the user's warning.

**Fix:** Default to verify-first. Before posting, committing, or merging anything that involves claims about payment:
1. Verify fork relationship (`gh api repos/OWNER/REPO --jq '.fork,.parent.full_name'`)
2. Search Brain for repo name
3. Check for external bounty platform link (Algora, Opire, Polar, BountyHub)
4. Only post after all 3 return clean

## Warning Signs to Watch For

Any of these = STOP and verify before acting:

1. **Issue body contains "You can earn an extra $5 for every bounty issue you create on your own fork"** — This is a multi-level bounty pyramid structure, not a verified payment authority.
2. **Repo is a fork** (`gh api repos/OWNER/REPO --jq '.fork'` returns `true`) — Forks are rarely payment authorities.
3. **No link to external bounty platform** (Algora, Opire, Polar.sh, BountyHub) in issue body or README.
4. **Brain already has a closure record for this repo** — `grep -r "repo-name" Brain/` returns matches in bounties.md, revenue.md, or tasks.md.
5. **Issue body uses exact same template as other repos** — copy-paste bounty template pattern indicates pyramid structure.
6. **Repo owner merges only their own PRs** — self-dealing pattern (see CyberNinja-Dojo: 5 merged PRs, all by repo owner).

## Impact Assessment

### Reputational Damage

- **7 contributors** invested time on PRs for bounties that cannot be verified:
  Dreamstore2046, dollarop, BWM0223, Roc755, HaroldTheAI, alexanderxfgl-bit, gelo244gum-stack
- **1 contributor** (`StealthEyeLLC`) submitted PR #15 AFTER issues were closed — invested time without knowing bounty was invalid
- **1 contributor** (`chenlinxi890-spec`) specifically asked "is this eligible for real payment?" — agent said YES, then had to post correction
- Reputation as bounty issuer: damaged. Contributors may avoid future issues from this account.
- Reputation as bounty hunter (upstream): neutral — this was on the fork, not upstream submissions.

### Financial Impact

- $0 lost (no money was exchanged)
- $15 potential commission ($5 × 3 issues) — was never real because payment authority was never verified
- Time cost: ~20 turns across the session spent on this repo that could have been used for verified bounties

### Mitigation Applied

1. ✅ Correction comments posted to all 3 issues
2. ✅ All 3 issues closed with honest explanation
3. ✅ All 12 PRs closed (11 original + 1 late arrival)
4. ✅ Personal apology posted to StealthEyeLLC
5. ✅ Case study documented (this file)
6. ✅ Lessons #7, #9, #10 added to `Brain/lessons.md`
7. ✅ Tasks updated with paused/blocked list

## Rules Added to SOP (Non-Negotiable)

These rules are now enforceable from `docs/professional_revenue_operating_standard.md`:

1. **Fork check before bounty issue creation:** `gh api repos/OWNER/REPO --jq '.fork'` must return `false`, OR upstream must explicitly authorize the fork as bounty intake.
2. **Brain search before action:** `grep -r "repo-name" Brain/` must return no closure records before creating new bounty issues.
3. **External platform link required:** Issue body or README must link to Algora, Opire, Polar.sh, or BountyHub for payment verification.
4. **No batch copy-paste closures:** When closing 3+ PRs, each closure comment must be personalized.
5. **Verify-first, act-second:** Before posting any payment confirmation, run all 4 pre-bounty validation checks (see lessons.md #7).

## What to Do Differently Next Time

1. **Before creating bounty issues:** Run fork check + Brain search + platform link check. If any fail, do not create issues.
2. **Before confirming payment:** Verify payment authority exists. If not verified, say "I cannot confirm payment at this time" — not "yes, $10 per issue."
3. **When discovering a mistake:** Post correction immediately. Do not wait.
4. **When closing PRs:** Personalize. Acknowledge effort. Recommend verified platforms. Group by submission time.
5. **When a PR arrives after issue closure:** Do not close with template. Post a personal comment explaining the situation and asking the contributor how they want to proceed.

---

*This case study is a living document. If a similar mistake occurs again, update this file with the new incident and adjust the rules accordingly.*
