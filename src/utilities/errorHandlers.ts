import { Response, HTTPSource } from "@cycle/http";
import { Stream } from "xstream";
import { FlashRequest } from "../drivers/flashDriver";
import { isError } from "./extentions";

export interface Error {
  type:
    | "clientError"
    | "serverError"
    | "networkError"
    | "unauthorizedError"
    | "unknownError";
  title: string;
  message: string;
}

interface HttpSource {
  HTTP: HTTPSource
}

export const errorsFlash$ = (
  stream: Stream<unknown>,
  message?: string
): Stream<FlashRequest> =>
  stream.filter(isError).map(mapErrorToFlashRequest(message));

export const pageError$ = (stream: Stream<unknown>): Stream<Error> =>
  stream.filter(isError).map(pageErrorHandler);

export const pageErrorHandler = (error: unknown): Error => {
  const response = (error as { response?: Response }).response;

  if (response?.status) {
    switch (response?.status) {
      case 400:
        return {
          type: "clientError",
          title: "400 Bad Request",
          message: "不正なアクセスです。",
        };
      case 401:
        return {
          type: "unauthorizedError",
          title: "401 Unauthorized",
          message: "認証が必要です。ログイン後再度お試しください",
        };
      case 403:
        return {
          type: "clientError",
          title: "403 Forbidden",
          message: "閲覧権限がありません。",
        };
      case 404:
        return {
          type: "clientError",
          title: "404 Not Found",
          message: "指定されたページは見つかりません。",
        };
      case 500:
        return {
          type: "serverError",
          title: "500 Internal Server Error",
          message:
            "サーバーでエラーが起きました。時間をおいて再度お試しください",
        };
      case 503:
        return {
          type: "serverError",
          title: "503 Service Unavailable",
          message:
            "現在アクセスしづらい状況です。時間をおいて再度お試しください",
        };
      default:
        return {
          type: "unknownError",
          title: "不明なエラーです",
          message: "時間をおいて再度お試しください。",
        };
    }
  } else if (!response || !window.navigator.onLine) {
    return {
      type: "networkError",
      title: "ネットワークに接続されていません",
      message: "通信環境をご確認のうえ、再度お試しください",
    };
  } else {
    return {
      type: "unknownError",
      title: "不明なエラーです",
      message: "時間をおいて再度お試しください。",
    };
  }
};

export const onRequestErrorIntent = (sources: HttpSource, ...categories: string[]): Stream<Error> => {
  const errorStreams = categories.map((category) =>
    sources.HTTP.select(category)
      .map((response) => response.replaceError((error) => Stream.of(error)))
      .flatten()
  );
  return pageError$(Stream.merge(...errorStreams));
};

const mapErrorToFlashRequest =
  (defaultMessage?: string) =>
  (error: unknown): FlashRequest => {
    const message = defaultMessage || errorToMessage(error);
    return { type: "error", message } as FlashRequest;
  };

const errorToMessage = (error: unknown): string => {
  const response = (error as { response?: Response }).response;
  if (!response) return "不明なエラーが発生しました。";

  const parseResponse = JSON.parse(response.text);
  const errorMessages = Array.isArray(parseResponse.errors)
    ? parseResponse.errors?.join("\n")
    : parseResponse.errors;
  return errorMessages;
};
