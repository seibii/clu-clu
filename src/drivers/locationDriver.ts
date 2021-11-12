import { Stream } from "xstream";

export interface LocationRedirectRequest {
  type: "redirect";
  redirectUrl: string;
}

export interface LocationReloadRequest {
  type: "reload";
}

export type LocationRequest = LocationRedirectRequest | LocationReloadRequest;

export interface LocationSource {
  href$: Stream<string>;
}

export const makeLocationDriver =
  () =>
  (stream: Stream<LocationRequest>): LocationSource => {
    const source: LocationSource = {
      href$: Stream.create()
    };

    stream
      .filter((request) => request.type === "redirect")
      .addListener({
        next: (request: LocationRedirectRequest) => {
          source.href$.shamefullySendNext(request.redirectUrl);
          window.location.href = request.redirectUrl;
        },
      });

    stream
      .filter((request) => request.type === "reload")
      .addListener({
        next: () => {
          window.location.reload();
        },
      });

    return source;
  };
