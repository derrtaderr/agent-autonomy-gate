export type OutboundMessage = {
  to: string;
  subject?: string;
  body: string;
  links?: string[];
  fields?: Record<string, string>;
};
