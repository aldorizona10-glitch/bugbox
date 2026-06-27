# LOOP.md

The agent-written log of the Write → Verify → Fix → Verify-Again loop for the
TestSprite Hackathon Season 3 project. One line per iteration. Backed by commit
history + TestSprite run history. Judges read this first.

## The loop (mandate)

```
Plan → Implement → Verify → Root Cause Analysis → Fix → Review → Verify Again
```

Every shipped feature triggers ≥1 TestSprite CLI run to a terminal verdict
(`passed` / `failed` / `blocked`). Verdicts are recorded here as one line per
iteration. LOOP.md is never hand-written retroactively — each line is added when
the iteration's verify step completes.

Line format: `YYYY-MM-DD HH:MM TZ | maker | what-ran | verdict | notes`

## Iterations

2026-06-27 06:30 UTC | bootstrap | cloned 5 vendor repos (Superpowers, frontend-design, code-review, claude-mem, gstack) + created Brain/Memory/vendor/skills/reviews | info | environment bootstrap; TestSprite CLI not yet installed — dependency surfaced to operator
