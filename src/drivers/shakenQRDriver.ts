import Certificate from "shaken-qr-reader/lib/data/certificate/certificate";
import KeiCertificate from "shaken-qr-reader/lib/data/certificate/keiCertificate";
import KeiOldCertificate from "shaken-qr-reader/lib/data/certificate/keiOldCertificate";
import { InvalidQRCode, ReadQRCode } from "shaken-qr-reader/lib/types";
import { Stream } from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { notEmpty } from "../utilities/extentions";

export const QrType = {
  Normal: "normal",
  Kei: "kei",
  KeiOld: "kei_old",
} as const;
type QrType = typeof QrType[keyof typeof QrType];
export type ShakenQRRequest = ShakenQRRefresh | ShakenQRPushImage;

interface ShakenQRRefresh {
  requestType: "refresh";
  qrType: QrType;
}

interface ShakenQRPushImage {
  requestType: "pushImage";
  image: ImageData;
}

export interface ShakenQRSource {
  certificate$: Stream<Certificate | KeiCertificate | KeiOldCertificate>;
  missingIndex$: Stream<number[]>;
}

export const makeShakenQRDriver = (
  stream: Stream<ShakenQRRequest>
): ShakenQRSource => {
  const certificate$ = Stream.create<
    Certificate | KeiCertificate | KeiOldCertificate
  >();
  const missingIndex$ = Stream.createWithMemory<number[]>();

  const source: ShakenQRSource = {
    certificate$,
    missingIndex$,
  };

  const library$ = () =>
    Stream.fromPromise(import("shaken-qr-reader")).map((m) => m.default);

  const reader$ = stream
    .filter(
      (request): request is ShakenQRRefresh => request.requestType === "refresh"
    )
    .map((request) => request.qrType)
    .filter(notEmpty)
    .map((qrType) =>
      library$().map((ShakenQRReader) => new ShakenQRReader(qrType))
    )
    .flatten();

  stream
    .filter(
      (request): request is ShakenQRPushImage =>
        request.requestType === "pushImage"
    )
    .filter((request) => !!request.image)
    .compose(sampleCombine(reader$))
    .filter(([_, reader]) => !reader.isCompleted)
    .addListener({
      next: ([pushImage, reader]) => {
        try {
          reader.push(pushImage.image);
        } catch (e) {
          if (!(e instanceof ReadQRCode || e instanceof InvalidQRCode)) {
            throw e;
          }
        } finally {
          missingIndex$.shamefullySendNext(reader.missingIndex);
        }
      },
    });

  stream
    .filter(
      (request): request is ShakenQRPushImage =>
        request.requestType === "pushImage"
    )
    .filter((request) => !!request.image)
    .compose(sampleCombine(reader$))
    .filter(([_, reader]) => reader.isCompleted)
    .map(([_, reader]) => reader.result)
    .filter(
      (certificate): certificate is Certificate | KeiCertificate =>
        !!certificate
    )
    .addListener({
      next: (value) => {
        certificate$.shamefullySendNext(value);
      },
    });

  return source;
};
