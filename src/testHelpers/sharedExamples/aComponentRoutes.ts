import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentRoutesCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<Location>;
}

export function aComponentRoutes<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentRoutesCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should router",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).router;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
