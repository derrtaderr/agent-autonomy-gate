import type { Pack } from '../../core/pack.js';
import type { RuleFn } from '../../core/types.js';
import { makeLinkValidity, defaultLinkChecker } from '../../core/rules/link-validity.js';
import { noMergeToken } from './rules/no-merge-token.js';
import { optOutPresent } from './rules/opt-out-present.js';
import { prepareOutbound } from './prepare.js';
import type { OutboundMessage } from './types.js';

export function outboundPack(): Pack<OutboundMessage> {
  const registry: Record<string, RuleFn> = {
    'no-merge-token': noMergeToken,
    'opt-out-present': optOutPresent,
    'link-validity': makeLinkValidity(defaultLinkChecker),
  };
  return {
    id: 'outbound',
    prepare: prepareOutbound,
    registry,
    defaultRubric: {
      dimensions: [
        { name: 'personalization', threshold: 7 },
        { name: 'on-voice', threshold: 7 },
        { name: 'claim-grounding', threshold: 8 },
        { name: 'icp-relevance', threshold: 7 },
      ],
    },
  };
}
