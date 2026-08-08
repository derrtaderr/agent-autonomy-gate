import { describe, it, expect } from 'vitest';
import { noBinaryCorrective } from './no-binary-corrective.js';

describe('noBinaryCorrective', () => {
  it('flags "It\'s not X, it\'s Y"', () => {
    expect(noBinaryCorrective("It's not a tool, it's a system.")).toHaveLength(1);
  });
  it('flags "not X, it\'s Y"', () => {
    expect(noBinaryCorrective('This is not luck, it\'s process.')).toHaveLength(1);
  });
  it('passes a plain positive sentence', () => {
    expect(noBinaryCorrective('Distribution is the bottleneck.')).toEqual([]);
  });
  it('flags a curly-apostrophe binary corrective', () => {
    expect(noBinaryCorrective('This is not luck, it’s process.')).toHaveLength(1);
  });
});
