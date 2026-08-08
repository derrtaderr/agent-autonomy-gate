import { describe, it, expect } from 'vitest';
import { evaluate } from './evaluate.js';
import { buildRuleRegistry } from './rules/index.js';

const registry = buildRuleRegistry({ linkChecker: async () => true });
const config = {
  rules: [{ name: 'no-em-dash' }],
  rubric: { dimensions: [{ name: 'voice-match', threshold: 7 }] },
  gateN: 5,
};

describe('evaluate', () => {
  it('passes clean content with a good score', async () => {
    const v = await evaluate('clean text', config, { registry, provider: async () => ({ 'voice-match': 9 }) });
    expect(v.status).toBe('PASS');
  });
  it('fails closed when the provider throws', async () => {
    const v = await evaluate('clean text', config, {
      registry,
      provider: async () => { throw new Error('boom'); },
    });
    expect(v.status).toBe('BLOCK');
    expect(v.reasons.join(' ')).toContain('boom');
  });
  it('fails closed when the provider throws a non-Error value', async () => {
    const v = await evaluate('clean text', config, {
      registry,
      provider: async () => { throw 'string failure'; },
    });
    expect(v.status).toBe('BLOCK');
    expect(v.reasons.join(' ')).toContain('string failure');
  });
});
