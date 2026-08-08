import { describe, it, expect } from 'vitest';
import { prepareOutbound } from './prepare.js';

describe('prepareOutbound', () => {
  it('resolves present fields and leaves blank/missing fields as tokens', () => {
    const text = prepareOutbound({
      to: 'a@b.com',
      subject: 'Hi {{firstName}}',
      body: 'Saw {{company}} shipped. {{missing}} here.',
      fields: { firstName: 'Sam', company: 'Acme', missing: '  ' },
    });
    expect(text).toContain('Hi Sam');
    expect(text).toContain('Saw Acme shipped');
    expect(text).toContain('{{missing}}'); // blank field stays a token
  });
});
