export const trimPrefix = (s: string, prefix: string): string =>
  s.slice(s.indexOf(prefix) + prefix.length);

export const replaceAll = (s: string, target: string, subStr: string): string =>
  s.split(target).join(subStr);
