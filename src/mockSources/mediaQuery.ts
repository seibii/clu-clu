import { Stream } from "xstream";
import { MediaQueryMatch } from "../drivers/mediaQueryDriver";

export interface MockMediaQuerySource {
  matches$: Stream<MediaQueryMatch>;
}

export const mockMediaQuerySource = (
  matches$: Stream<MediaQueryMatch>
): MockMediaQuerySource => ({ matches$ });
