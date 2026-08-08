import { describe, it, expect, beforeAll } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pexec = promisify(execFile);
const CLI = new URL('../../../dist/core/cli/index.js', import.meta.url).pathname;
const PKG = new URL('../../../package.json', import.meta.url).pathname;

async function run(args: string[]) {
  try {
    const { stdout, stderr } = await pexec('node', [CLI, ...args]);
    return { code: 0, stdout, stderr };
  } catch (e: any) {
    return { code: e.code as number, stdout: (e.stdout as string) ?? '', stderr: (e.stderr as string) ?? '' };
  }
}

describe('cli', () => {
  let dir: string;
  beforeAll(async () => { dir = await mkdtemp(join(tmpdir(), 'earn-autonomy-')); });

  it('outbound: BLOCKs an unresolved token, exit 1, json flag surfaces cleared=false', async () => {
    const msg = join(dir, 'msg.json');
    const cfg = join(dir, 'cfg.json');
    const log = join(dir, 'runs.json');
    await writeFile(msg, JSON.stringify({ to: 'a@b.com', body: 'Hi {{firstName}}. Reply STOP to unsubscribe.' }));
    await writeFile(cfg, JSON.stringify({ rules: [{ name: 'no-merge-token' }, { name: 'opt-out-present' }], gateN: 2 }));
    const { code, stdout } = await run(['check', msg, '--config', cfg, '--pack', 'outbound', '--runlog', log, '--json']);
    expect(code).toBe(1);
    expect(JSON.parse(stdout).clearedForAutonomy).toBe(false);
  });

  it('content: PASS with rules-only config, exit 0', async () => {
    const doc = join(dir, 'doc.txt');
    const cfg = join(dir, 'cfg2.json');
    const log = join(dir, 'runs2.json');
    await writeFile(doc, 'clean copy with no banned tokens');
    await writeFile(cfg, JSON.stringify({ rules: [{ name: 'no-em-dash' }], gateN: 1 }));
    const { code, stdout } = await run(['check', doc, '--config', cfg, '--pack', 'content', '--runlog', log, '--json']);
    expect(code).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.clearedForAutonomy).toBe(true); // gateN=1, one PASS clears it
    expect(parsed.runlog).toBe(log);
  });

  it('exits 2 with a message when --pack is omitted', async () => {
    const doc = join(dir, 'doc3.txt');
    const cfg = join(dir, 'cfg3.json');
    await writeFile(doc, 'clean copy with no banned tokens');
    await writeFile(cfg, JSON.stringify({ rules: [{ name: 'no-em-dash' }], gateN: 1 }));
    const { code, stderr } = await run(['check', doc, '--config', cfg]);
    expect(code).toBe(2);
    expect(stderr).toContain('Missing --pack. Available: content, outbound');
  });

  it('--version prints the package version and exits 0', async () => {
    const { code, stdout } = await run(['--version']);
    const pkg = JSON.parse(await readFile(PKG, 'utf8'));
    expect(code).toBe(0);
    expect(stdout.trim()).toBe(pkg.version);
  });

  it('-v also prints the package version', async () => {
    const { code, stdout } = await run(['-v']);
    const pkg = JSON.parse(await readFile(PKG, 'utf8'));
    expect(code).toBe(0);
    expect(stdout.trim()).toBe(pkg.version);
  });

  it('missing input file prints a friendly error and exits 2', async () => {
    const cfg = join(dir, 'cfg4.json');
    await writeFile(cfg, JSON.stringify({ rules: [{ name: 'no-em-dash' }], gateN: 1 }));
    const missing = join(dir, 'does-not-exist.txt');
    const { code, stderr } = await run(['check', missing, '--config', cfg, '--pack', 'content']);
    expect(code).toBe(2);
    expect(stderr).toContain(`Cannot read ${missing}. Check the path.`);
  });

  it('malformed config JSON prints a friendly error and exits 2', async () => {
    const doc = join(dir, 'doc5.txt');
    const cfg = join(dir, 'cfg5.json');
    await writeFile(doc, 'clean copy');
    await writeFile(cfg, '{ not valid json');
    const { code, stderr } = await run(['check', doc, '--config', cfg, '--pack', 'content']);
    expect(code).toBe(2);
    expect(stderr).toContain(`Invalid JSON in ${cfg}:`);
  });
});
