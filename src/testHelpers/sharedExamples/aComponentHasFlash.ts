import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";
import { FlashRequest } from "../../drivers/flashDriver";

export interface AComponentFlashCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<FlashRequest>;
}

export function aComponentFlash<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentFlashCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should flash",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).flash;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
