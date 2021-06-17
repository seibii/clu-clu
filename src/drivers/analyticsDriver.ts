import * as analyticsCore from "@segment/analytics.js-core";
import * as SegmentIntegration from "@segment/analytics.js-integration-segmentio";
import { Stream } from "xstream";
import { SegmentAnalytics } from "@segment/analytics.js-core";

export type AnalyticsRequest =
  | AnalyticsPageRequest
  | AnalyticsTrackRequest
  | AnalyticsTrackLinkRequest
  | AnalyticsIdentifyRequest;

export interface AnalyticsPageRequest {
  type: 'page';
}

export interface AnalyticsTrackRequest {
  type: 'track';
  eventName: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsTrackLinkRequest {
  type: 'track_link';
  link: Element;
  eventName: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsIdentifyRequest {
  type: 'identify';
  userId: number;
}

export interface AnalyticsSource {
  anonymousId$: Stream<string>;
}

declare global {
  interface Window {
    gtag?: Gtag.Gtag;
  }
}

interface SegmentUser {
  anonymousId: () => string;
}

const analytics: SegmentAnalytics.AnalyticsJS =
  analyticsCore as unknown as SegmentAnalytics.AnalyticsJS;

const gaTrackingID: string = process.env.gaTrackingID || "";

export const makeAnalyticsDriver = (apiKey: string, sendFlg: boolean): ((stream: Stream<AnalyticsRequest>) => void) => {
  initialize(apiKey);

  return (stream: Stream<AnalyticsRequest>): AnalyticsSource => {
    const sources: AnalyticsSource = {
      anonymousId$: Stream.createWithMemory()
    };

    const user = analytics.user() as SegmentUser;
    sources.anonymousId$.shamefullySendNext(user.anonymousId());

    stream.addListener({
      next: (request) => {
        if (!sendFlg) return;

        switch (request.type) {
          case 'page':
            analytics.page();
            window.gtag &&
              window.gtag('event', 'page_view', {
                page_title: window.location.pathname,
                page_location: window.location.href,
                page_path: window.location.pathname,
                send_to: gaTrackingID
              });
            break;
          case 'track':
            analytics.track(request.eventName, request.properties);
            window.gtag &&
              window.gtag('event', request.eventName, {
                event_category: 'All',
                event_label: 'event'
              });
            break;
          case 'track_link':
            analytics.trackLink(request.link, request.eventName, request.properties);
            window.gtag &&
              window.gtag('event', request.eventName, {
                event_category: 'All',
                event_label: 'event'
              });
            break;
          case 'identify':
            analytics.identify(`${request.userId}`);
            window.gtag && window.gtag('config', gaTrackingID, { user_id: request.userId });
            break;
        }
      }
      // TODO: error: (error) => {}
    });

    return sources;
  };
};

const initialize = (apiKey: string) => {
  analytics.use(SegmentIntegration);
  analytics.initialize({
    'Segment.io': {
      apiKey,
      retryQueue: true,
      addBundleMetadata: true
    }
  });
};
