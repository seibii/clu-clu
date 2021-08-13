import * as Sentry from "@sentry/browser";
import { Stream } from "xstream";
import { BrowserOptions } from "@sentry/browser/dist/backend";

export type SentryRequest =
  | SentryCaptureMessageRequest
  | SentryCaptureExceptionRequest
  | SentryIdentifyingUserRequest;

export interface SentryCaptureExceptionRequest {
  type: "exception";
  error: unknown;
}

export interface SentryCaptureMessageRequest {
  type: "message";
  level: "Fatal" | "Error" | "Warning" | "Info";
  message: string;
}

export interface SentryIdentifyingUserRequest {
  type: "identify";
  id: number;
  username: string;
  email: string;
}

export interface Props extends BrowserOptions {
  sendFlg: boolean;
  errorCatcher?: (error: Error) => boolean; // not send error to sentry if return value is true
}

export const makeSentryDriver = (
  props: Props
): ((stream: Stream<SentryRequest>) => void) => {
  if (!props.sendFlg)
    return (stream) => {
      stream.addListener({
        next: (request: SentryRequest) => {
          console.log(request);
        },
      });
    };

  initialize(props);

  return (stream) => {
    stream.addListener({
      next: (request: SentryRequest) => {
        switch (request.type) {
          case "message":
            Sentry.captureMessage(
              request.message,
              Sentry.Severity[request.level]
            );
            break;
          case "exception":
            Sentry.captureException(request.error);
            break;
          case "identify":
            Sentry.setUser({
              id: request.id.toString(),
              email: request.email,
              username: request.username,
            });
            break;
        }
      },
    });
  };
};
export const errorReporter =
  (sendFlg: boolean) =>
  (err: Error): void => {
    console.error(err);
    if (sendFlg) {
      Sentry.captureException(err);
    }
  };

const initialize = (props: Props): void => {
  Sentry.init(props);

  window.onerror = function (message, source, lineno, colno, error) {
    if (props.errorCatcher && error && props.errorCatcher(error)) return;
    Sentry.captureException(error);
  };
  window.addEventListener("unhandledrejection", function (event) {
    Sentry.captureMessage(
      `WARNING: Unhandled promise rejection. Shame on you! Reason: ${JSON.stringify(
        event.reason
      )}`,
      Sentry.Severity.Warning
    );
  });
};
