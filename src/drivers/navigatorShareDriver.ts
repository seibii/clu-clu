import { Stream } from "xstream";

export interface NavigatorShareRequest {
  selector: string;
  title: string;
  url: string;
}

export const makeNavigatorShareDriver = (
  stream: Stream<NavigatorShareRequest>
): void => {
  stream.addListener({
    next: (request) => {
      const shareButton = document.querySelector(request.selector);
      if (shareButton) {
        if (navigator.share !== undefined) {
          void navigator.share({ title: request.title, url: request.url });
        } else {
          alert("ご使用中の端末では「その他の共有」はご利用いただけません。");
        }
      }
    },
  });
};
