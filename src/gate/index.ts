import type { Violation, Scores, Rubric, Verdict } from '../types.js';

export function evaluateGate(
  ruleViolations: Violation[],
  scores: Scores,
  rubric: Rubric | undefined,
  scoringError?: string,
): Verdict {
  const reasons: string[] = [];
  const failedDimensions: string[] = [];

  for (const v of ruleViolations) reasons.push(`[${v.rule}] ${v.message}`);

  if (scoringError) {
    reasons.push(`scoring failed (fail closed): ${scoringError}`);
  } else if (rubric) {
    for (const d of rubric.dimensions) {
      const s = scores[d.name];
      if (typeof s !== 'number' || !Number.isFinite(s) || s < d.threshold) {
        failedDimensions.push(d.name);
        reasons.push(`dimension "${d.name}" scored ${s ?? 'n/a'} < ${d.threshold}`);
      }
    }
  }

  const status = reasons.length === 0 ? 'PASS' : 'BLOCK';
  return { status, ruleViolations, scores, failedDimensions, reasons };
}
