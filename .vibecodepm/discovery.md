---
date: 2026-07-19
status: accepted
phase: discovery
---

```yaml
goal: eval-first content governance as Jason's hiring proof + content, not a business
user: high-volume technical content-agent operator who runs their own agents (Jason = user #1)
phase: discovery
critical_assumption: the differentiator is systematic team-wide every-output grading with client-facing verification, not a one-off linter; the substitute test only kills the one-off/manual job, not this one
decision: RESHAPE (Jason confirmed 2026-07-19) — kill the product/business play; reposition as a proven internal production capability made available, plus hiring proof and content. Do NOT build a generator; showcase what already exists.
hard_gate: the showcase foregrounds the systematic / team-wide / every-output / client-verified angle, not the paste-a-draft linter (else it reads as the free Anthropic me-too)
success_window: a Deep Dive + /lab entry that lands the AI-slop-governance angle, anchored in the live client production (quantum_agents, revwisely_maestro)
```

# Discovery: guided brandvoice.md + enforcement-skills generator

## The idea
A guided CLI / generator that builds a personalized `brandvoice.md` plus accompanying skills that ENFORCE that voice (deterministic lint + an LLM rubric gate), run locally on the user's own machine and API key. "create-next-app for a brand-voice eval system." This is the evolved shape of the eval gate (linter → governance → skill pack → generator).

## The problem and who has it
The pain is real: AI-generated content drifts off brand voice cumulatively at scale, and it is worst for high-volume, technical content-agent operators running unattended output. The sharpest evidence is paying customers of the category leaders complaining the tools they already buy do not fix it. The acute segment is narrow (high volume + technical + runs their own agents). Jason is user #1, which is good for dogfooding and risky as n=1. **Jason's own acute-pain answer and a named second user were not confirmed before this call.**

## What they do today (the substitute)
Strong and mostly free: ChatGPT / Claude custom instructions and Custom GPTs (the dominant free default), manual editing (58% edit AI output before publishing), Notion/Doc style guides pasted into prompts, and **Vale** (free MIT local prose linter with git-hook/CI integration) for the deterministic half. Grammarly for lightweight tone.

## Demand signals

| # | Claim | Source | Date | Type | Confidence | Quote / observation |
|---|---|---|---|---|---|---|
| 1 | AI content drifts off voice cumulatively at scale | Opencraft AI | 2025-26 | vendor blog | med | "January and April content can sound like different brands when nobody is checking" |
| 2 | Paying Jasper customers hit drift | eesel AI (quoting Trustpilot) | 2026 | review agg | med-high | "The Brand Voice does NOT carry through, it reverts back to AI speak" |
| 3 | Writer voice profiles don't continuously enforce | eesel AI | 2026 | review agg | med | "starting instructions, not continuous reinforcement" |
| 4 | ChatGPT/Custom GPTs are the free substitute | aitoolscapital | 2026 | listicle | med | "Custom GPTs let you bake your brand voice into reusable assistants" |
| 5 | Vale = free local own-your-rules prose linter | vale.sh | 2026 | product | high | "the precision of a code linter to prose... editor, Git hooks, CI" |
| 6 | Vale cannot judge tone/voice nuance | Vale docs / PostHog | 2026 | docs | med-high | "cannot evaluate whether prose has the right emotional tone or brand voice" |
| 7 | Markup AI = API-first, MCP-powered pipeline enforcement, $27.5M raised | Markup AI / BusinessWire | 2025 | vendor / press | high | "integrate into Cursor, Figma, ChatGPT, Github Actions, Zapier"; "$27.5M... Content Guardian Agents" |
| 8 | Anthropic ships a brand-voice skill + write-time hook on this exact thesis, free | anthropics/knowledge-work-plugins SKILL.md | 2025-26 | repo | high | "deterministic enforcement at write time beats probabilistic instructions at session start alone" |
| 9 | Indie voice-enforcement skills exist, ~zero adoption | entpnomad/tone-of-voice | 2026 | repo | high | "learns your voice... enforces it" — 0 stars/forks |
| 10 | No primary-source indie demand surfaced | WebSearch site:reddit queries | 2026-07 | negative finding | med | "No links found" across r/marketing, r/agency |
| 11 | Payers want HOSTED governance (SOC2/audit), not local | Writer.com pricing + Markup AI positioning | 2026 | pricing/positioning | med-high | $29-39/seat to $10K-500K/yr enterprise; funded around hosted API-first |

## Competitor sniff
- **Anthropic's own `knowledge-work-plugins` brand-voice plugin** — a `brand-voice-enforcement` skill + a PostToolUse write-time hook, built on Jason's exact thesis. Free, platform-owner-distributed. This is the biggest threat: it is the idea, shipped free.
- **Vale** — owns "local, own-your-rules, deterministic" completely (free, MIT). Gap: cannot judge tone/voice nuance (no LLM rubric).
- **Markup AI** ($27.5M) — owns "API-first, wire-into-your-pipeline enforcement" (hosted, token-metered). Gap: hosted, their models.

The genuinely open seam is the *intersection*: local + own-config + **LLM rubric gate** (the part Vale can't do) + agent-skill-native. Real, but a seam, not a field. And squeezed on three sides by free/funded neighbors.

## Kill / go call
**KILL-OR-RESHAPE (leaning kill for a standalone build).** The pain is real but the shape is wrong for the payers: enterprise buyers who pay want hosted governance (the opposite of local BYO-key), the indie/local buyer has low WTP and is already served free by Vale and Anthropic's own hook, and the differentiated sliver (an own-key LLM rubric gate) is a feature-shaped wedge, not a business. No primary-source indie demand was found, only vendor-attested pain and enterprise (hosted) WTP.

**Recommendation for Jason's actual goal (hiring proof + content, not a business):** do not build the generator. The eval-first/governance capability is already demonstrated by the existing `gtm-content-evals` repo (public) plus the production work (Maestro eval framework, delivery-loop trust ladder), which is stronger and unfakeable. Building a me-too of Anthropic's free plugin is a weak artifact. Turn the exploration into content instead (the kill story is a strong field-report), keep the repo as the `/lab` hiring-proof entry, and stop.

## Interview kit (only if pursuing the reshape)
**Who:** operators running AI/agent content production at volume who run their own agents (not hosted-tool buyers). Find them in Claude Code / AI-agent builder communities, indie-hacker content-automation circles, and among people already using Vale or the Anthropic brand-voice plugin.

**Five past-behavior questions:**
1. Walk me through the last time AI content shipped off-voice. What happened, and what did you do after?
2. What are you using today to keep agent output on voice? Custom instructions, Vale, a hosted tool, manual review?
3. Have you tried enforcing voice at write time (a hook, a lint, a gate)? What made you keep or drop it?
4. When did you last pay for, or seriously consider paying for, a voice/QA tool? What tipped it?
5. Would you put your voice config and API key in someone else's SaaS, or does that matter to you? Tell me about a time it did.

Kill if the answers are shrugs. Reshape around **"eval-gate-on-your-own-key" (the LLM rubric Vale can't do)** only if operators name it unprompted as the missing piece.

## Reshape (Jason confirmed, 2026-07-19)

The product analysis above stands: not a business, squeezed by free/funded neighbors. But that analysis judged the wrong thing. This was never a product. Jason repositions it as **a proven internal production capability, made available** ("this is how I keep brand voice across all content, use it if you want"), which is hiring proof and content, not a thing to sell.

Three corrections to the product-framed call:
- **Validation is not product WTP.** It is JDs hiring for this capability, the loud AI-slop discourse (e.g. a "incoming: AI slop on graph engineering" comment with thousands of likes), and live client work.
- **The substitute test is job-AND-scale-specific.** "ChatGPT can do it" kills the one-off, single-draft, single-person job. It does NOT kill systematic, team-wide, every-output enforcement with client-facing grading. Different job, no real substitute.
- **It already runs in production.** In `quantum_agents` and `revwisely_maestro`, every output is graded against the brand voice and the grading is presented to clients as verification that content is on brand. This is not a build to start; it is a proven capability to package and show.

**Reshaped decision:** do NOT build a generator. Showcase what exists. The public `gtm-content-evals` repo is the open reference implementation; the client production work is the proof; a Deep Dive anchored in the AI-slop concern is the content; a `/lab` entry is the home. Guardrail: the showcase must lead with the systematic / team-wide / client-verified angle, not "paste a draft, check em dashes," or it reads as the free Anthropic me-too.
