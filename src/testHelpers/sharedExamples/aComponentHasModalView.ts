import { VNode } from "@cycle/dom";
import { withTime } from "cyclejs-test-helpers";
import { assertLooksLike } from "snabbdom-looks-like";
import {
  mockModalActionsSource,
  MockModalActionsStream,
} from "../mockSources/modalActions";
import { Stream } from "xstream";
import { sinksFor, StatefulComponent } from "../component";

export function aComponentHasModalView(sourcesFor: (props: any) => unknown) {
  return <State>(
    component: StatefulComponent<State>,
    state: State,
    modalName: string,
    props: unknown,
    view: VNode
  ): [string, () => Promise<boolean>] => [
    "should render the view",
    withTime((Time) => {
      const actual$ = sinksFor(
        component,
        sourcesFor({
          modalActions: mockModalActionsSource({
            props$: new MockModalActionsStream({
              [modalName]: Stream.of(props),
            }),
          }),
        }),
        state
      ).modalDOM.take(1);
      const expected$ = Time.diagram("x")
        .map(() => view)
        .take(1);
      Time.assertEqual(actual$, expected$, assertLooksLike);
    }),
  ];
}
