import type { RuleFn, Violation, LinkChecker } from '../types.js';

const URL_RE = /https?:\/\/[^\s)\]]+/g;

export const defaultLinkChecker: LinkChecker = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false; // fail closed
  }
};

export function makeLinkValidity(checker: LinkChecker): RuleFn {
  return async (text) => {
    const urls = Array.from(new Set(text.match(URL_RE) ?? []));
    const violations: Violation[] = [];
    for (const url of urls) {
      if (!(await checker(url))) {
        violations.push({ rule: 'link-validity', message: `Unresolvable link: ${url}` });
      }
    }
    return violations;
  };
}
