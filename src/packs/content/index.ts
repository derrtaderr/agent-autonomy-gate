import type { Pack } from '../../core/pack.js';
import type { RuleFn } from '../../core/types.js';
import { makeLinkValidity, defaultLinkChecker } from '../../core/rules/link-validity.js';
import { noEmDash } from './rules/no-em-dash.js';
import { noBodyColon } from './rules/no-body-colon.js';
import { bannedPhrases } from './rules/banned-phrases.js';
import { noBinaryCorrective } from './rules/no-binary-corrective.js';

export function contentPack(): Pack<string> {
  const registry: Record<string, RuleFn> = {
    'no-em-dash': noEmDash,
    'no-body-colon': noBodyColon,
    'banned-phrases': bannedPhrases,
    'no-binary-corrective': noBinaryCorrective,
    'link-validity': makeLinkValidity(defaultLinkChecker),
  };
  return { id: 'content', inputKind: 'text', prepare: (input) => input, registry };
}
