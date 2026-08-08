import type { RuleFn, Violation } from '../types.js';

export const noBodyColon: RuleFn = (text) => {
  const violations: Violation[] = [];
  for (const line of text.split('\n')) {
    if (line.trimStart().startsWith('#')) continue; // header
    const cleaned = line.replace(/https?:\/\/\S+/g, '').replace(/\d:\d/g, '');
    if (cleaned.includes(':')) {
      violations.push({ rule: 'no-body-colon', message: `Colon in body line: "${line.trim()}"` });
    }
  }
  return violations;
};
