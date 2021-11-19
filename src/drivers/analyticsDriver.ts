import { Stream } from "xstream";
import {
  Analytics,
  AnalyticsBrowser,
  JSONValue,
} from "@segment/analytics-next/dist/umd";
import { notEmpty } from "../utilities/extentions";

export type AnalyticsRequest =
  | AnalyticsPageRequest
  | AnalyticsTrackRequest
  | AnalyticsTrackLinkRequest
  | AnalyticsIdentifyRequest;

export interface AnalyticsPageRequest {
  type: "page";
}

export interface AnalyticsTrackRequest {
  type: "track";
  eventName: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsTrackLinkRequest {
  type: "track_link";
  link: Element;
  eventName: string;
  properties?: Record<string, JSONValue>;
}

export interface AnalyticsIdentifyRequest {
  type: "identify";
  userId: number;
}

export interface AnalyticsSource {
  anonymousId$: Stream<string>;
}

declare global {
  interface Window {
    gtag?: Gtag.Gtag;
    clarity?: { (action: string, key: string, value: string): void };
  }
}

export const makeAnalyticsDriver = (
  apiKey: string,
  sendFlg: boolean,
  gaTrackingIDs?: string[]
): ((stream: Stream<AnalyticsRequest>) => void) => {
  const initialized$ = initialize(apiKey);

  return (stream: Stream<AnalyticsRequest>): AnalyticsSource => {
    const sources: AnalyticsSource = {
      anonymousId$: Stream.createWithMemory(),
    };

    initialized$
      .map((analytics) => analytics.user().anonymousId())
      .filter(notEmpty)
      .addListener({
        next: (anonymousId) => {
          sources.anonymousId$.shamefullySendNext(anonymousId);
          if (!window.clarity) return;
          window.clarity("set", "segmentAnonymousId", anonymousId);
        },
      });

    Stream.combine(stream, initialized$).addListener({
      next: ([request, analytics]) => {
        if (!sendFlg) return;

        switch (request.type) {
          case "page":
            void analytics.page();
            window.gtag &&
              window.gtag("event", "page_view", {
                page_title: window.location.pathname,
                page_location: window.location.href,
                page_path: window.location.pathname,
              });
            break;
          case "track":
            void analytics.track(request.eventName, request.properties);
            window.gtag &&
              window.gtag("event", request.eventName, {
                event_category: "All",
                event_label: "event",
              });
            break;
          case "track_link":
            void analytics.trackLink(
              request.link,
              request.eventName,
              request.properties
            );
            window.gtag &&
              window.gtag("event", request.eventName, {
                event_category: "All",
                event_label: "event",
              });
            break;
          case "identify":
            void analytics.identify(`${request.userId}`);
            window.gtag &&
              gaTrackingIDs?.forEach((trackingId) =>
                window.gtag("config", trackingId, { user_id: request.userId })
              );
            break;
        }
      },
      // TODO: error: (error) => {}
    });

    return sources;
  };
};

const initialize = (apiKey: string): Stream<Analytics> =>
  Stream.fromPromise(
    AnalyticsBrowser.load({ writeKey: apiKey }, { retryQueue: true })
  ).map(([analytics, _]) => analytics);
