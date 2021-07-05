import { VNode } from "@cycle/dom";
import { withTime } from "cyclejs-test-helpers";
import { assertLooksLike } from "snabbdom-looks-like";
import { sinksFor, StatefulComponent } from "../component";

export function aComponentHasView(sourcesFor: (props: unknown) => unknown) {
  return <State>(
    component: StatefulComponent<State>,
    state: State,
    view: VNode
  ): [string, () => Promise<boolean>] => [
    "should render the view",
    withTime((Time) => {
      const actual$ = sinksFor(component, sourcesFor({}), state).DOM.take(1);
      const expected$ = Time.diagram("x")
        .map(() => view)
        .take(1);
      Time.assertEqual(actual$, expected$, assertLooksLike);
    }),
  ];
}
