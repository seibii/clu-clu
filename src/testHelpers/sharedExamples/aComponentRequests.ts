import { RequestInput } from "@cycle/http";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentRequestsCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<RequestInput>;
}

export function aComponentRequests<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentRequestsCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should request",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);

      const actual$ = sinksFor(component, sources, initialState).HTTP;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
