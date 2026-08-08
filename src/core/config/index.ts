import { createHash } from 'node:crypto';
import type { Config } from '../types.js';

export function parseConfig(raw: unknown): Config {
  const r = raw as Partial<Config> | null;
  if (!r || !Array.isArray(r.rules)) {
    throw new Error('Invalid config: "rules" must be an array.');
  }
  const rubric = r.rubric
    ? { dimensions: r.rubric.dimensions.map((d) => ({ name: d.name, threshold: d.threshold ?? 7 })) }
    : undefined;
  return { id: r.id, rules: r.rules, rubric, gateN: r.gateN ?? 5 };
}

export function configIdentity(config: Config): string {
  const canonical = JSON.stringify({ rules: config.rules, rubric: config.rubric, gateN: config.gateN });
  const hash = createHash('sha256').update(canonical).digest('hex').slice(0, 12);
  return config.id ? `${config.id}:${hash}` : hash;
}
