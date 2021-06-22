import { HTTPSource } from "@cycle/http";
import { Stream } from "xstream";

type MockHTTPResponses = Record<string, Stream<unknown>>;

export const mockHTTPSource = (responses: MockHTTPResponses): HTTPSource => {
  const select = (category?: string) =>
    Stream.of(
      (responses[category || "*"] || Stream.never()).map((data) => ({
        text: JSON.stringify(data),
      }))
    );

  return {
    filter: () => mockHTTPSource(responses),
    select,
    isolateSource: undefined,
    isolateSink: undefined,
  } as any;
};
