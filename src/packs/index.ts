import type { Pack } from '../core/pack.js';
import { contentPack } from './content/index.js';
import { outboundPack } from './outbound/index.js';

export function getPack(id: string): Pack {
  const packs: Record<string, () => Pack> = {
    content: contentPack as () => Pack,
    outbound: outboundPack as () => Pack,
  };
  const make = packs[id];
  if (!make) throw new Error(`Unknown pack: ${id}. Available: ${Object.keys(packs).join(', ')}`);
  return make();
}
