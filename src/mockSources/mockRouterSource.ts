import { Stream } from "xstream";
import { Location } from "@cycle/history";

export interface MockRouterSource {
  history$: Stream<Location>;
}

export const mockRouterSource = (
  history$: Stream<Location>
): MockRouterSource => ({ history$ });

export const mockHistorySource = (
  history$: Stream<Location>
): Stream<Location> => history$;

export const makeMockLocation = (
  pathname: string,
  query?: string
): Location => ({
  hash: "",
  state: undefined,
  pathname,
  search: query || "",
});
