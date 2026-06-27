# reviews/

Mandatory self-review records for the TestSprite Hackathon S3 build. Per the
operational rules: "Perform self-review before every commit" and "Code review
must be mandatory before merge or finalization."

## Protocol

Before every behavior-changing commit, run `reviews/checklist.md` and write a
dated review file here: `reviews/YYYY-MM-DD-HHMM-<feature>.md`.

A review file must answer, from three explicit perspectives (adopted from the
claude-code code-review plugin + gstack role separation):

1. **Eng / correctness** — does the code do what the spec says? Any obvious bugs?
2. **QA / verification** — did a TestSprite run actually reach a terminal verdict
   against the live URL? If not, is the gap recorded in LOOP.md?
3. **Release / deploy** — is it deployed? Does the live URL return 200? Any
   secrets or generated files accidentally staged?

Each issue is scored 0–100 confidence (adopted from code-review plugin). Only
issues at confidence ≥80 block the commit; lower-confidence notes are advisory.

## Skip list (mirrors testsprite-verify skill)

- Docs-only edits (`*.md`).
- Pure config/lockfile bumps with no behavior change.

Everything else gets a review file.
