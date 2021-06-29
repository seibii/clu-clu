import { Stream } from "xstream";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { LocationRequest } from "../../drivers/locationDriver";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentLocationCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<LocationRequest>;
}

export function aComponentLocation<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentLocationCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should location",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).location;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
