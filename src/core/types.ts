export type Violation = { rule: string; message: string };
export type RuleFn = (text: string, params?: unknown) => Violation[] | Promise<Violation[]>;
export type RuleConfig = { name: string; params?: unknown };
export type RubricDimension = { name: string; threshold: number };
export type Rubric = { dimensions: RubricDimension[] };
export type Scores = Record<string, number>;
export type Config = { id?: string; rules: RuleConfig[]; rubric?: Rubric; gateN: number };
export type Verdict = {
  status: 'PASS' | 'BLOCK';
  ruleViolations: Violation[];
  scores: Scores;
  failedDimensions: string[];
  reasons: string[];
};
export type RunRecord = { timestamp: string; configId: string; status: 'PASS' | 'BLOCK'; reasons: string[] };
export type LLMProvider = (content: string, dimensions: string[]) => Promise<Scores>;
export type LinkChecker = (url: string) => Promise<boolean>;
