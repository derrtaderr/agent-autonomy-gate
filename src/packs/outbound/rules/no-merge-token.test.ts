import { describe, it, expect } from 'vitest';
import { noMergeToken } from './no-merge-token.js';

describe('noMergeToken', () => {
  it('flags unresolved {{ }} and [ALLCAPS] tokens', () => {
    const v = noMergeToken('Hi {{firstName}}, at [COMPANY] we noticed');
    expect(v.map((x) => x.rule)).toEqual(['no-merge-token', 'no-merge-token']);
  });
  it('passes clean copy', () => {
    expect(noMergeToken('Hi Sam, at Acme we noticed')).toEqual([]);
  });
});
