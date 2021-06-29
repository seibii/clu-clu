import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentAnalyticsCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<null>;
}

export function aComponentAnalytics<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentAnalyticsCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should analytics",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).analytics;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
