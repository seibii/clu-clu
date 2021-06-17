import { Stream } from 'xstream';

export interface LocationRedirectRequest {
  type: 'redirect';
  redirectUrl: string;
}

export interface LocationReloadRequest {
  type: 'reload';
}

export type LocationRequest = LocationRedirectRequest | LocationReloadRequest;

export const makeLocationDriver = () => (stream: Stream<LocationRequest>): void => {
  stream
    .filter((request) => request.type === 'redirect')
    .addListener({
      next: (request: LocationRedirectRequest) => {
        window.location.href = request.redirectUrl;
      }
    });

  stream
    .filter((request) => request.type === 'reload')
    .addListener({
      next: () => {
        window.location.reload();
      }
    });
};
