# earn-autonomy

Eval-gated autonomy for AI agents. Deterministic rules, an LLM rubric, and a streak gate that decides when an agent has earned the right to run unattended.

## The problem

An agent that drafts content or sends outreach is easy to supervise once. It is much harder to supervise every time, forever, especially once it is running on its own schedule. Most teams solve this by either checking every single output by hand, which does not scale, or by trusting the agent by default, which is how a bad send reaches a real inbox. Neither is a real answer.

`earn-autonomy` treats unattended running as something an agent earns, not something it starts with. Every output is checked against rules and a rubric before it goes anywhere. Autonomy only unlocks once a config has strung together enough clean passes in a row, and one bad output resets that streak to zero.

## Install

```bash
npm install -g earn-autonomy
# or, without installing
npx earn-autonomy check <input> --config <path> [--pack content|outbound] [--runlog <path>] [--json]
```

## How a check runs

Every check runs through three layers.

**Rules.** Deterministic, fast, pure functions over the text. No network call, no ambiguity, no model in the loop. A merge token left unresolved or a missing opt-out line gets caught the same way a linter catches a syntax error.

**Rubric.** An LLM scores the output on named dimensions (voice match, personalization, claim grounding, whatever the config defines), each against its own threshold. This is where judgment calls live, the stuff a rule cannot decide. If scoring fails for any reason, no API key, a provider error, a timeout, the gate fails closed to `BLOCK`. A broken scorer never becomes a free pass.

**Gate.** Combines rule violations and any failed rubric dimensions into one verdict, `PASS` or `BLOCK`, with a full list of reasons. One rule violation is enough to block, same as one failed dimension.

## The three exit states

`earn-autonomy check` always ends in one of three states.

| State | Exit code | `--json` output |
|---|---|---|
| `BLOCK` | `1` | `status: "BLOCK"` |
| `PASS`, streak not long enough yet | `0` | `status: "PASS"`, `clearedForAutonomy: false` |
| `PASS`, streak has reached `gateN` | `0` | `status: "PASS"`, `clearedForAutonomy: true` |

A `BLOCK` is the only state that fails a CI job or a pre-send hook. Both `PASS` states exit `0`, since the content itself is fine either way. `clearedForAutonomy` is the separate signal that answers a different question, whether this config has earned the right to run without a human watching the output.

## Packs

A pack tells `earn-autonomy` how to turn an input file into checkable text, and which rules it can see.

**`content`.** Input is a raw text or markdown file. Ships `no-em-dash`, `no-body-colon`, `no-binary-corrective`, `banned-phrases`, and `link-validity`. Built for drafts headed toward a blog, a newsletter, or a social post.

**`outbound`.** Input is a JSON message (`to`, `subject`, `body`, optional `links`, and a `fields` map for personalization tokens). Merge tokens are resolved from `fields` before the text is checked, so a token whose field is missing or blank is left unresolved on purpose, blank personalization is the same failure as a broken merge. Ships `no-merge-token`, `opt-out-present`, and `link-validity`, plus a default rubric (`personalization`, `on-voice`, `claim-grounding`, `icp-relevance`).

Select a pack with `--pack content` or `--pack outbound`. `content` is the default.

## Rules are the floor

Deterministic rules cannot be overridden by rubric scores. One rule violation blocks the check no matter what the judge says about the rest of the content.

The rubric is an advisory quality layer. Like any LLM judge, it can be manipulated by adversarial content, a prompt buried in the text it is scoring, a claim that flatters the model, a request to rate everything a 10. `earn-autonomy` treats the rubric that way on purpose and never lets it outrank a rule.

Put compliance-critical checks in rules, an opt-out line that has to be present, a merge token that has to be resolved, a link that has to work. Use the rubric for quality dimensions where a fooled score costs you polish, voice match, personalization, tone, not compliance.

## Worked example, outbound

`examples/outbound/` has a full outbound message, a full config, and a test that runs the message through the built CLI and checks it passes. Start there to see a real input, a real config, and a real verdict end to end. `examples/outbound/README.md` walks through why the example passes and how to change it so it does not.

## GitHub Action

`action.yml` wraps the CLI as a composite action so a pull request can fail on `BLOCK` before anything merges or sends.

```yaml
# .github/workflows/eval.yml
name: eval
on: [pull_request]
jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: derrtaderr/earn-autonomy@v0
        with:
          input: drafts/message.json
          config: earn-autonomy.config.json
          pack: outbound
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

A full copy lives at `examples/ci/eval.yml`.

## Config identity and the streak reset

A config is JSON with rules, an optional rubric, and a `gateN`, the clean-run streak required before `clearedForAutonomy` can turn true.

```json
{
  "id": "outbound-cold-open",
  "rules": [{ "name": "no-merge-token" }, { "name": "opt-out-present" }],
  "rubric": { "dimensions": [{ "name": "on-voice", "threshold": 7 }] },
  "gateN": 5
}
```

Every run gets appended to a local run log keyed by the output's status, timestamp, and a config identity. If a config sets an explicit `id`, that id is the identity. If it does not, the identity is a hash of its rules, rubric, and `gateN`. Change a rule, tighten a threshold, or add a banned phrase, and the identity changes with it, which resets the streak to zero. A streak earned under yesterday's rules does not carry over to today's stricter ones.

## Fail-closed guarantees

Autonomy is a privilege the tool can only take away, never assume. A few guarantees hold regardless of pack or config.

- A scoring error of any kind, a missing key, a provider outage, a timeout, produces `BLOCK`, never a silent `PASS`.
- One rule violation blocks the whole check, even if every rubric dimension scores well.
- One `BLOCK` resets the clean-run streak to zero, no matter how long the prior streak was.
- Changing a config's rules, rubric, or `gateN` changes its identity, which starts the streak over rather than quietly inheriting an old one.

## What leaves your machine, what it costs

**Egress.** The rubric call sends the checked content to Anthropic under your own key. The link-validity rule sends HEAD requests to every URL found in the checked content, so poisoned input can make the tool ping URLs you did not choose. Enable it knowingly.

**The runlog is not content-free.** Reasons can quote fragments of checked content such as a bad URL or an unresolved token. It stays on your machine and is yours.

**Cost.** One model call per check when a rubric is configured, and there is no spend cap inside the tool. Set a budget limit in your Anthropic console. Rules-only configs cost nothing and need no key.

**Busy agents.** The runlog rewrites fully on each run. Past roughly ten thousand runs, rotate or delete it, the streak restarts conservatively.

## What v1 does not do

- No hosted service and no dashboard. It is a CLI and a library, run where the agent already runs.
- No database. The run log is a single local JSON file.
- No provider abstraction. Scoring goes through the Claude API only, via `@anthropic-ai/sdk`.
- No auto-remediation. `earn-autonomy` decides `PASS` or `BLOCK` and reports why. It does not rewrite the content and try again.

## License

MIT
