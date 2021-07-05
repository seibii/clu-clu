import { Stream } from "xstream";

export interface MockAuthResponses {
  token$?: Stream<string>;
  login$?: Stream<null>;
  logout$?: Stream<null>;
  requiredLogin$?: Stream<null>;
}

export const mockAuthSource = (
  responses: MockAuthResponses
): MockAuthResponses => ({
  token$: responses.token$ || Stream.never(),
  login$: responses.login$ || Stream.never(),
  logout$: responses.logout$ || Stream.never(),
  requiredLogin$: responses.requiredLogin$ || Stream.never(),
});
