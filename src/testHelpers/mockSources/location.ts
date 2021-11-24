import { Stream } from "xstream";

export interface MockLocationSource {
  href$?: Stream<string>;
}

export const mockLocationSource = (source: {
  href$?: Stream<string>;
}): MockLocationSource => ({
  href$: source.href$ || Stream.never(),
});
