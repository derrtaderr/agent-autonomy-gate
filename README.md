# gtm-content-evals

An eval gate for AI-generated content. Deterministic rules, an LLM rubric, and an autonomy gate that won't let an agent publish unattended until it earns it.

## The problem

AI-generated content ships at volume now. Drafting is no longer the bottleneck, which means the failure mode moved downstream. Generic phrasing, off-voice constructions, and ungrounded claims reach the publish button because nothing upstream is checking for them. A human catches some of it by rereading, catches less of it on a Friday afternoon, and catches none of it once an agent is drafting and publishing on its own schedule.

This tool gates content the way tests gate a deploy. Content has to pass before it ships, checked against a working practice.

## How it works

Every check runs through three layers.

**Rules.** Deterministic, fast, and cheap. Each rule is a pure function over the text and returns a list of violations. No network call, no ambiguity, no model in the loop. Wrong phrasing gets caught the same way a linter catches a syntax error.

**Rubric.** An LLM scores the content on named dimensions (voice match, factual grounding, whatever the config defines) against a threshold per dimension. This is where judgment calls live, the stuff a regex can't decide. If scoring fails for any reason (no API key, provider error, network timeout) the gate fails closed to BLOCK. A broken scorer never becomes a free pass.

**Gate.** Combines rule violations and any failed rubric dimensions into one verdict, PASS or BLOCK, with a full list of reasons. One rule violation is enough to block, same as one failed dimension.

A single PASS doesn't mean an agent gets to publish unattended forever. That's what the autonomy gate is for. Every run gets appended to a local run log keyed by the content's status, timestamp, and a config identity. `clearedForAutonomy` checks whether the current streak of consecutive PASS runs under that config identity has reached the configured `gateN`. One BLOCK resets the streak to zero. An agent earns unattended publishing by stringing together N clean runs in a row, not by passing once.

Config identity matters here. If a config sets an explicit `id`, that id is the identity. If it doesn't, the identity is a hash of the rules, rubric, and gate threshold. Change a rule, add a banned phrase, tighten a threshold, and the identity changes with it, which resets the streak to zero. The gate you cleared under yesterday's rules doesn't carry over to today's stricter ones.

## Quickstart

```bash
npm install
npm run build
node dist/cli/index.js check examples/sample-draft.md --config examples/jason-voice.rules.json --runlog /tmp/eval-runs.json
```

`examples/sample-draft.md` is written to trip two rules on purpose, so a fresh run shows a real block instead of a quiet pass. With no `ANTHROPIC_API_KEY` set, the output looks like this.

```
VERDICT: BLOCK
  - [no-em-dash] Found 1 em dash(es). Use a period or comma.
  - [no-body-colon] Colon in body line: "Here is the truth: most teams still measure the wrong thing."
  - scoring failed (fail closed): ANTHROPIC_API_KEY not set
clean-run streak: 0/5
NOT cleared for autonomy
```

Set `ANTHROPIC_API_KEY` and the rubric layer scores the content too, adding a per-dimension score line and a real pass-or-fail read against those thresholds instead of the closed-fail scoring line. Exit code is `1` on BLOCK and `0` on PASS, so the check drops straight into a CI step or a pre-publish hook.

## Config reference

A config is JSON with this shape.

```ts
type Config = {
  id?: string;          // explicit identity, falls back to a hash of rules + rubric + gateN
  rules: RuleConfig[];   // { name: string; params?: unknown }[]
  rubric?: Rubric;       // { dimensions: { name: string; threshold: number }[] }
  gateN: number;         // clean-run streak required for autonomous publishing
};
```

Shipped rules, all pure functions over the raw text.

- `no-em-dash`. Flags any em dash in the content.
- `no-body-colon`. Flags a colon outside markdown headers, skipping URLs and time stamps like `12:30`.
- `no-binary-corrective`. Flags the comma-form binary corrective, a setup clause that negates one option followed by a comma-delimited clause that asserts another in its place. Curly and straight apostrophes are normalized before matching, so either form of the construction gets caught.
- `banned-phrases`. Flags any phrase in a configured list, case-insensitive. Takes a `phrases` array of strings as params.
- `link-validity`. Resolves every URL in the content with a HEAD request and flags anything that doesn't come back OK.

The rubric section is optional. Skip it and the gate runs on rules alone. Include it and every dimension needs a score at or above its threshold or the gate blocks.

## Known limitations

`no-binary-corrective` catches the common comma form and normalizes curly apostrophes before matching. The split-sentence form, two separate sentences instead of a comma joining them, still gets through today.

`no-body-colon` isn't markdown-aware. A colon inside a fenced code block can still trip it, since the rule scans body lines without checking for fence boundaries.

The run log is a single local JSON file with a non-atomic append (read the whole file, push a record, write the whole file back). That's fine for one user running checks locally. Two processes writing to the same run log at once can lose a record.

## Dogfood note

This repo ships configured with the author's own voice rules in `examples/jason-voice.rules.json`, the same file that produces the block above. Swap it for your own rules, your own banned phrases, your own rubric dimensions. The gate doesn't care whose voice it's enforcing, only that the content earns its pass.
