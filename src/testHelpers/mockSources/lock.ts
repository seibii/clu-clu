import { Stream } from "xstream";

export interface MockLockResponses {
  token$?: Stream<string>;
}

export const mockLockSource = (
  responses: MockLockResponses
): MockLockResponses => ({
  token$: responses.token$ || Stream.never(),
});
