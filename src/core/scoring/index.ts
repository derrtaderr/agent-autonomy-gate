import type { Rubric, Scores, LLMProvider } from '../types.js';

export async function scoreContent(
  content: string,
  rubric: Rubric | undefined,
  provider: LLMProvider,
): Promise<Scores> {
  if (!rubric || rubric.dimensions.length === 0) return {};
  return provider(content, rubric.dimensions.map((d) => d.name));
}
