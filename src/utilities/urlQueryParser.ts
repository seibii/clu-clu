import { Stream } from "xstream";
import { Location } from "@cycle/history";
import * as camelcaseKeys from "camelcase-keys";
import { RouterSource } from "cyclic-router";
import { replaceAll } from "./string";

export type ParsedQuery = Record<string, unknown>;

interface Sources {
  router: RouterSource;
}

export const onChangeQueryParams$ = (
  sources: Sources,
  options?: camelcaseKeys.Options
): Stream<ParsedQuery> =>
  sources.router.history$
    .map((history: Location) => history.search)
    .map(parseQuery)
    .map((p: ParsedQuery) => camelcaseKeys(p, options));

export const parseQuery = (query: string): ParsedQuery =>
  query
    .replace(/^\?/, "")
    .split("&")
    .map((pair) => pair.split("="))
    .filter((pair) => pair.length >= 2)
    .map((pair): [string, string] => [decodeURI(pair[0]), decodeURI(pair[1])])
    .reduce((acc: ParsedQuery, [key, value]) => makeValue(key, value, acc), {});

export const parseDate = (source: string | undefined): Date | undefined => {
  if (!source) return undefined;
  const date = new Date(source.replace(" ", "+"));
  return date.toString() === "Invalid date" ? undefined : date;
};

const decodeURI = (source: string): string =>
  decodeURIComponent(replaceAll(source, "+", " "));

const makeValue = (
  key: string,
  value: string,
  parsed: ParsedQuery
): ParsedQuery => {
  const matchedKey = /^([a-z0-9_\\-]+)\[([a-z0-9_\-\\[\]]+)\]$/i.exec(key);
  const hasChild = Array.isArray(matchedKey) && matchedKey.length >= 3;
  if (hasChild && matchedKey) {
    const headKey = matchedKey[1];
    return {
      ...parsed,
      [headKey]: makeValue(
        matchedKey[2],
        decodeURI(value),
        (parsed[headKey] as Record<string, unknown>) || {}
      ),
    };
  } else {
    return { ...parsed, [key]: value };
  }
};
