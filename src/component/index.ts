import {
  DOMSinks,
  Intent,
  Model,
  Sinks,
  StatefulSinks,
  StatefulSources,
  View,
} from "./types";
import { mergeSinks } from "cyclejs-utils";
import { Stream } from "xstream";
import { Reducer } from "@cycle/state";
import { VNode } from "@cycle/dom";

export * from "./types";

export function mergeStatefulSinks<
  BaseState,
  BaseSinks extends StatefulSinks<BaseState>
>(base: BaseSinks, overriders: [Sinks, ...Sinks[]]): BaseSinks {
  const overrider = mergeSinks(overriders);
  return {
    ...mergeSinks([base, overrider]),
    state: (overrider.state
      ? Stream.merge(overrider.state, base.state)
      : base.state) as Stream<Reducer<BaseState>>,
  };
}

export function mergeStatefulSinksAndDOM<
  BaseState,
  BaseSinks extends StatefulSinks<BaseState>
>(
  base: BaseSinks,
  overriders: [any, ...any[]],
  dom: Stream<VNode>
): BaseSinks & DOMSinks {
  return {
    ...mergeStatefulSinks(base, overriders),
    DOM: dom,
  };
}

export function mergeStreamSinks<AppSinks>(
  app: AppSinks,
  page$: Stream<AppSinks>
): AppSinks {
  return Object.keys(app)
    .map((key: string): [string, Stream<unknown>] => [
      key,
      Stream.merge(
        app[key],
        page$.map((pageSinks) => pageSinks[key]).flatten()
      ),
    ])
    .reduce(
      (acc, [key, val]) => Object.assign(acc, { [key]: val }),
      {}
    ) as AppSinks;
}

export function composeSinks<
  State,
  Sinks extends DOMSinks & StatefulSinks<State>
>(fillSinks: (optional: Partial<Sinks>) => Sinks) {
  return function <Action, ModelResult extends Sinks>(
    intent: Intent<Action, State>,
    model: Model<Action, ModelResult>,
    view: View<State>
  ) {
    return function (sources: StatefulSources<State>): Sinks {
      const actions = intent(sources);
      const streams = model(actions);
      const view$ = view(sources.state.stream);

      return fillSinks({
        ...streams,
        DOM: view$,
      });
    };
  };
}
