import { describe, it, expect } from 'vitest';
import { renderVerdict } from './render.js';

describe('renderVerdict', () => {
  it('shows BLOCK with reasons and streak state', () => {
    const out = renderVerdict(
      { status: 'BLOCK', ruleViolations: [], scores: {}, failedDimensions: [], reasons: ['[no-em-dash] Found 1 em dash(es).'] },
      0, 5, '.eval-runs.json',
    );
    expect(out).toContain('BLOCK');
    expect(out).toContain('no-em-dash');
    expect(out).toContain('0/5');
  });
  it('shows PASS and cleared-for-autonomy at gateN', () => {
    const out = renderVerdict({ status: 'PASS', ruleViolations: [], scores: {}, failedDimensions: [], reasons: [] }, 5, 5, '.eval-runs.json');
    expect(out).toContain('PASS');
    expect(out.toLowerCase()).toContain('autonom');
  });
  it('surfaces the runlog path as a final line', () => {
    const out = renderVerdict({ status: 'PASS', ruleViolations: [], scores: {}, failedDimensions: [], reasons: [] }, 1, 5, '/tmp/my-runs.json');
    expect(out).toContain('runlog: /tmp/my-runs.json');
  });
});
