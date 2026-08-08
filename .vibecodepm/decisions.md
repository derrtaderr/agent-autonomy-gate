# Content Eval Gate — Decisions Log

## 2026-07-18 — flow (Phase 2 shaping)

- **D1 — Ruleset on the page:** fixed to Jason's voice rules + a read-only "view the rules" panel. Editable rules deferred.
- **D2 — LLM scoring on the public page:** OFF. Public page is deterministic-rules-only (free, instant, no abuse surface); LLM rubric is described, not run. Full rubric lives in the CLI/pipeline with the user's own key.
- **D3 — Streak on the web:** per-session demo + explainer; the real persisted streak lives in the CLI/pipeline.

Rationale for each is in `flow.md`. These lock the Phase 2 scope.

## 2026-07-19 — discovery (brandvoice generator idea)
- Ran discovery on the "guided brandvoice.md + enforcement-skills generator" (evolved eval-gate shape).
- CALL: KILL-OR-RESHAPE, leaning kill for a standalone build. Squeezed by three free/funded neighbors: Anthropic's own free brand-voice skill + write-time hook (Jason's exact thesis, shipped free), Vale (free local lint), Markup AI ($27.5M, hosted pipeline enforcement). Payers want hosted; indie/local buyer has low WTP + free options. No primary-source indie demand found.
- Recommendation (artifact = hiring proof + content, not a business): don't build the generator. Keep gtm-content-evals repo as the /lab hiring-proof entry; demonstrate governance via production work (Maestro eval, delivery-loop trust ladder); turn the exploration into content (the kill story). Awaiting Jason's final call.
- discovery.md written (status: draft).
- 2026-07-19 RESHAPE (Jason): not a product (confirmed), but NOT killed. Reposition as a proven internal production capability made available + hiring proof + content. Validation = JDs + AI-slop discourse + live client work (quantum_agents, revwisely_maestro grade every output vs brandvoice, grading shown to clients as verification). Substitute test is job+scale-specific: ChatGPT kills the one-off job, not systematic team-wide every-output enforcement. Next: showcase (public repo as open reference + Deep Dive on AI-slop governance + /lab entry), NOT a generator build. discovery.md status: accepted.
