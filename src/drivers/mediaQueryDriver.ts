import { Stream } from "xstream";

export interface MediaQuery {
  tag: string;
  expression: string;
}

export interface MediaQueryMatch {
  mediaQuery: MediaQuery;
  matched: boolean;
}

export interface MediaQuerySource {
  matches$: Stream<MediaQueryMatch>;
}

export const makeMediaQueryDriver = (mediaQueries: MediaQuery[]) => {
  return (): MediaQuerySource => {
    const sources: MediaQuerySource = {
      matches$: Stream.create(),
    };

    window.addEventListener("DOMContentLoaded", () => {
      mediaQueries.forEach((mediaQuery) => {
        const mediaQueryList = window.matchMedia(mediaQuery.expression);
        sources.matches$.shamefullySendNext({
          mediaQuery,
          matched: mediaQueryList.matches,
        });

        if (mediaQueryList.addEventListener) {
          // chrome, firefox
          mediaQueryList.addEventListener("change", (e) => {
            sources.matches$.shamefullySendNext({
              mediaQuery,
              matched: e.matches,
            });
          });
        } else if (mediaQueryList.addListener) {
          // safari
          mediaQueryList.addListener((e) => {
            sources.matches$.shamefullySendNext({
              mediaQuery,
              matched: e.matches,
            });
          });
        }
      });
    });

    return sources;
  };
};
