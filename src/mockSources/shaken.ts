import { Stream } from "xstream";
import Certificate from "shaken-qr-reader/lib/data/certificate/certificate";
import KeiCertificate from "shaken-qr-reader/lib/data/certificate/keiCertificate";
import KeiOldCertificate from "shaken-qr-reader/lib/data/certificate/keiOldCertificate";

export interface MockShakenQRSource {
  certificate$: Stream<Certificate | KeiCertificate | KeiOldCertificate>;
  missingIndex$: Stream<number[]>;
}

export const mockShakenQRSource = (
  certificate$: Stream<Certificate | KeiCertificate | KeiOldCertificate>,
  missingIndex$: Stream<number[]>
): MockShakenQRSource => ({ certificate$, missingIndex$ });
