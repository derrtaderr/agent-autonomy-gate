import type { Config, Verdict, RuleFn, LLMProvider, Scores } from './types.js';
import { runRules } from './rules/index.js';
import { scoreContent } from './scoring/index.js';
import { evaluateGate } from './gate/index.js';

export async function evaluate(
  content: string,
  config: Config,
  deps: { registry: Record<string, RuleFn>; provider: LLMProvider },
): Promise<Verdict> {
  const ruleViolations = await runRules(content, config.rules, deps.registry);
  let scores: Scores = {};
  let scoringError: string | undefined;
  try {
    scores = await scoreContent(content, config.rubric, deps.provider);
  } catch (e) {
    scoringError = e instanceof Error ? e.message : String(e);
  }
  return evaluateGate(ruleViolations, scores, config.rubric, scoringError);
}
