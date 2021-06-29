import { StatefulSinks, StatefulSources } from "../component";
import { withState } from "@cycle/state";
import { routerify } from "cyclic-router";
import switchPath from "switch-path";
import { addPrevState } from "cyclejs-test-helpers";

export type StatefulComponent<State> = (
  s: StatefulSources<State>
) => StatefulSinks<State>;

export function sinksFor<State>(
  component: StatefulComponent<State>,
  sources: unknown,
  state?: State
): any {
  return state
    ? withState(routerify(addPrevState(component, state), switchPath))(
        sources as any
      )
    : withState(routerify(component, switchPath))(sources as any);
}
