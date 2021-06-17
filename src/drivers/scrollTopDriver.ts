import { Stream } from 'xstream';

export interface ScrollTopRequest {
  position: number;
  selector: string;
}

export interface ScrollTopModel {
  scrollTop$?: Stream<ScrollTopRequest>;
}

export const scrollTopDriver = (stream: Stream<ScrollTopRequest>): void => {
  stream.addListener({
    next: (request) => {
      const selector = document.querySelector(request.selector);
      if (selector) {
        selector.scrollTop = request.position;
      }
    }
  });
};
