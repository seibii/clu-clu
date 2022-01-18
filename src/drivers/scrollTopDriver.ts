import { Stream } from "xstream";

export interface ScrollTopRequest {
  position: number;
  selector: "window" | string;
}

export const scrollTopDriver = (stream: Stream<ScrollTopRequest>): void => {
  stream.addListener({
    next: (request) => {
      if (request.selector === "window") {
        window.scroll({ top: request.position });
        return;
      }

      const selector = document.querySelector(request.selector);
      if (selector) {
        selector.scrollTop = request.position;
      }
    },
  });
};
