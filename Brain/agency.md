---
name: agency
description: "Agency outreach pipeline, client tracking, email templates, and delivery process"
last_updated: "2026-06-21"
related_modules:
  - revenue
  - identity
  - tasks
status: paused
---

# Agency Operations

## Current Status

**PAUSED** — User directive 2026-06-20: skip agency work, focus on non-agency revenue.

## Service Packages (USD 100 each)

| Package | Description |
|---------|------------|
| Lead Capture Cleanup | Clean up lead capture forms, fix broken flows |
| Website Trust Fix | Add trust signals, fix conversion blockers |
| Content Repurpose Sprint | Repurpose existing content for new channels |

**Upsell:** $50/workflow, $150-300 chatbot/automation, $100/mo maintenance

## Outreach Pipeline

- 50+ emails sent total
- Contacts tracked in `lead_tracker.csv` (19 entries)
- Sent log: `logs/gmail_api_sent_log.csv`
- Reply tracking: `daily_action_tracker.csv`

## Email Templates

- 12+ .eml files in `email_queue/`
- Pattern: source context → specific problem → fixed offer → boundary → proof links → clear next action
- Template structure from `docs/professional_outreach_funnel.md`

## Delivery Process

10-step checklist from `delivery_kit.md`:
1. Intake questions
2. Default pipeline: New → Contacted → Waiting → Won/Lost
3. Follow-up templates (first reply, reminder, closing)
4. Handover message
5. Upsell template

## Automation

- Send: `scripts/gmail_api_send_queue.py`
- Status: `scripts/agency_command_center.py`
- Pipeline: `scripts/agency_pipeline_status.py`
- One-shot: `scripts/autopilot_run_once.py`

## When to Resume

Criteria: User explicitly re-enables agency outreach. Check [decisions.md](./decisions.md) for skip decision context.
