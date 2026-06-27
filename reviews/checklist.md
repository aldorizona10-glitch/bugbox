# Pre-Commit Self-Review Checklist

Adopted from the anthropics claude-code code-review plugin (confidence-scored,
multi-perspective) and gstack (role separation). Run before every
behavior-changing commit.

## Three perspectives, one pass

### 1. Eng / correctness
- [ ] Code does what the spec/test plan says.
- [ ] No obvious bugs in the diff (`git diff --stat` then the changed files).
- [ ] Edge cases on the changed path named and handled (or explicitly deferred).

### 2. QA / verification
- [ ] A TestSprite run reached a terminal verdict (passed/failed/blocked) for
      this feature, OR an explicit "unverified + reason" is recorded in LOOP.md.
- [ ] If a test failed: was the failure bundle downloaded and root-caused before
      the fix? (Plan-quality failure vs product failure — see testsprite-verify §4a.)
- [ ] `git status --short` is clean of unintended generated files (lesson: never
      `git add -A` blindly; lesson: package-lock.json / dist/ / src/version.ts).

### 3. Release / deploy
- [ ] Live URL returns HTTP 200 (CLI tests in cloud, no localhost).
- [ ] No secrets / API keys / payment details staged (Brain/private stays gitignored).
- [ ] README + LOOP.md updated to reflect this iteration.

## Confidence scoring

Each issue found: assign 0–100.
- ≥80 → blocks the commit.
- <80 → advisory, noted but does not block.

## Verdict

Only commit when all ≥80 issues are resolved and the QA perspective is satisfied
(either a terminal TestSprite verdict OR an explicit unverified-with-reason).
