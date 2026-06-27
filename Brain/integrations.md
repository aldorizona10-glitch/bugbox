---
name: integrations
description: "Integration report for the 5 vendor repos cloned for the elite autonomy bootstrap"
last_updated: "2026-06-27"
related_modules:
  - technical
  - decisions
status: active
---

# Vendor Integration Report

Five reference repositories cloned shallow into `./vendor/` for the TestSprite Hackathon S3 bootstrap. For each: what we adopted, what we rejected, and why. Active adoption, not passive study.

| Repo | Path | SHA (shallow) |
|------|------|---------------|
| Superpowers | `vendor/Superpowers` | 896224c @ 2026-06-18 |
| anthropics/skills (frontend-design) | `vendor/skills-repo/skills/frontend-design` | 5754626 @ 2026-06-09 |
| anthropics/claude-code (code-review plugin) | `vendor/claude-code-repo/plugins/code-review` | 01f1617 @ 2026-06-26 |
| claude-mem | `vendor/claude-mem` | 3fe0725 @ 2026-06-24 |
| gstack | `vendor/gstack` | 11de390 @ 2026-06-25 |

---

## 1. obra/Superpowers

Spec-driven, subagent-driven development methodology built on composable skills. Asks what you're really trying to do before writing code, surfaces a spec in chunks, then drives a plan + TDD implementation via subagents.

- **Adopted:**
  - Spec-before-code discipline → encoded into the verify loop: a feature is not "started" until its TestSprite test plan (FE) or pytest script (BE) is drafted. The spec is the test.
  - Plan → Implement → Verify → RCA → Fix → Review → Verify Again loop (the hackathon's own mandate) maps 1:1 onto Superpowers' subagent-driven loop.
  - True red/green principle: a test that never failed is not trusted evidence. We bank a TestSprite run only after it has produced a terminal verdict.
  - YAGNI / DRY applied to scope: cut features that don't add a testable user flow (each feature must produce Loop Quality evidence).
- **Rejected:**
  - Plugin marketplace install (`/plugin install superpowers@...`) — this harness is `pi`, not Claude Code; we adopt the methodology, not the installer.
  - Full skill catalog — many skills are Claude-Code-specific slash commands; we cherry-pick the meta-patterns instead of importing the whole tree.
- **Why:** Superpowers' core value is the discipline (spec → plan → subagent loop → TDD), which is harness-agnostic. The packaging is not.

## 2. anthropics/skills — frontend-design (SKILL.md)

A design-lead persona that produces distinctive, intentional visual design: ground in the subject, deliberate palette/type, one signature element, restraint elsewhere.

- **Adopted:**
  - Brain/frontend_design_principles.md extracts the principles so any frontend work in this ferment references them.
  - "The hero is a thesis" — every page opens with the most characteristic thing.
  - "Spend your boldness in one place" — one signature element, discipline elsewhere.
  - Anti-template checklist: reject the three default AI looks (warm-cream serif / near-black acid-green / broadsheet hairline) unless the brief explicitly calls for one.
  - Naming rule: controls named by what the user does ("Save changes", not "Submit"); active voice; empty states are invitations.
- **Rejected:**
  - Two-pass brainstorm→build ceremony as a hard gate — too slow for a 7-day hackathon; condensed to "one short design plan in the commit message, then build".
- **Why:** The principles are gold for not shipping AI-slop UI (directly serves Project Quality, 40pts). The full studio process is overkill for a solo week sprint.

## 3. anthropics/claude-code — code-review plugin

Multi-agent parallel PR review: 4 agents audit (CLAUDE.md compliance ×2, bugs, git-blame context), each issue scored 0–100, filtered at confidence ≥80.

- **Adopted:**
  - Confidence-scored review filter codified into reviews/checklist.md: an issue only blocks if you can assign it confidence ≥80; lower-confidence notes are advisory.
  - Multi-perspective review pattern: before each commit, self-review from (a) correctness/bugs, (b) test coverage (did the TestSprite run actually pass?), (c) spec compliance. Three perspectives, not one.
  - "Skip closed/draft/trivial/already-reviewed" gate → we only run self-review on commits that change behavior, not docs/lockfile bumps (mirrors testsprite-verify skip list).
- **Rejected:**
  - The PR-comment auto-post (`--comment`) — we are solo; reviews go to reviews/ as files, not PR comments.
  - Launching 4 separate agents for a solo self-review — overkill; one pass with 3 explicit perspectives replaces it.
- **Why:** The confidence threshold prevents review noise drowning signal; the multi-perspective pattern catches what a single pass misses. Auto-commenting is team plumbing we don't need.

## 4. thedotmack/claude-mem

Persistent memory compression system for Claude Code — compresses session context into durable memory across sessions.

- **Adopted:**
  - Recognized equivalence: our existing `Brain/` system IS a persistent-memory system (see Brain/README.md). claude-mem confirms the architecture; we do not run a second memory store alongside Brain.
  - Compression principle: keep each Brain module <200 lines (already a Brain rule); summarize, push long evidence to docs/ or CSV.
  - Cross-session resume: Brain/index.md + Brain/tasks.md already implement this; claude-mem's pattern is honored by our existing SOP.
- **Rejected:**
  - claude-mem's own storage/installation — would duplicate Brain/ and create two sources of truth (violates Brain/README.md rule: "single source of truth").
  - Its automated compression hooks — our operator updates Brain modules manually after substantive work (intentional, not a deficiency).
- **Why:** Adopting claude-mem's concept means NOT adopting its tooling here — Brain/ already does the job and is battle-tested for this operator. Two memory systems is an anti-pattern.

## 5. garrytan/gstack

"Software factory" for Claude Code: 23 specialist slash-command roles (CEO review, eng review, design, QA, security, release) + 8 power tools. Turns one person into a virtual team.

- **Adopted:**
  - Role separation mental model: when self-reviewing, explicitly cycle through roles — eng (correctness), QA (does the test verify real behavior?), security (auth/scope), release (is it deployable?). Captured in reviews/checklist.md.
  - "QA opens a real browser" — the TestSprite CLI is our equivalent: a real external check against the live URL, not a unit test assertion. This is the hackathon's central thesis.
  - Ship discipline: a feature is not done until it's deployed AND verified against the live URL.
- **Rejected:**
  - The 23 slash commands and 8 tools — Claude-Code-specific; we cannot `/office-hours` in pi.
  - Bun dependency and `~/.claude/skills/gstack` install path — wrong harness.
  - The full role ceremony for a solo hackathon — too heavy; condensed into the self-review checklist.
- **Why:** gstack's value is the role-separation discipline and the "real browser QA" insistence, both of which directly serve Loop Quality (40pts). The command packaging is harness-locked.

---

## Active-adoption summary

| Concept adopted | Source repo | Where it lives |
|-----------------|-------------|-----------------|
| Spec = test (red/green first) | Superpowers | LOOP.md + skills/testsprite-verify.skill.md |
| Plan→Implement→Verify→RCA→Fix→Review→Verify-Again | Superpowers + hackathon | LOOP.md |
| Frontend design principles (anti-slop) | frontend-design | Brain/frontend_design_principles.md |
| Confidence ≥80 review filter | code-review plugin | reviews/checklist.md |
| Multi-perspective self-review | code-review + gstack | reviews/checklist.md |
| Real external check (live URL, not localhost) | gstack + hackathon | skills/testsprite-verify.skill.md (authoritative) |
| Persistent memory (single source of truth) | claude-mem | Brain/ (existing, extended) |
| Role separation in review | gstack | reviews/checklist.md |
