# Worked example, outbound

A single outbound message, checked against the `outbound` pack before it goes out.

## Files

- `message.json`, the message under test. `subject` and `body` carry two `{{mergeTokens}}` and `fields` resolves them. The body ends with a "Reply STOP to unsubscribe" line on purpose, since one of the rules requires an opt-out.
- `earn-autonomy.config.json`, the full production config for this pack. Three deterministic rules (`no-merge-token`, `opt-out-present`, `link-validity`) plus a four-dimension rubric (`personalization`, `on-voice`, `claim-grounding`, `icp-relevance`). Scoring the rubric needs `ANTHROPIC_API_KEY`.
- `example.test.ts`, a rules-only, key-free vitest test. It spawns the built CLI against `message.json` with a stripped-down copy of the config above (same two deterministic rules, empty rubric) so the check runs without a key, and asserts the verdict is `PASS`.

## Run it yourself

Rules only, no key required.

```bash
npm run build
node dist/core/cli/index.js check examples/outbound/message.json \
  --config examples/outbound/earn-autonomy.config.json \
  --pack outbound --json
```

That command includes the rubric from `earn-autonomy.config.json`, so set `ANTHROPIC_API_KEY` first or the run will fail closed to `BLOCK` on the scoring step. To check rules only without a key, copy the config and replace the rubric with an empty one, `"rubric": { "dimensions": [] }`, the way `example.test.ts` does. Omitting the `rubric` key entirely does not work for this, the outbound pack backfills its own default rubric when a config has none, which still needs a key.

## Why this message passes

- Both `{{firstName}}` and `{{company}}` resolve from `fields`, so `no-merge-token` finds nothing unresolved.
- The body ends with "Reply STOP to unsubscribe," which `opt-out-present` matches.
- There are no links in the message, so `link-validity` has nothing to check.

Change a field to blank, delete the opt-out line, or add a dead link, and the same config blocks it.
