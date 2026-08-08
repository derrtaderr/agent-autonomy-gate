import { describe, it, expect, vi } from 'vitest';
import { scoreContent } from './index.js';

describe('scoreContent', () => {
  const rubric = { dimensions: [{ name: 'voice-match', threshold: 7 }] };
  it('calls the provider with dimension names and returns its scores', async () => {
    const provider = vi.fn(async () => ({ 'voice-match': 8 }));
    const scores = await scoreContent('draft', rubric, provider);
    expect(provider).toHaveBeenCalledWith('draft', ['voice-match']);
    expect(scores).toEqual({ 'voice-match': 8 });
  });
  it('skips the provider when no rubric', async () => {
    const provider = vi.fn(async () => ({}));
    expect(await scoreContent('draft', undefined, provider)).toEqual({});
    expect(provider).not.toHaveBeenCalled();
  });
  it('skips the provider when rubric has zero dimensions', async () => {
    const provider = vi.fn(async () => ({}));
    expect(await scoreContent('draft', { dimensions: [] }, provider)).toEqual({});
    expect(provider).not.toHaveBeenCalled();
  });
});
