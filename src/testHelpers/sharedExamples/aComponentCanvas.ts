import { Stream } from "xstream";
import { CanvasRequest } from "../../drivers/canvasDriver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentCanvasCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<CanvasRequest>;
}

export function aComponentCanvas<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentCanvasCondition<State>,
  timeInterval?: number
): [string, () => Promise<boolean>] {
  return [
    "should canvas",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).canvas;

      Time.assertEqual(actual$, expected$);
    }, (timeInterval && { interval: timeInterval }) || undefined),
  ];
}
