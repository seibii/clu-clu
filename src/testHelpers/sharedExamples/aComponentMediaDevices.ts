import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { Stream } from "xstream";
import { MediaRequest } from "../../drivers/mediaDevicesDriver";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentMediaDevices<State> {
  sources: StatefulSources<State>;
  expected$: Stream<MediaRequest>;
}

export function aComponentMediaDevices<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentMediaDevices<State>
): [string, () => Promise<boolean>] {
  return [
    "should request media",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);

      const actual$ = sinksFor(component, sources, initialState).mediaDevices;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
