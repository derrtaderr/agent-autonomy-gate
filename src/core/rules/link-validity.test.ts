import { describe, it, expect } from 'vitest';
import { makeLinkValidity } from './link-validity.js';

describe('linkValidity', () => {
  it('flags an unresolvable link', async () => {
    const rule = makeLinkValidity(async () => false);
    const v = await rule('See [site](https://example.com/x).');
    expect(v).toHaveLength(1);
    expect(v[0].rule).toBe('link-validity');
  });
  it('passes when all links resolve', async () => {
    const rule = makeLinkValidity(async () => true);
    expect(await rule('Visit https://derr.ai now.')).toEqual([]);
  });
  it('passes text with no links', async () => {
    const rule = makeLinkValidity(async () => false);
    expect(await rule('No links here.')).toEqual([]);
  });
});
