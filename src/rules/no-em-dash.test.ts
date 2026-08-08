import { describe, it, expect } from 'vitest';
import { noEmDash } from './no-em-dash.js';

describe('noEmDash', () => {
  it('flags text containing an em dash', () => {
    const v = noEmDash('Building is easy — distribution is hard.');
    expect(v).toHaveLength(1);
    expect(v[0].rule).toBe('no-em-dash');
  });
  it('counts multiple em dashes in one message', () => {
    const v = noEmDash('a — b — c') as { message: string }[];
    expect(v[0].message).toContain('2');
  });
  it('passes clean text with hyphens and en dashes', () => {
    expect(noEmDash('well-built, pages 10–20')).toEqual([]);
  });
});
