import { Stream } from "xstream";
import { PageEvent } from "../../drivers/pageEventDriver";

export interface MockPageEventSource {
  event$?: Stream<PageEvent>;
}

export const mockPageEventSource = (source: {
  event$?: Stream<PageEvent>;
}): MockPageEventSource => ({
  event$: source.event$ || Stream.never(),
});
