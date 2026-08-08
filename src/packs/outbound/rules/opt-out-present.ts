import type { RuleFn, Violation } from '../../../core/types.js';

const OPTOUT_RE = /\b(unsubscribe|opt[\s-]?out|reply\s+stop)\b/i;

export const optOutPresent: RuleFn = (text) => {
  const violations: Violation[] = [];
  if (!OPTOUT_RE.test(text)) {
    violations.push({ rule: 'opt-out-present', message: 'No opt-out / unsubscribe line found.' });
  }
  return violations;
};
