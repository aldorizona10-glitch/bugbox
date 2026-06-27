---
name: frontend_design_principles
description: "Distilled design principles adopted from anthropics/skills frontend-design for any UI work in this ferment"
last_updated: "2026-06-27"
related_modules:
  - integrations
status: active
---

# Frontend Design Principles

Adopted from `vendor/skills-repo/skills/frontend-design/SKILL.md`. Any frontend
work in the TestSprite project MUST follow these.

## Ground it in the subject
Pin down one concrete subject, its audience, and the page's single job before
designing. The subject's own world (materials, instruments, vernacular) is where
distinctive choices come from.

## The hero is a thesis
Open with the most characteristic thing in the subject's world: a headline,
image, animation, or interactive moment. Not a templated "big number + gradient."

## Typography carries personality
Pair display + body faces deliberately — not the same families you'd reach for on
any other project. Set a clear type scale. Type treatment is memorable, not a
neutral delivery vehicle.

## Structure is information
Numbered markers / dividers / eyebrows encode something true about content, not
decoration. Numbered (01/02/03) only if the content is actually a sequence.

## Anti-template checklist
Reject the three default AI looks unless the brief explicitly calls for one:
1. Warm cream background (#F4F1EA) + high-contrast serif + terracotta accent.
2. Near-black background + single acid-green/vermilion accent.
3. Broadsheet layout + hairline rules + zero border-radius + dense columns.

## Spend boldness in one place
One signature element. Everything around it quiet and disciplined. Cut decoration
that doesn't serve the brief. Chanel: before leaving, remove one accessory.

## Quality floor (no announcement)
- Responsive down to mobile.
- Visible keyboard focus.
- `prefers-reduced-motion` respected.

## Naming (controls + copy)
- Name by what the user does, not how the system is built ("Save changes", not
  "Submit"; "Manage notifications", not "Webhook config").
- Active voice. Same vocabulary through the whole flow (Publish → "Published").
- Empty states are invitations to act, not mood. Errors explain what + how to fix.

## Restraint + self-critique
Critique as you build (screenshots if possible). Don't take a risk in every
section — sometimes restraint is the risk that pays off.
