import { describe, it, expect } from 'vitest';
import { parseConfig, configIdentity } from './index.js';

describe('config', () => {
  it('applies defaults for gateN and dimension threshold', () => {
    const c = parseConfig({ rules: [{ name: 'no-em-dash' }], rubric: { dimensions: [{ name: 'voice-match' }] } });
    expect(c.gateN).toBe(5);
    expect(c.rubric!.dimensions[0].threshold).toBe(7);
  });
  it('throws on missing rules array', () => {
    expect(() => parseConfig({ rubric: { dimensions: [] } })).toThrow(/rules/);
  });
  it('uses an explicit id as identity', () => {
    expect(configIdentity({ id: 'jason-voice', rules: [], gateN: 5 })).toBe('jason-voice');
  });
  it('hashes the config when no id, stable across calls', () => {
    const c = { rules: [{ name: 'no-em-dash' }], gateN: 5 };
    expect(configIdentity(c)).toBe(configIdentity(c));
  });
});
