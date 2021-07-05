import { Reducer } from "@cycle/state";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import dropRepeats from "xstream/extra/dropRepeats";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentChangesStateByCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<State>;
}

export function aComponentChangesState<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentChangesStateByCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should change state",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);

      const actual$ = sinksFor(component, sources, initialState)
        .state.fold(
          (newState: State, reducer: Reducer<State>) => reducer(newState),
          initialState
        )
        .compose(dropRepeats())
        .drop(1);

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
