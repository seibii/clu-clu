import { Stream } from "xstream";
import { SentryRequest } from "../../drivers/sentryDriver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentSentryCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<SentryRequest>;
}

export function aComponentSentry<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentSentryCondition<State>,
  timeInterval?: number
): [string, () => Promise<boolean>] {
  return [
    "should sentry",
    withTime((Time: MockTimeSource) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).sentry;

      Time.assertEqual(actual$, expected$);
    }, (timeInterval && { interval: timeInterval }) || undefined),
  ];
}
