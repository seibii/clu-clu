import { Stream } from "xstream";
import { Auth0Request as AuthRequest } from "../../drivers/auth0Driver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentAuthCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<AuthRequest>;
}

export function aComponentAuth<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentAuthCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should auth",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).auth;

      Time.assertEqual(actual$, expected$);
    }),
  ];
}
