import { describe, it, expect } from 'vitest';
import { contentPack } from './index.js';
import { evaluate } from '../../core/evaluate.js';
import type { Config } from '../../core/types.js';

describe('contentPack', () => {
  it('runs content rules on prepared text and blocks an em dash', async () => {
    const pack = contentPack();
    const config: Config = { rules: [{ name: 'no-em-dash' }], gateN: 5 };
    const text = pack.prepare('this has an em dash — right here');
    const verdict = await evaluate(text, config, {
      registry: pack.registry,
      provider: async () => ({}),
    });
    expect(verdict.status).toBe('BLOCK');
    expect(verdict.reasons.join(' ')).toContain('no-em-dash');
  });
});
