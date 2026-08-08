import { describe, it, expect } from 'vitest';
import { buildRuleRegistry, runRules } from './index.js';

describe('rule registry', () => {
  const registry = buildRuleRegistry({ linkChecker: async () => true });
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
