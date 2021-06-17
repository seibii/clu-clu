import { Stream } from 'xstream';

export type MediaRequest = GetMedia | CloseMedia;

export interface GetMedia extends MediaProps {
  type: 'get';
}

export interface MediaProps {
  audio: boolean;
  video: {
    width: number;
    height: number;
    facingMode: string;
  };
}

export interface CloseMedia {
  type: 'close';
  stream: MediaStream;
}

export interface MediaDevicesSource {
  userMedia$: Stream<MediaStream>;
}

export const makeMediaDevicesDriver = (stream: Stream<MediaRequest>): MediaDevicesSource => {
  const source: MediaDevicesSource = {
    userMedia$: Stream.create()
  };

  setViewport();

  stream
    .filter((request): request is GetMedia => request.type === 'get')
    .map((request) => navigator.mediaDevices.getUserMedia(request))
    .map((mediaPromise) => Stream.fromPromise(mediaPromise))
    .flatten()
    .addListener({
      next: (mediaStream) => source.userMedia$.shamefullySendNext(mediaStream),
      error: (err: MediaStreamError) => console.log(`${err.name}:${err.message || ''}`)
    });

  stream
    .filter((request): request is CloseMedia => request.type === 'close')
    .addListener({
      next: (request) => request.stream.getTracks().forEach((track) => track.stop())
    });

  return source;
};

const setViewport = () => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh.toString() + 'px');
  };

  window.addEventListener('resize', setVH);
  setVH();
};
