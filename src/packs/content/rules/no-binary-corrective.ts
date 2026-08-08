import type { RuleFn, Violation } from '../../../core/types.js';

// Heuristic: catches the common "it's not X, it's Y" and "not X, it's Y" forms.
// Not exhaustive by design; the deterministic rules are a first-pass gate.
const patterns: RegExp[] = [
  /\bit'?s not\b[\s\S]{0,60}?,\s*it'?s\b/i,
  /\bnot\b[^.,\n]{0,40}?,\s*it'?s\b/i,
];

export const noBinaryCorrective: RuleFn = (text) => {
  const normalized = text.replace(/’/g, "'");
  const violations: Violation[] = [];
  for (const p of patterns) {
    if (p.test(normalized)) {
      violations.push({ rule: 'no-binary-corrective', message: 'Binary corrective ("not X, it\'s Y") detected. Lead with the positive path only.' });
      break;
    }
  }
  return violations;
};
