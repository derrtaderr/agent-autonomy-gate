import type { RuleFn } from '../../../core/types.js';

export const bannedPhrases: RuleFn = (text, params) => {
  const phrases = (params as { phrases?: string[] } | undefined)?.phrases ?? [];
  const lower = text.toLowerCase();
  return phrases
    .filter((p) => lower.includes(p.toLowerCase()))
    .map((p) => ({ rule: 'banned-phrases', message: `Banned phrase found: "${p}"` }));
};
