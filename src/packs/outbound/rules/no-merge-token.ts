import type { RuleFn, Violation } from '../../../core/types.js';

const TOKEN_RE = /\{\{\s*[\w.]+\s*\}\}|\[[A-Z][A-Z0-9_ ]*\]/g;

export const noMergeToken: RuleFn = (text) => {
  const hits = Array.from(new Set(text.match(TOKEN_RE) ?? []));
  return hits.map<Violation>((t) => ({
    rule: 'no-merge-token',
    message: `Unresolved personalization token: ${t}`,
  }));
};
