# HelloFresh Retention — Phase 3 Prototypes

**Hello PM · Batch 51 · George Innasi · June 2026**

Interactive prototype concepts built for the HelloFresh retention assignment (Phase 3 — Diverge → Converge → Build).

### ▶ Live gallery (click to open prototypes)

**https://george-innasi.github.io/hellofresh-project-assignment/**

## What we're trying to achieve

**Phase 2 goal:** Improve retention among existing HelloFresh subscribers.

**P0 problem:** Existing subscribers struggle to keep feeling the per-serving price is worth paying week after week, because perceived value erodes as ingredient quality quietly declines and the price gap versus groceries widens with every increase. This leads to more frequent skipping, gaming the cancel-and-resubscribe cycle, and silent churn of the highest-value, long-tenured cohort.

**P0 solution:** **Food Quality Feedback** — a structured, per-ingredient reporting mechanism. When a meal misses the mark, the subscriber reports which ingredient fell short and what was wrong, traced to the supplier batch. It replaces vague support tickets with clear, ground-truth quality signal. (An automatic credit is deferred to a future phase that requires a financial model and user-submitted proof.)

## Prototypes

Each prototype explores one solution from the Phase 3 brainstorm, mapped to a root cause of the P0.

| # | Prototype | Live link | Root cause |
|---|-----------|-----------|-----------|
| 04 | **Food Quality Feedback (P0)** | [open](https://george-innasi.github.io/hellofresh-project-assignment/view-04-ingredient-quality-feedback.html) | RC1: quality declines, unverifiable by the subscriber |
| 01 | Value Transparency Dashboard | [open](https://george-innasi.github.io/hellofresh-project-assignment/view-01-value-transparency-dashboard.html) | RC3: accumulated value is invisible |
| 02 | Predictive Retention Outreach (Basil) | [open](https://george-innasi.github.io/hellofresh-project-assignment/view-02-predictive-retention-outreach.html) | RC5: the weekly skip decision repeats with no intervention |
| 03 | Tenure Milestone Rewards | [open](https://george-innasi.github.io/hellofresh-project-assignment/view-03-tenure-milestone-rewards.html) | RC4: long-tenure subscribers feel unrecognised vs. new customers |

## Stack

React, single-file `.jsx` components (inline styles + SVG). The `view-*.html` pages render each component live via React + Babel from a CDN, so they open directly in a browser with no build step.

## Related documents

- **PRD:** Food Quality Feedback (the P0 solution)
- **Phase 3 working doc (Steps 1–5):** Brainstorm, Prioritization (RICE), Prototype links, Success Metrics, Pitfalls & Mitigations
