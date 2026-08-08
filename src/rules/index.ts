import type { RuleFn, RuleConfig, Violation, LinkChecker } from '../types.js';
import { noEmDash } from './no-em-dash.js';
import { noBodyColon } from './no-body-colon.js';
import { bannedPhrases } from './banned-phrases.js';
import { noBinaryCorrective } from './no-binary-corrective.js';
import { makeLinkValidity } from './link-validity.js';

export function buildRuleRegistry(deps: { linkChecker: LinkChecker }): Record<string, RuleFn> {
  return {
    'no-em-dash': noEmDash,
    'no-body-colon': noBodyColon,
    'banned-phrases': bannedPhrases,
    'no-binary-corrective': noBinaryCorrective,
    'link-validity': makeLinkValidity(deps.linkChecker),
  };
}

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
