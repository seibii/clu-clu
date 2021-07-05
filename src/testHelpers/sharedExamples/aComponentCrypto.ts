import { Stream } from "xstream";
import { CryptoRequest } from "../../drivers/cryptoDriver";
import { MockTimeSource } from "@cycle/time";
import { withTime } from "cyclejs-test-helpers";
import { sinksFor, StatefulComponent } from "../component";
import { StatefulSources } from "../../component";

export interface AComponentCryptoCondition<State> {
  sources: StatefulSources<State>;
  expected$: Stream<CryptoRequest>;
}

export function aComponentCrypto<State>(
  component: StatefulComponent<State>,
  initialState: State,
  condition: (Time: MockTimeSource) => AComponentCryptoCondition<State>
): [string, () => Promise<boolean>] {
  return [
    "should request crypto",
    withTime((Time) => {
      const { sources, expected$ } = condition(Time);
      const actual$ = sinksFor(component, sources, initialState).crypto;
      Time.assertEqual(actual$, expected$);
    }),
  ];
}
