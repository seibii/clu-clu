import { Stream } from "xstream";
import { MediaQueryMatch } from "../drivers/mediaQueryDriver";
import Certificate from "shaken-qr-reader/lib/data/certificate/certificate";
import KeiCertificate from "shaken-qr-reader/lib/data/certificate/keiCertificate";
import KeiOldCertificate from "shaken-qr-reader/lib/data/certificate/keiOldCertificate";
import { AnalyticsSource } from "../drivers/analyticsDriver";

export interface MockMediaQuerySource {
  matches$: Stream<MediaQueryMatch>;
}

export interface MockMediaDevicesSource {
  userMedia$: Stream<MediaStream>;
}

export interface MockShakenQRSource {
  certificate$: Stream<Certificate | KeiCertificate | KeiOldCertificate>;
  missingIndex$: Stream<number[]>;
}

export const mockMediaQuerySource = (
  matches$: Stream<MediaQueryMatch>
): MockMediaQuerySource => ({ matches$ });

export const mockShakenQRSource = (
  certificate$: Stream<Certificate | KeiCertificate | KeiOldCertificate>,
  missingIndex$: Stream<number[]>
): MockShakenQRSource => ({ certificate$, missingIndex$ });

export const mockAnalyticsSource = (source: {
  anonymousId$?: Stream<string>;
}): AnalyticsSource => ({
  anonymousId$: source.anonymousId$ || Stream.never(),
});
