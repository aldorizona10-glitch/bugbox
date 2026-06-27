---
name: hackathon_ideas
description: "Candidate TestSprite Hackathon S3 project ideas, scored on EV/effort/risk, with the selected winner"
last_updated: "2026-06-27"
related_modules:
  - hackathon_brief
  - architecture
status: active
---

# Hackathon Ideas — Scored

Selection biases toward: (1) many independently-testable user flows (maximizes
**Loop Quality = 40pts** — the loop is the product), (2) solo-buildable on
free-tier hosting in 7 days, (3) a real working app (Project Quality = 40pts),
(4) a creative loop angle (Innovation = 20pts).

Scoring (1–5, higher better):
- **Flows**: count of independently-verifiable user journeys (feeds Loop Quality).
- **EV/Prize**: 1st=$1,500 … 5th=$150; weighted win-prob given the approach.
- **Effort**: dev-days for a solo build (lower = better; inverted in EV calc).
- **Risk**: technical/deployment/scope risk (lower = better).
- **Innov**: creativity of project or loop design (Innovation 20pts).
- **EV**: (Prize × WinProb) / Effort, normalized 1–5.

---

## Idea A — BugBox (bug/issue tracker mini-app)

A small, real bug-tracker web app (create / list / view / edit / close / reopen /
filter / search / comment) with auth. Ships with a narrative loop: features land,
TestSprite catches real regressions, you RCA + fix + re-verify, and LOOP.md tells
the catch-and-fix story. Thematically perfect — bugs are what the loop catches.

| Flows | EV/Prize | Effort | Risk | Innov | EV |
|-------|----------|--------|------|-------|----|
| 5 (8+ flows) | 4 | 3 (low) | 4 (low) | 4 | **5** |

- **Pros:** CRUD + auth = the densest set of testable flows; self-contained (no
  external API dependency); a working bug tracker is a respectable Project Quality
  deliverable; the loop story writes itself (seed a regression, TestSprite catches
  it, fix, re-verify). Deploys cleanly on Vercel free tier.
- **Cons:** CRUD apps are not novel — but Innovation rewards loop design, and
  BugBox's loop IS the novelty (every bug = a real failure-bundle iteration).
- **Testable flows:** login, create bug, list+filter, view detail, edit, close/
  reopen, comment, search = ≥8 distinct TestSprite FE/BE plans.

## Idea B — LoopPoker (gamified TestSprite loop dashboard)

A web app that visualizes your TestSprite run history as a game: streaks,
pass-bank counts, failure-bundle drill-downs, LOOP.md export. Meta: the app is
itself tested by TestSprite — the loop on the loop.

| Flows | EV/Prize | Effort | Risk | Innov | EV |
|-------|----------|--------|------|-------|----|
| 4 | 3 | 2 (high) | 2 (high) | 5 | 3 |

- **Pros:** Highest Innovation (meta-loop is creative).
- **Cons:** Depends on TestSprite API access for real data — uncertain
  availability/rate-limits; if no public API, must mock data (kills authenticity,
  hurts Loop Quality). Higher scope for a solo week. Risk too high.

## Idea C — UnitCalc (recipe/unit converter utility)

A conversion utility with many input→output flows and edge cases.

| Flows | EV/Prize | Effort | Risk | Innov | EV |
|-------|----------|--------|------|-------|----|
| 4 | 2 | 5 (very low) | 5 (very low) | 1 | 2 |

- **Pros:** Lowest effort/risk.
- **Cons:** Low Innovation (utility), thin Project Quality story. Doesn't lean
  into the loop theme.

---

## SELECTED: Idea A — BugBox

**Rationale:** Highest EV. It directly optimizes the two 40-point criteria:
- **Loop Quality (40):** every CRUD flow is a TestSprite test that can fail and be
  fixed through the loop → the richest, most authentic LOOP.md evidence.
- **Project Quality (40):** a real, working, deployed bug tracker is a complete,
  demonstrable app — not a toy.
- **Innovation (20):** the loop story itself (bugs caught by the checker) is the
  creative angle; a bug tracker whose hardening is the submission narrative.
- **Low risk, low effort:** self-contained, free-tier deployable, no external API
  dependency. Solo-buildable well within 7 days.

The loop is the product; BugBox is the surface area the loop exercises.
