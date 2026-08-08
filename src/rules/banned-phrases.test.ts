import { describe, it, expect } from 'vitest';
import { bannedPhrases } from './banned-phrases.js';

describe('bannedPhrases', () => {
  const params = { phrases: ['passionate', 'would love'] };
  it('flags each banned phrase, case-insensitively', () => {
    const v = bannedPhrases("I'm Passionate and would love to help.", params);
    expect(v).toHaveLength(2);
  });
  it('passes clean text', () => {
    expect(bannedPhrases('I build systems.', params)).toEqual([]);
  });
  it('returns nothing when no phrases configured', () => {
    expect(bannedPhrases('passionate', undefined)).toEqual([]);
  });
});
