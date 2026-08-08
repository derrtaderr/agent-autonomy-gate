import { describe, it, expect } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { appendRun, readRuns, computeStreak, clearedForAutonomy } from './index.js';

const rec = (status: 'PASS' | 'BLOCK') => ({ timestamp: '2026-07-17T00:00:00Z', configId: 'c1', status, reasons: [] });

describe('runlog', () => {
  it('appends and reads back runs', async () => {
    const p = join(tmpdir(), `evalrun-${Math.round(performance.now())}.json`);
    await rm(p, { force: true });
    await appendRun(p, rec('PASS'));
    await appendRun(p, rec('BLOCK'));
    expect(await readRuns(p)).toHaveLength(2);
    await rm(p, { force: true });
  });
  it('returns [] for a missing file', async () => {
    expect(await readRuns(join(tmpdir(), 'does-not-exist-xyz.json'))).toEqual([]);
  });
  it('counts the consecutive tail streak for a config, reset by a BLOCK', () => {
    const runs = [rec('PASS'), rec('BLOCK'), rec('PASS'), rec('PASS')];
    expect(computeStreak(runs, 'c1')).toBe(2);
  });
  it('ignores other configs in the streak', () => {
    const runs = [{ ...rec('PASS'), configId: 'other' }, rec('PASS')];
    expect(computeStreak(runs, 'c1')).toBe(1);
  });
  it('clears autonomy at gateN', () => {
    expect(clearedForAutonomy(5, 5)).toBe(true);
    expect(clearedForAutonomy(4, 5)).toBe(false);
  });
  it('a BLOCK resets only the matching config streak, not another config', () => {
    const runs = [
      { ...rec('PASS'), configId: 'a' },
      { ...rec('PASS'), configId: 'b' },
      { ...rec('BLOCK'), configId: 'a' },
      { ...rec('PASS'), configId: 'a' },
    ];
    expect(computeStreak(runs, 'a')).toBe(1);
    expect(computeStreak(runs, 'b')).toBe(1);
  });
});
