import type { RuleFn } from '../../../core/types.js';

export const noEmDash: RuleFn = (text) => {
  const matches = text.match(/—/g);
  if (!matches) return [];
  return [{ rule: 'no-em-dash', message: `Found ${matches.length} em dash(es). Use a period or comma.` }];
};
