import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pexec = promisify(execFile);
const CLI = new URL('../../dist/core/cli/index.js', import.meta.url).pathname;
const MSG = new URL('./message.json', import.meta.url).pathname;

describe('outbound worked example', () => {
  it('passes the deterministic rules (resolved tokens + opt-out line present)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'earn-autonomy-ex-'));
    // Rules-only subset of earn-autonomy.config.json (drops the rubric) so this
    // test needs no ANTHROPIC_API_KEY. The full config, rubric included, is
    // examples/outbound/earn-autonomy.config.json. An empty rubric.dimensions
    // array must be explicit here: the outbound pack has a defaultRubric that
    // the CLI applies whenever a config omits `rubric` entirely, which would
    // otherwise force a scoring call (and a key) even for this key-free config.
    const cfg = join(dir, 'c.json');
    await writeFile(cfg, JSON.stringify({
      rules: [{ name: 'no-merge-token' }, { name: 'opt-out-present' }],
      rubric: { dimensions: [] },
      gateN: 5,
    }));
    const { stdout } = await pexec('node', [CLI, 'check', MSG, '--config', cfg, '--pack', 'outbound', '--runlog', join(dir, 'r.json'), '--json']);
    expect(JSON.parse(stdout).status).toBe('PASS');
  });
});
