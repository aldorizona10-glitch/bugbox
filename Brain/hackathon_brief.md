---
name: hackathon_brief
description: "TestSprite Hackathon Season 3 rules, prizes, judging criteria, and deliverables"
last_updated: "2026-06-27"
related_modules:
  - hackathon_ideas
  - architecture
status: active
---

# TestSprite Hackathon Season 3 — Brief

Source: https://www.testsprite.com/hackathon-s3 (fetched 2026-06-27)

## Theme
**CLI Launch & Loop Engineering — "Build the Loop."**
Your agent writes the code; the open-source TestSprite CLI checks it: real tests
against your live app, with verdicts your agent acts on. Write → verify → fix →
verify.

## Timeline
- **Jun 30, 5:00 PM PDT** — Launch & Setup (install CLI, onboard agent, deploy app).
- **Jun 30 – Jul 7** — Build & Loop (write → verify → fix against your live app).
- **Jul 7, 4:59 PM PDT** — **Submissions close.** (HARD deadline.)
- Jul 8 – Jul 12 — Review (every entry against the rubric).
- Jul 13 — Winners revealed on X & Discord.

## Prizes — $5,000 total
- **Project Awards — $3,000, 5 winners.** Best projects built with the CLI in a
  real testing loop. Judged on the loop, not polish or pitch.
  - 1st (Grand Champion): $1,500
  - 2nd: $750
  - 3rd: $450
  - 4th: $150 (Honorable Mention)
  - 5th: $150 (Honorable Mention)
- **CLI Improvement Bonus — $2,000 pool, standing bounty.** Separate from judging;
  cash for merged CLI improvements (first-come from the $2,000 pool until exhausted).
  Does NOT affect Project Award score.

## Judging Criteria (105 pts + bonus)
| Criterion | Points | What it measures |
|-----------|--------|------------------|
| **Project Quality** | 40 | Craft, polish, completeness. Does the live app actually work well? |
| **Loop Quality** | 40 | Did a real loop run, and catch and fix real things? Read from LOOP.md, commits, and runs. |
| **Innovation** | 20 | Creativity of the project or the loop design. |
| **CI/CD wiring** | +5 | (Optional, under Innovation) Wire the checker into GitHub Actions. |
| **Engagement** | ∞ bonus | Discord polls, X shares, long-form write-ups. |

**Loop Quality (40) = Project Quality (40) in weight.** The loop is the product.

## The Loop — four steps, one repeats
1. **Write** — coding agent (Claude Code / Codex / Antigravity / etc.) ships code.
2. **Verify** — TestSprite CLI runs real tests against the live app, returns verdicts.
3. **Fix** — agent reads the failure bundle, fixes the root cause.
4. **Verify Again** — rerun. Pass banks. Back to the top.

## Mandatory deliverables (all required)
1. **Public repo** with source + an **agent-written LOOP.md** (one line per
   iteration: maker first, then what ran, what broke, what got fixed) + a
   **README** with the app description and live URL.
2. **Public deployed URL** — the CLI tests in the cloud; **no localhost**. Deploy
   early, keep it live the entire build.
3. **Post in Discord #hackathon-submissions** — live URL, public repo link,
   TestSprite account (email + name). Demo video optional but encouraged.

## Prerequisites
- **TestSprite CLI** — install from GitHub (TestSprite/testsprite-cli); Node ≥ 20;
  paid plan via promo code. `testsprite setup` installs a verification skill into
  the agent.
- **Public URL** — required; no localhost/RFC1918/link-local.
- **Public repo** — required; commit history is the proof the loop ran.
- **LOOP.md** — required; no log = invalid submission.
- **README** — required; app + live URL + what the loop covered.

## CI/CD bonus (+5 Innovation)
Gate a GitHub Actions pipeline on TestSprite:
`.github/workflows/testsprite.yml` on `pull_request`, with `TESTSPRITE_API_KEY`
secret + `PROJECT_ID` env, running `testsprite test run --all --project ... --wait`.
Non-zero exit fails the build.

## Status of prerequisites (this workspace)
- TestSprite CLI: **NOT installed** — surfaced as an open dependency to the operator
  (per the testsprite-verify skill, do not auto-install). Required before any
  verify-loop iteration can bank a real verdict.
- Existing `skills/testsprite-verify.skill.md` already encodes the authoritative
  loop procedure — extends/aligns with what `testsprite setup` would install.
