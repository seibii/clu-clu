import { Stream } from "xstream";

export interface PageEvent {
  type: "focus" | "blur" | "exit";
}

export interface PageEventSource {
  event$: Stream<PageEvent>;
}

export const makePageEventDriver = (): PageEventSource => {
  const sources: PageEventSource = {
    event$: Stream.create(),
  };

  window.addEventListener("focus", () => {
    sources.event$.shamefullySendNext({ type: "focus" });
  });

  window.addEventListener("blur", () => {
    sources.event$.shamefullySendNext({ type: "blur" });
  });

  window.addEventListener("beforeunload", () => {
    sources.event$.shamefullySendNext({ type: "exit" });
  });

  return sources;
};
