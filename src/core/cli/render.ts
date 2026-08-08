import type { Verdict } from '../types.js';
import { clearedForAutonomy } from '../runlog/index.js';

export function renderVerdict(verdict: Verdict, streak: number, gateN: number): string {
  const lines: string[] = [];
  lines.push(`VERDICT: ${verdict.status}`);
  for (const r of verdict.reasons) lines.push(`  - ${r}`);
  for (const [dim, s] of Object.entries(verdict.scores)) lines.push(`  score ${dim}: ${s}`);
  lines.push(`clean-run streak: ${streak}/${gateN}`);
  if (verdict.status === 'PASS' && clearedForAutonomy(streak, gateN)) {
    lines.push('cleared for autonomous publishing');
  } else {
    lines.push('NOT cleared for autonomy');
  }
  return lines.join('\n');
}
