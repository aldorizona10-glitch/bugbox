# Memory — Lessons Learned

Persistent lessons from the TestSprite Hackathon S3 build loop. Each entry is
dated and names a root cause + fix. Read before any verify-loop iteration.
Cross-referenced from `Brain/lessons.md` (operator-wide lessons) and
`Brain/case_study_quickops_shadow_arena.md`.

Format: `YYYY-MM-DD — Lesson — Root cause — Fix`

---

2026-06-27 — A clone race beats a mkdir — Root cause: parallel `git clone` into `vendor/` fired before the `mkdir vendor` completed in a separate parallel call, so all clones failed with "No such file or directory." — Fix: when a command creates a directory that later commands depend on, either sequence them or create the dir first and confirm before fanning out. Verified: re-ran clones after dir existed, all 5 succeeded.

2026-06-27 — TestSprite CLI is a hard external dependency, not auto-installable — Root cause: the testsprite-verify skill explicitly says "don't install it for them"; the CLI requires a paid plan via promo code + `testsprite setup` onboarding. — Fix: surface the gap to the operator explicitly ("Feature shipped but I could not run any TestSprite test because <X>") rather than claiming done. Do NOT auto-install. Record as an open dependency in LOOP.md and proceed with buildable work until the operator provisions it.
