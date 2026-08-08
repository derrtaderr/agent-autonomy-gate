import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pexec = promisify(execFile);
const CLI = new URL('../../dist/core/cli/index.js', import.meta.url).pathname;

describe('action command', () => {
  it('exits non-zero on BLOCK so the CI job fails', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'earn-autonomy-ci-'));
    const doc = join(dir, 'd.txt');
    const cfg = join(dir, 'c.json');
    await writeFile(doc, 'text with an em dash — here');
    await writeFile(cfg, JSON.stringify({ rules: [{ name: 'no-em-dash' }], gateN: 1 }));
    let code = 0;
    try { await pexec('node', [CLI, 'check', doc, '--config', cfg, '--pack', 'content', '--runlog', join(dir, 'r.json')]); }
    catch (e: any) { code = e.code; }
    expect(code).toBe(1);
  });
});
