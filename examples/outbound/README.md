# Worked example, outbound

A single outbound message, checked against the `outbound` pack before it goes out.

If you copied this folder out of `node_modules`, you are in the right place, keep going below. If you have not copied it out yet, do that first. This folder lives inside the installed `earn-autonomy` package, and running build tooling in place there will break your install.

```bash
# from the package root, local install
cp -r "$(npm root)/earn-autonomy/examples/outbound" .

# from the package root, global install
cp -r "$(npm root -g)/earn-autonomy/examples/outbound" .
```

`cd` into your copy before running anything below.

## Files

- `message.json`, the message under test. `subject` and `body` carry two `{{mergeTokens}}` and `fields` resolves them. The body ends with a "Reply STOP to unsubscribe" line on purpose, since one of the rules requires an opt-out.
- `earn-autonomy.config.json`, the full production config for this pack. Three deterministic rules (`no-merge-token`, `opt-out-present`, `link-validity`) plus a four-dimension rubric (`personalization`, `on-voice`, `claim-grounding`, `icp-relevance`). Scoring the rubric needs `ANTHROPIC_API_KEY`.
- `example.test.ts`, a rules-only, key-free vitest test that lives in the repo. It is not part of the installed package, and does not run from your copy.

## Run it yourself

Using the installed CLI, from your copy of this folder.

```bash
earn-autonomy check message.json --config earn-autonomy.config.json --pack outbound --json
# or, without installing
npx earn-autonomy@0 check message.json --config earn-autonomy.config.json --pack outbound --json
```

That command includes the rubric from `earn-autonomy.config.json`, so set `ANTHROPIC_API_KEY` first or the run will fail closed to `BLOCK` on the scoring step. To check rules only without a key, copy the config and replace the rubric with an empty one, `"rubric": { "dimensions": [] }`. Omitting the `rubric` key entirely does not work for this, the outbound pack backfills its own default rubric when a config has none, which still needs a key.

## Why this message passes

- Both `{{firstName}}` and `{{company}}` resolve from `fields`, so `no-merge-token` finds nothing unresolved.
- The body ends with "Reply STOP to unsubscribe," which `opt-out-present` matches.
- There are no links in the message, so `link-validity` has nothing to check.

Change a field to blank, delete the opt-out line, or add a dead link, and the same config blocks it.

## Working from a clone of the repo instead

If you cloned `earn-autonomy` itself rather than installing it, see the repo's main `README.md` for the build and test commands. Nothing in this file needs a build step.
