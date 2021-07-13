import { MainDOMSource } from "@cycle/dom";
import { Stream } from "xstream";
import { notEmpty } from "../utilities/extentions";

export interface AnalyticsData {
  analyticsEventName: string;
  analyticsProperties: string;
}

export const analyticsData = (
  eventName: string,
  properties?: Record<string, string | number>
): AnalyticsData => ({
  analyticsEventName: eventName,
  analyticsProperties: JSON.stringify(properties),
});

interface Sources {
  DOM: MainDOMSource;
}

interface AnalyticsTrackSources {
  link: Element;
  eventName: string;
  properties?: Record<string, unknown>;
}

export const onClickAnalyticsElement$ = (
  sources: Sources
): Stream<AnalyticsTrackSources> =>
  sources.DOM.select("document")
    .events("click")
    .map((event) => event.target as HTMLElement)
    .map(findClosestAnalyticsElement)
    .filter(notEmpty)
    .map((element) => ({
      link: element.tagName === "a" ? element : undefined,
      eventName: `tap/${element.dataset.analyticsEventName || "unknown"}`,
      properties:
        element.dataset.analyticsProperties &&
        JSON.parse(element.dataset.analyticsProperties),
    }));

export const findClosestAnalyticsElement = (
  element: HTMLElement
): HTMLElement | null => {
  if (
    (element.tagName === "a" || element.tagName === "button") &&
    hasAnalyticsDataset(element)
  )
    return element;

  const candidateA = element.closest("a");
  if (hasAnalyticsDataset(candidateA)) return candidateA;

  const candidateButton = element.closest("button");
  if (hasAnalyticsDataset(candidateButton)) return candidateButton;

  return null;
};

const hasAnalyticsDataset = (element: HTMLElement | null): boolean =>
  !!(
    element?.dataset.analyticsEventName &&
    element?.dataset.analyticsEventName.length > 0
  );
