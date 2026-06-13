# HelloFresh Retention — Phase 3 Prototypes

**Hello PM · Batch 51 · George Innasi · June 2026**

Interactive prototype concepts built for the HelloFresh retention assignment (Phase 3 — Diverge → Converge → Build).

## What we're trying to achieve

**Phase 2 goal:** Improve retention among existing HelloFresh subscribers.

**P0 problem:** Existing subscribers struggle to keep feeling the per-serving price is worth paying week after week, because perceived value erodes as ingredient quality quietly declines and the price gap versus groceries widens with every increase. This leads to more frequent skipping, gaming the cancel-and-resubscribe cycle for new-customer pricing, and eventually silent churn of the highest-LTV cohort — the long-tenured subscribers who are most profitable to retain.

**P0 solution (PRD):** Ingredient Quality Score per Delivery + Auto-Credit Quality Guarantee — make quality *provable* rather than claimed, and turn the moment quality fails into a trust signal instead of a trust break.

## Prototypes

Each prototype explores one solution from the Phase 3 brainstorm, mapped to a root cause of the P0.

| # | Prototype | Solution | Root cause |
|---|-----------|----------|-----------|
| 01 | `01-value-transparency-dashboard.jsx` | Value Transparency Dashboard — surfaces the value a subscriber has accumulated over time | RC3: accumulated value is invisible |
| 02 | `02-predictive-retention-outreach.jsx` | Predictive Retention Outreach (Basil assistant) — proactively reaches disengaging subscribers before they churn | RC5: the weekly skip decision repeats with no intervention |
| 03 | `03-tenure-milestone-rewards.jsx` | Tenure Milestone Rewards & Anniversary — recognises long-tenured subscribers | RC4: long-tenure subscribers feel unrecognised vs. new customers |
| 04 | `04-ingredient-quality-feedback.jsx` | Ingredient Quality Feedback — lets subscribers report which ingredients were bad, traced to the supplier; the user-facing "Report an issue" companion to the Ingredient Quality Score + Auto-Credit P0 | RC1: quality quietly declines, unverifiable by the subscriber |

## Stack

React, single-file `.jsx` components (inline styles + SVG). Each file default-exports one component and can be dropped into any React sandbox (e.g. a Vite app) to run.

## Related documents

- **PRD:** Ingredient Quality Score + Auto-Credit Quality Guarantee
- **Phase 3 working doc:** Brainstorm, Prioritization (RICE), Success Metrics, Pitfalls & Mitigations
