---
name: technical
description: "Tech stack, automation scripts, tools, environment, and repo structure"
last_updated: "2026-06-21"
related_modules:
  - project-context
  - agency
  - tasks
status: active
---

# Technical Stack

## Environment

- **OS:** WSL2 Linux on Windows
- **Python 3** — primary automation language
- **Node.js** — available for JS scripts
- **GHC/Cabal/Stack** — Haskell work
- **.NET SDK 8.0** — F# work
- **Rust/Cargo** — available locally under /tmp
- **Java** — available for compliance tools
- **Perl** — available for log watchdog
- **Terraform** — available for import tools

## Key Automation Scripts

| Script | Purpose |
|--------|---------|
| `autopilot_run_once.py` | One-shot check (replies + status) |
| `full_auto_revenue_scout.py` | Scout HN/GitHub for opportunities |
| `fast_nonduplicate_revenue_scout.py` | Fast scout with dedup |
| `gmail_api_send_queue.py` | Send allowlisted emails via Gmail API |
| `gmail_check_replies.py` | Check Gmail for replies |
| `non_agency_status.py` | Bounty status checker |
| `agency_command_center.py` | Agency overview |
| `agency_pipeline_status.py` | Pipeline structured view |
| `automation_doctor.py` | Audit tool/gap coverage |

## Gmail Integration

- OAuth-based, HTTPS only (SMTP blocked in WSL)
- Required scope: `gmail.send`
- Token via `GMAIL_ACCESS_TOKEN` env var
- Safety: allowlist-only recipients, confirmation required

## Tracking Files

| File | Purpose |
|------|---------|
| `bounty_program_tracker.csv` | Bounty submissions |
| `lead_tracker.csv` | Agency leads |
| `bug_bounty_daily_log.csv` | Bug bounty research log |
| `daily_action_tracker.csv` | Daily action tracking |
| `full_auto_revenue_scout.csv` | Revenue scout opportunities |
| `logs/gmail_api_sent_log.csv` | Sent email log |

## Key Docs

- `docs/professional_revenue_operating_standard.md` — operating rules
- `docs/professional_outreach_funnel.md` — email structure
- `delivery_kit.md` — delivery checklist
- `tools.md` — free tool stack
- `full_automation_mode.md` — automation config

## Security Tools

- Edge CDP scripts for browser automation
- HackerOne asset check script
- Passive DNS takeover checkers (Airbnb, Newegg)
