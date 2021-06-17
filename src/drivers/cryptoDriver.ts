import { Stream } from "xstream";
import { SelectableStream } from "../utilities/selectableStream";

export type CryptoRequest = CryptoDigestRequest;

export interface CryptoDigestRequest {
  type: "digest";
  algorithm: "SHA-1";
  name: string;
  data: Uint8Array;
}

export interface CryptoSource {
  digested$: SelectableStream<ArrayBuffer>;
}

export const cryptoDriver = (stream: Stream<CryptoRequest>): CryptoSource => {
  const source: CryptoSource = {
    digested$: new SelectableStream<ArrayBuffer>(),
  };

  stream
    .filter((request) => request.type === "digest")
    .addListener({
      next: (digest) => {
        window.crypto &&
          window.crypto.subtle
            .digest(digest.algorithm, digest.data)
            .then((response) => {
              source.digested$.shamefullySendNext([digest.name, response]);
            });
      },
    });

  return source;
};
