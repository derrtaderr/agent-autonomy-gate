import type { OutboundMessage } from './types.js';

// Canonical text the rules and rubric evaluate. A merge token whose field is
// missing or blank is left in place so the no-merge-token rule catches it:
// blank personalization is the same failure as an unresolved token.
export function prepareOutbound(msg: OutboundMessage): string {
  const fields = msg.fields ?? {};
  const resolve = (s: string): string =>
    s.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k: string) => {
      const v = fields[k];
      return v && v.trim() ? v : `{{${k}}}`;
    });
  return [
    msg.subject ? `Subject: ${resolve(msg.subject)}` : '',
    resolve(msg.body),
    ...(msg.links ?? []),
  ].filter(Boolean).join('\n');
}
