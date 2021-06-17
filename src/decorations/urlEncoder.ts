import { encodeDateWithTime } from "./date";
import { ParsedQuery } from "../utilities/urlQueryParser";

export const urlEncode = (object: ParsedQuery): string =>
  mapKeyAndStringValue(object, "")
    .filter(([_, encodedValue]) => encodedValue !== ignoreValue)
    .map(([key, value]): [string, string] => [key, encodeURIComponent(value)])
    .map(([key, encodedValue]): string => `${key}=${encodedValue}`)
    .filter((param) => param !== ignoreValue)
    .join("&");

const ignoreValue = "";

const mapKeyAndStringValue = (
  object: ParsedQuery,
  prefix: string
): [string, string][] =>
  Object.keys(object)
    .filter((key) => object[key])
    .map((key): [string, unknown] => [
      prefix === "" ? key : `${prefix}[${key}]`,
      object[key],
    ])
    .reduce((encoded: [string, string][], [key, value]): [string, string][] => {
      if (!isChildren(value))
        return encoded.concat([[key, stringfyValue(value)]]);
      return encoded.concat(mapKeyAndStringValue(value as any, key));
    }, []);

const stringfyValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    return value.toString();
  } else if (typeof value === "boolean") {
    return value.toString();
  } else if (!value) {
    return ignoreValue;
  } else if (isDate(value)) {
    return encodeDateWithTime(value) || ignoreValue;
  }
  // TODO: Implement for array
  console.error("Failed encodeValue");
  return ignoreValue;
};

const isDate = (value: unknown): value is Date =>
  typeof value === "object" && value instanceof Date;

const isChildren = (value: unknown): boolean =>
  typeof value === "object" && !isDate(value);
