import type { RuleFn, RuleConfig, Violation } from '../types.js';

export async function runRules(
  text: string,
  ruleConfigs: RuleConfig[],
  registry: Record<string, RuleFn>,
): Promise<Violation[]> {
  const out: Violation[] = [];
  for (const rc of ruleConfigs) {
    const fn = registry[rc.name];
    if (!fn) throw new Error(`Unknown rule: ${rc.name}`);
    out.push(...(await fn(text, rc.params)));
  }
  return out;
}
