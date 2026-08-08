#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import type { LLMProvider } from '../types.js';
import { parseConfig, configIdentity } from '../config/index.js';
import { getPack } from '../../packs/index.js';
import { makeClaudeProvider } from '../scoring/claude-provider.js';
import { evaluate } from '../evaluate.js';
import { appendRun, readRuns, computeStreak } from '../runlog/index.js';
import { renderVerdict } from './render.js';

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const cmd = process.argv[2];
  const file = process.argv[3];
  if (cmd !== 'check' || !file) {
    console.error('Usage: gtm-content-evals check <file> --config <path> [--runlog <path>]');
    process.exit(2);
  }
  const configPath = arg('--config');
  if (!configPath) { console.error('Missing --config'); process.exit(2); }
  const runlogPath = arg('--runlog') ?? '.eval-runs.json';

  const content = await readFile(file, 'utf8');
  const config = parseConfig(JSON.parse(await readFile(configPath, 'utf8')));
  const registry = getPack('content').registry;

  const key = process.env.ANTHROPIC_API_KEY;
  const provider: LLMProvider = key
    ? makeClaudeProvider(key)
    : async () => { throw new Error('ANTHROPIC_API_KEY not set'); };

  const verdict = await evaluate(content, config, { registry, provider });
  const configId = configIdentity(config);
  await appendRun(runlogPath, {
    timestamp: new Date().toISOString(),
    configId,
    status: verdict.status,
    reasons: verdict.reasons,
  });
  const streak = computeStreak(await readRuns(runlogPath), configId);
  console.log(renderVerdict(verdict, streak, config.gateN));
  process.exit(verdict.status === 'BLOCK' ? 1 : 0);
}

main().catch((e) => { console.error(e.message); process.exit(2); });
