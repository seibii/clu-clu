interface StateIsolator<S, T> {
  get: (state: T) => S | undefined;
  set: (state: T, childState: S) => T;
}

export const distributeLens = <ChildState, ParentState extends { [s: string]: ChildState }>(
  stateName: string,
  key: string & keyof ChildState
): StateIsolator<ChildState, ParentState> => ({
  get: (state: ParentState): ChildState | undefined => state[stateName] && { ...state[stateName], [key]: state[key] },
  set: (state: ParentState, childState: ChildState): ParentState => {
    const { [key]: _parent, ...childExceptParent } = childState; // eslint-disable-line @typescript-eslint/no-unused-vars
    return { ...state, [stateName]: childExceptParent };
  }
});

export const distributeLensForKeys = <
  ChildState extends { [s: string]: unknown },
  ParentState extends { [s: string]: ChildState }
>(
  stateName: string,
  ...keys: string[]
): StateIsolator<ChildState, ParentState> => ({
  get: (state: ParentState): ChildState => {
    const objects = keys.reduce((acc, key) => ({ ...acc, [key]: state?.[key] }), {});
    return state[stateName] && { ...state[stateName], ...objects };
  },
  set: (state: ParentState, childState: ChildState): ParentState => {
    const childExceptParent =
      childState &&
      keys.reduce((acc, key) => {
        const { [key]: _parent, ...accExceptParent } = acc; // eslint-disable-line @typescript-eslint/no-unused-vars
        return accExceptParent;
      }, childState);
    return { ...state, [stateName]: childExceptParent };
  }
});
