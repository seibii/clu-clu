import { Stream } from 'xstream';
import { VNode } from '@cycle/dom';

export interface FlashRequest {
  type: 'success' | 'error';
  message: string | VNode;
  iconSrc?: string;
  linkTo?: string;
  pathName?: string;
}

export interface FlashSource {
  stream$: Stream<FlashRequest>;
}

export const makeFlashDriver = (): ((stream: Stream<FlashRequest>) => FlashSource) => {
  return (stream: Stream<FlashRequest>): FlashSource => {
    const source: FlashSource = {
      stream$: Stream.create()
    };

    stream.addListener({
      next: (flash) => source.stream$.shamefullySendNext(flash)
    });

    return source;
  };
};
