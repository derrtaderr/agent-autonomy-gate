import { readFile, writeFile } from 'node:fs/promises';
import type { RunRecord } from '../types.js';

export async function readRuns(path: string): Promise<RunRecord[]> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as RunRecord[];
  } catch {
    return [];
  }
}

export async function appendRun(path: string, record: RunRecord): Promise<void> {
  const runs = await readRuns(path);
  runs.push(record);
  await writeFile(path, JSON.stringify(runs, null, 2), 'utf8');
}

export function computeStreak(runs: RunRecord[], configId: string): number {
  let streak = 0;
  for (let i = runs.length - 1; i >= 0; i--) {
    const r = runs[i];
    if (r.configId !== configId) continue;
    if (r.status === 'PASS') streak++;
    else break;
  }
  return streak;
}

export function clearedForAutonomy(streak: number, gateN: number): boolean {
  return streak >= gateN;
}
