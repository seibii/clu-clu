import { Stream } from 'xstream';

export type CanvasRequest = DistributesToCanvasRequest;

export interface CanvasContext {
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
}

interface DistributesToCanvasRequest {
  srcVideo: HTMLVideoElement;
  targetContext: CanvasContext;
  width: number;
  height: number;
}

export const makeCanvasDriver = (stream: Stream<CanvasRequest>): void => {
  stream.addListener({
    next: (request) => {
      request.targetContext.drawImage(request.srcVideo, 0, 0, request.width, request.height);
    }
  });
};
