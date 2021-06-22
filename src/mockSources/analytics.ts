import { Stream } from "xstream";
import { AnalyticsSource } from "../drivers/analyticsDriver";

export const mockAnalyticsSource = (source: {
  anonymousId$?: Stream<string>;
}): AnalyticsSource => ({
  anonymousId$: source.anonymousId$ || Stream.never(),
});
