import { describe, it, expect } from 'vitest';
import { optOutPresent } from './opt-out-present.js';

describe('optOutPresent', () => {
  it('blocks when no opt-out line exists', () => {
    expect(optOutPresent('Great fit, let us talk.').length).toBe(1);
  });
  it('passes when an unsubscribe line exists', () => {
    expect(optOutPresent('...\nReply STOP to unsubscribe.')).toEqual([]);
  });
});
