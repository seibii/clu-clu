export type Modifiers = { [key: string]: boolean };

export const bem = (
  block: string,
  element: string | null,
  modifiers: Modifiers = {}
): string =>
  withModifier(`.${[block, element].filter((e) => e).join("__")}`, modifiers);

const withModifier = (base: string, modifiers: Modifiers): string =>
  Object.keys(modifiers)
    .filter((key) => modifiers[key])
    .reduce((acc, modifier) => acc + `${base}--${modifier}`, base);
