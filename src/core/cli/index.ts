#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import type { LLMProvider, Config } from '../types.js';
import { parseConfig, configIdentity } from '../config/index.js';
import { makeClaudeProvider } from '../scoring/claude-provider.js';
import { evaluate } from '../evaluate.js';
import { appendRun, readRuns, computeStreak, clearedForAutonomy } from '../runlog/index.js';
import { renderVerdict } from './render.js';
import { getPack } from '../../packs/index.js';

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(flag: string): boolean { return process.argv.includes(flag); }

async function readTextFriendly(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  } catch (e: any) {
    if (e && e.code === 'ENOENT') {
      console.error(`Cannot read ${path}. Check the path.`);
      process.exit(2);
    }
    throw e;
  }
}

function parseJsonFriendly(raw: string, path: string): any {
  try {
    return JSON.parse(raw);
  } catch (e: any) {
    console.error(`Invalid JSON in ${path}: ${e.message}`);
    process.exit(2);
  }
}

async function printVersion(): Promise<void> {
  const pkgUrl = new URL('../../../package.json', import.meta.url);
  const pkg = JSON.parse(await readFile(pkgUrl, 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

async function main() {
  if (has('--version') || has('-v')) {
    await printVersion();
    return;
  }

  const cmd = process.argv[2];
  const file = process.argv[3];
  if (cmd !== 'check' || !file || file.startsWith('--')) {
    console.error('Usage: earn-autonomy check <input> --config <path> --pack <content|outbound> [--runlog <path>] [--json]');
    process.exit(2);
  }
  const configPath = arg('--config');
  if (!configPath) { console.error('Missing --config'); process.exit(2); }
  const packId = arg('--pack');
  if (!packId) { console.error('Missing --pack. Available: content, outbound'); process.exit(2); }
  const runlogPath = arg('--runlog') ?? '.eval-runs.json';
  const asJson = has('--json');

  const pack = getPack(packId);
  const raw = await readTextFriendly(file);
  const input = pack.inputKind === 'text' ? raw : parseJsonFriendly(raw, file);
  const text = pack.prepare(input);

  const configRaw = await readTextFriendly(configPath);
  const config: Config = parseConfig(parseJsonFriendly(configRaw, configPath));
  if (!config.rubric && pack.defaultRubric) config.rubric = pack.defaultRubric;

  const key = process.env.ANTHROPIC_API_KEY;
  const provider: LLMProvider = key
    ? makeClaudeProvider(key)
    : async () => { throw new Error('ANTHROPIC_API_KEY not set'); };

  const verdict = await evaluate(text, config, { registry: pack.registry, provider });
  const configId = configIdentity(config);
  await appendRun(runlogPath, {
    timestamp: new Date().toISOString(),
    configId,
    status: verdict.status,
    reasons: verdict.reasons,
  });
  const streak = computeStreak(await readRuns(runlogPath), configId);
  const cleared = verdict.status === 'PASS' && clearedForAutonomy(streak, config.gateN);

  if (asJson) {
    console.log(JSON.stringify({
      status: verdict.status,
      reasons: verdict.reasons,
      streak,
      gateN: config.gateN,
      clearedForAutonomy: cleared,
      runlog: runlogPath,
    }, null, 2));
  } else {
    console.log(renderVerdict(verdict, streak, config.gateN, runlogPath));
  }
  process.exit(verdict.status === 'BLOCK' ? 1 : 0);
}

main().catch((e) => { console.error(e.message); process.exit(2); });
