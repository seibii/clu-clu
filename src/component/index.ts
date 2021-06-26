import { Sinks, StatefulSinks } from "./types";
import { mergeSinks } from "cyclejs-utils";
import { Stream } from "xstream";
import { Reducer } from "@cycle/state";

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
