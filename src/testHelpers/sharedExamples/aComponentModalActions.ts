import { Stream } from "xstream";
import { ModalActionRequest } from "../../drivers/modalActionsDriver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentModalActionsCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<ModalActionRequest>;
}

export function aComponentModalActions<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentModalActionsCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should modal action",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).modalActions;
      Time.assertEqual(actual$, expected$);
    }),
  ];
}
