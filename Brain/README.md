---
name: brain-readme
description: "AI-assisted Distributed Project Memory System — how to use Brain"
last_updated: "2026-06-22"
related_modules:
  - index
status: active
---

# Brain — AI-Assisted Distributed Project Memory System

## What Is This?

Brain is the AI-assisted Distributed Project Memory System for this workspace.

It is an architecture where the AI does not depend on the whole project context living inside chat history. Instead, project knowledge is split into focused external memory modules stored on the file system. Each module is a `.md` file, and all modules live under `Brain/`.

`Brain/` is the single source of truth for project state. Chat is only the working surface.

## Why?

- **Avoid context limits** — each module is small enough to read fully
- **Eliminate chat history dependency** — work survives session boundaries
- **Resume from zero** — any AI session reads Brain and knows everything
- **Maintain consistency** — single source of truth for all project state
- **Think like an engineer** — structured data, not chat fluff

## Memory Layers

The system works by splitting AI memory into layers:

| Layer | File(s) | Purpose |
|-------|---------|---------|
| Entry point | `index.md` | Current truth, active focus, and where to read next |
| Execution | `tasks.md` | What to do now, blockers, and resume checklist |
| Money truth | `revenue.md`, `bounties.md` | Revenue, PRs, payout status, bounty risk |
| Decisions | `decisions.md` | Why major choices were made |
| Lessons | `lessons.md` | Mistakes to avoid and proven patterns |
| Context | `project-context.md`, `technical.md` | Project definition, stack, tools, repo layout |
| Detail ledgers | `../docs/*.md`, `../*.csv` | Long logs, trackers, and evidence |

Every substantial work session must update the affected memory layer before ending.

## How to Use

### For AI Sessions

```
1. Read Brain/index.md         → understand current state
2. Read Brain/tasks.md         → know what to do now
3. Read relevant module(s)     → deep-dive into task area
4. Check Brain/decisions.md    → before making new decisions
5. Check Brain/lessons.md      → before repeating known mistakes
6. After work, update Brain    → keep it current
```

Rules:

- Do not rely on chat history for project truth.
- Read `Brain/index.md` and `Brain/tasks.md` before resuming work.
- Update the relevant module after changing PR status, revenue status, bounty status, SOP, tools, or decisions.
- Do not mark revenue as confirmed unless payment is actually received.
- If external status is checked live, record the date, source, and result.

### For Humans

Open `Brain/index.md` in any markdown reader. It links to everything.

## Module Map

| Module | File | Purpose |
|--------|------|---------|
| Index | `index.md` | Dashboard — read first |
| Identity | `identity.md` | Who is the operator |
| Project | `project-context.md` | What is this project |
| Revenue | `revenue.md` | Financial tracking |
| Agency | `agency.md` | Outreach pipeline |
| Bounties | `bounties.md` | Bounty program status |
| Technical | `technical.md` | Tools and stack |
| Tasks | `tasks.md` | Active work items |
| Decisions | `decisions.md` | Key decisions + rationale |
| Lessons | `lessons.md` | Mistakes to avoid |

## Maintenance

- Update `last_updated` in frontmatter when editing any module
- Update `index.md` quick status when state changes
- Keep modules under 200 lines
- Cross-reference with `[module](./module.md)` links
- Keep long evidence in `docs/` or CSV trackers, then summarize it in Brain
