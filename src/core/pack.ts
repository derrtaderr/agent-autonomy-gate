import type { RuleFn, Rubric } from './types.js';

export type Pack<TInput = unknown> = {
  id: string;
  inputKind: 'text' | 'json';
  prepare: (input: TInput) => string;
  registry: Record<string, RuleFn>;
  defaultRubric?: Rubric;
};
