---
name: project-context
description: "What is QuickOps AI, its goals, current status, team structure, and repo layout"
last_updated: "2026-06-22"
related_modules:
  - identity
  - revenue
  - technical
  - tasks
status: active
---

# Project Context

## Definition

**QuickOps AI** — Micro AI Operations Agency. Goal: first USD 100 revenue without ad spend, physical products, or paid subscriptions. Working name for the zero-to-100 agency kit.

## Revenue Model — Three Lanes

| Lane | Description | Status |
|------|------------|--------|
| A | Agency services (lead capture, website fix, content repurpose) | PAUSED |
| B | Bug bounty / security research | Active scanning |
| C | Open-source bounty PRs | **Primary focus** |

## Current Status (2026-06-22)

- **Agency:** 50+ emails sent, few replies, paused per user request
- **Bounties:** $150 live-verifiable potential from Frailbox PR #15 only; not revenue until paid
- **Revenue Scout:** 76 opportunities found, 4 outreach sent
- **Confirmed Payments:** $0
- **Historical:** $2,500 HackerOne earnings (proof available as PDF)

## Team

Solo operator. AI assistant handles drafting, scripting, research, automation, and Brain maintenance.

## Project Memory System

`Brain/` is the AI-assisted Distributed Project Memory System and single source of truth for this workspace. The AI must read `Brain/index.md` and `Brain/tasks.md` to resume from zero, then update the relevant modules after meaningful status changes.

## Repo Layout

```
zero-to-100-agency/
├── Brain/                  # This memory system
├── scripts/                # 25+ Python automation scripts
├── email_queue/            # 12+ .eml templates
├── docs/                   # Operational docs, revenue logs
├── bounty-program/         # External bounty program docs
├── bug_bounty_findings/    # Security findings
├── logs/                   # Sent email logs
├── bounty_program_tracker.csv
├── lead_tracker.csv
├── full_auto_revenue_scout.csv
├── README.md               # Project methodology
└── automation_scheduler.md # Automation config
```

## External Assets

- GitHub Pages: https://aldorizona10-glitch.github.io/quickops-ai/
- YouTube repo (separate): /mnt/c/Users/user/quickops-youtube-lab

## Public Pages

Home | Landing/Services | Start ($100 pilot) | Security Audit | Profile
