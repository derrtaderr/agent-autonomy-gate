import { describe, it, expect } from 'vitest';
import { noBodyColon } from './no-body-colon.js';

describe('noBodyColon', () => {
  it('flags a colon in a body line', () => {
    const v = noBodyColon('Here is why it works: the wiki compounds.');
    expect(v).toHaveLength(1);
    expect(v[0].rule).toBe('no-body-colon');
  });
  it('allows a colon in a markdown header', () => {
    expect(noBodyColon('## Section: The Approach')).toEqual([]);
  });
  it('ignores colons in URLs and times', () => {
    expect(noBodyColon('See https://derr.ai at 12:30 today.')).toEqual([]);
  });
});
