import { describe, it, expect } from 'vitest';
import { evaluateGate } from './index.js';

const rubric = { dimensions: [{ name: 'voice-match', threshold: 7 }] };

describe('evaluateGate', () => {
  it('passes clean rules and scores above threshold', () => {
    const v = evaluateGate([], { 'voice-match': 8 }, rubric);
    expect(v.status).toBe('PASS');
  });
  it('blocks on a rule violation', () => {
    const v = evaluateGate([{ rule: 'no-em-dash', message: 'x' }], { 'voice-match': 9 }, rubric);
    expect(v.status).toBe('BLOCK');
  });
  it('blocks on a dimension below threshold', () => {
    const v = evaluateGate([], { 'voice-match': 6 }, rubric);
    expect(v.status).toBe('BLOCK');
    expect(v.failedDimensions).toEqual(['voice-match']);
  });
  it('blocks and fails closed on a scoring error', () => {
    const v = evaluateGate([], {}, rubric, 'timeout');
    expect(v.status).toBe('BLOCK');
    expect(v.reasons.join(' ')).toContain('scoring');
  });
  it('blocks on a non-numeric score (fail closed)', () => {
    const v = evaluateGate([], { 'voice-match': Number.NaN }, rubric);
    expect(v.status).toBe('BLOCK');
    expect(v.failedDimensions).toEqual(['voice-match']);
  });
});
