import { Reducer } from '@cycle/state';
import { Stream } from 'xstream';

export type ReducerDefinition<S> = { [key: string]: Stream<S[keyof S & string]> };

export const reducerFrom = <S>(definition: ReducerDefinition<S>) => (defaultState: S): Stream<Reducer<S>> => {
  const reducer$ = Stream.merge(
    ...Object.entries(definition).map(([key, value$]) => value$.map(reducerOf(key as keyof S & string)))
  );

  return Stream.merge(defaultReducerOf(defaultState), reducer$);
};

export const reducerOf = <S, K extends keyof S & string>(key: K) => (value: S[K]): Reducer<S> => (state: S) => ({
  ...state,
  [key]: value
});

export const defaultReducerOf = <S>(defaultState: S): Stream<Reducer<S>> =>
  Stream.of((state: S | undefined) => (typeof state === 'undefined' ? defaultState : state));
