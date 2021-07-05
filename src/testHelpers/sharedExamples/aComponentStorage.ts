import { Stream } from "xstream";
import { StorageRequest } from "@cycle/storage";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentStorageCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<StorageRequest>;
}

export function aComponentStorage<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentStorageCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should storage",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).storage;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
