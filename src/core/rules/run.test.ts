import { describe, it, expect } from 'vitest';
import { runRules } from './run.js';
import type { RuleFn } from '../types.js';

const registry: Record<string, RuleFn> = {
  'no-em-dash': (text) => (text.includes('—') ? [{ rule: 'no-em-dash', message: 'em dash' }] : []),
  'banned-phrases': (text, params) => {
    const phrases = (params as { phrases?: string[] } | undefined)?.phrases ?? [];
    return phrases.filter((p) => text.includes(p)).map((p) => ({ rule: 'banned-phrases', message: p }));
  },
};

describe('runRules', () => {
  it('runs selected rules and aggregates violations', async () => {
    const v = await runRules('It uses an em dash —.', [{ name: 'no-em-dash' }], registry);
    expect(v).toHaveLength(1);
  });
  it('passes params through to a rule', async () => {
    const v = await runRules('passionate', [{ name: 'banned-phrases', params: { phrases: ['passionate'] } }], registry);
    expect(v).toHaveLength(1);
  });
  it('throws on an unknown rule name', async () => {
    await expect(runRules('x', [{ name: 'nope' }], registry)).rejects.toThrow('Unknown rule: nope');
  });
});
