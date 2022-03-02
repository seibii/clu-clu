import { Stream } from "xstream";
import { Auth0Event } from "../../drivers/auth0LockDriver";

export interface MockLockResponses {
  token$?: Stream<string>;
  event$?: Stream<Auth0Event>;
}

export const mockLockSource = (
  responses: MockLockResponses
): MockLockResponses => ({
  token$: responses.token$ || Stream.never(),
  event$: responses.event$ || Stream.never(),
});
