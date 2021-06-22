export const trimPrefix = (s: string, prefix: string): string =>
  s.slice(s.indexOf(prefix) + prefix.length);
