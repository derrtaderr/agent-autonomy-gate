# Content Eval Gate — Flow Map

**Date:** 2026-07-18
**Requirements input:** the design spec at `life_os/docs/superpowers/specs/2026-07-17-content-eval-gate-design.md` stands in for prd.md.
**Purpose:** map the expected user experience before Phase 2 is built, so the build matches how people actually move through it. This is the contract ship-check / user-advocate verifies against.
**Focus:** Phase 2 (the `derr.ai/eval-gate` web surface) is the user-facing flow to get right. Phase 1 (CLI / library) flows are captured for completeness.

## Users

1. **Visitor-evaluator (PRIMARY for Phase 2)** — a recruiter, hiring manager, or CMO who lands on `derr.ai/eval-gate` from the Deep Dive, a LinkedIn post, or the portfolio. Non-technical. Wants to understand what it is and see it work in about ten seconds. If they bounce confused, the artifact failed its job.
2. **Content-ops marketer** — non-technical; might actually paste a draft to check it. Values a clear, actionable verdict.
3. **GTM engineer / builder** — technical; runs the CLI, imports the library, or wires the gate into a pipeline / CI / agent loop. Phase 1 surface.
4. **The agent (indirect)** — its output is what gets gated; it earns unattended-publish rights over N passing runs. Not a human flow, but the reason the gate exists.

## Entry points

- **Phase 2:** `derr.ai/eval-gate`, linked from the Friday Deep Dive, LinkedIn, and the portfolio/resume.
- **Phase 1:** `npx gtm-content-evals check <file> --config <config>` (CLI), `import` (library in a pipeline/agent), or a CI / pre-commit hook that runs it automatically.

## Happy path — Phase 2 web (the one that must be right)

1. Land on the page. Within one screen, the visitor understands what it does and sees an example.
2. A draft is already prefilled (or one click loads a sample), so a result appears with zero typing.
3. User pastes their own draft over the sample. The active ruleset is visible (Jason's voice rules by default).
4. Click Check.
5. Result renders fast: a PASS/BLOCK banner, each rule violation with the exact flagged snippet, dimension scores, and the gate/streak line.
6. User reads what to fix, edits, re-checks. Iterates.

## States (each needs a defined UX)

- **Initial / empty:** instruction plus a prefilled sample and a "try this" affordance, so the first result costs no effort.
- **Checking:** spinner or skeleton; re-submit disabled.
- **BLOCK, rule fail:** list each violation as rule + the offending snippet, phrased as a fix.
- **BLOCK, low score:** show the dimension, its score, and the threshold it missed.
- **PASS:** clear success; show the streak (N / gateN) with a one-line explainer of the autonomy-gate idea.
- **Error / fail closed:** a scoring failure shows a graceful "couldn't score, blocked to be safe" message with retry. Never a crash, never a silent pass.

## Recovery / error paths

- Scoring error → fail closed to BLOCK with a clear reason and a retry.
- Oversized paste → cap the length and say so.
- Rate / cost limit → a friendly limit message, not a stack trace.

## Decisions (locked 2026-07-18)

- **[D1] Ruleset on the page:** fixed to Jason's voice rules, with a read-only "view the rules" panel. Editable rules deferred to a later version.
- **[D2] LLM scoring on the public page:** OFF. The public page runs the deterministic rules only (instant, free, no abuse surface); the LLM rubric is described as what the full tool adds. The full rubric runs in the CLI/pipeline with the user's own key.
- **[D3] Streak on the web:** per-session demonstration plus a one-line explainer of the autonomy gate. The real persisted streak lives in the CLI/pipeline where an agent earns unattended-publish rights.

## Non-goals (Phase 2)

Accounts, saved history, team features. This is a legible demo and a light tool, not a SaaS.

## The contract

ship-check / user-advocate verifies the built Phase 2 against this map: a first-time non-technical visitor understands the page and gets a result within about ten to fifteen seconds, and every error state recovers gracefully.
