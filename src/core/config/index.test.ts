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
  it('prefixes an explicit id onto the content hash', () => {
    const identity = configIdentity({ id: 'jason-voice', rules: [], gateN: 5 });
    expect(identity.startsWith('jason-voice:')).toBe(true);
    expect(identity).not.toBe('jason-voice');
  });
  it('hashes the config when no id, stable across calls', () => {
    const c = { rules: [{ name: 'no-em-dash' }], gateN: 5 };
    expect(configIdentity(c)).toBe(configIdentity(c));
  });
  it('same id with changed rules produces a different identity', () => {
    const before = configIdentity({ id: 'jason-voice', rules: [{ name: 'no-em-dash' }], gateN: 5 });
    const after = configIdentity({ id: 'jason-voice', rules: [{ name: 'no-em-dash' }, { name: 'no-body-colon' }], gateN: 5 });
    expect(before).not.toBe(after);
  });
});
