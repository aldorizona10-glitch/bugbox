---
name: decisions
description: "Key architectural and strategic decisions with rationale and context"
last_updated: "2026-06-26"
related_modules:
  - tasks
  - lessons
  - revenue
status: active
---

# Key Decisions

## 2026-06-26: Payment-Info Split (PII Out of Tracked Files)

**Decision:** Real bank account and USDT wallet values live only in `Brain/private/payment_details.md`, which is gitignored. Tracked files reference that file by path and never embed the actual values.

**Context:** Five tracked files (`tools.md`, `proposal.md`, `client_reply_playbook.md`, `docs/agency_closing_templates.md`, `landing/index.html`) previously hardcoded the SeaBank account number and the BEP20 wallet address. Even on a private repo, this leaks PII to any clone, any future collaborator, and any future leak of the repo itself. The same pattern was already used correctly for `token.json` and `credentials.json`; it had just never been extended to financial receiving details.

**Rationale:** Bank accounts and wallet addresses are harder to rotate than API tokens. Once a value is in git history, removing it requires rewriting history. Better to never commit the value in the first place. Operator copies the real value from the private file at the moment of sending (proposal, client reply, landing page update).

**Rule:**
1. Never embed bank account or wallet address in any tracked file.
2. Public client-facing artifacts (proposal, landing page, closing templates) ship with placeholders that point to `Brain/private/payment_details.md`.
3. At send time, the operator substitutes the real value from the private file. The substituted artifact is sent out-of-band (email, DM), never committed.
4. If a value is ever accidentally committed, treat as compromised: rotate the receiving method first, then rewrite history.

**Reversible:** Trivially. The placeholder pattern is non-destructive. The actual values can move back into tracked files if and only if the repo is opened to the public and the operator accepts the leak risk.

**Known follow-up:** Pre-fix values still exist in git history prior to commit `0a37a94`. A history rewrite (`git filter-repo`) or rotation of receiving methods is recommended if the repo will ever be exposed to anyone outside the operator.

## 2026-06-26: Brain/ Tracked in Version Control

**Decision:** The entire `Brain/` directory (except `Brain/private/`) is now tracked in git.

**Context:** Before this change, `Brain/` was completely untracked. SOP Section 8 (Session Recovery) instructs the operator to run `git checkout HEAD -- Brain/` on WSL wipe. That command was a no-op because nothing in `Brain/` was in git. The same gap made it impossible to audit how project memory evolved over time.

**Rationale:** Tracking `Brain/` aligns the repo state with the SOP. Without it, the SOP's recovery procedure is documentation-only and cannot be executed.

**Rule:** `Brain/private/` stays gitignored. All other modules in `Brain/` are tracked. Module files must stay small (under 200 lines per `Brain/README.md`).

**Reversible:** Yes. Files can be removed from tracking with `git rm --cached` if a future policy requires it.

## 2026-06-21: AI-Assisted Distributed Project Memory System

**Decision:** Replace single-file memory and chat-history dependency with distributed Brain modules.

**Context:** `pekerjaan-terakhir.md` tried to hold everything (~300 lines mixing all concerns). Context limits mean work is lost.

**Architecture:** The AI splits project memory into focused external `.md` modules under `Brain/`. `Brain/index.md` is the entry point, and the folder is the single source of truth. Chat is only the working surface.

**Rationale:** 9 focused modules with cross-references scale better. Any AI session can resume from zero by reading Brain, without depending on previous chat context. This keeps the AI behaving like a software engineer operating from project files, not a chatbot guessing from memory.

**Rule:** After substantial work, update the relevant Brain modules and long-form ledgers before ending the session.

**Reversible:** No for normal operations. The module set can evolve, but project truth must remain externalized in Brain.

## 2026-06-20: Skip Agency Outreach

**Decision:** Pause all agency outreach. Focus on non-agency revenue (bounties).

**Context:** 50+ emails sent, few replies. Bounty work has clearer ROI per hour.

**Reversible:** Yes — user can re-enable anytime.

## 2026-06-12: Stop Moving-Scope Bounties

**Decision:** Do not implement new rewrites for maintainers who change scope.

**Context:** maifetch changed target 11+ times. ItzFireable changed 4+ times.

**Rule:** Do not implement unless scope AND payout terms are fixed before work starts.

## 2026-06-11: Zero Cash Outlay

**Decision:** All revenue attempts must be zero-cost.

**Exception:** Time investment only. No paid tools, ads, or accounts.

## 2026-06-11: Gmail API Over SMTP

**Decision:** Use Gmail API for email automation.

**Context:** SMTP blocked in WSL2. Gmail API over HTTPS works.

## 2026-06-11: Fast-Response HackerOne Priority

**Decision:** Prioritize programs with short response times over slow high-prestige targets.

## 2026-06-10: Bug Bounty Safety Rules

**Decision:** Official scope only, own accounts only, no DoS/brute force, stop if third-party data found, report only via official portals.
