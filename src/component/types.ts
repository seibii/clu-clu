import { Reducer, StateSource } from "@cycle/state";
import { Stream } from "xstream";
import { VNode } from "@cycle/dom";

export interface StatefulSources<State> {
  state: StateSource<State>;
}

export type Sinks = { [key: string]: Stream<any> };
export interface StatefulSinks<State> {
  state: Stream<Reducer<State>>;
}

export type Intent<Actions, State> = (
  sources: StatefulSources<State>
) => Actions;

export type View<S> = (state$: Stream<S>) => Stream<VNode>;
