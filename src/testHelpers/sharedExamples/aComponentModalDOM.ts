import { Stream } from "xstream";
import { MediaRequest } from "../../drivers/mediaDevicesDriver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { assertLooksLike } from "snabbdom-looks-like";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentModalDOM<State> {
  sources: StatefulSources<State>;
  expected$: Stream<MediaRequest>;
}

export function aComponentModalDOM<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentModalDOM<State>
): [string, () => Promise<boolean>] {
  return [
    "should modal DOM",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).modalDOM;
      Time.assertEqual(actual$, expected$, assertLooksLike);
    }),
  ];
}
