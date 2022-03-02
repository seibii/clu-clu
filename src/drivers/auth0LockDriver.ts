import { Stream } from "xstream";
import { Auth0Lock } from "auth0-lock";

export interface Auth0LockLogoutRequest {
  type: "logout";
  returnUri: string;
}

export interface Auth0LockLoginRequest {
  type: "login";
  options?: Auth0LockShowOptions;
}

export interface Auth0LockTokenRequest {
  type: "token";
}

export interface Auth0LockHideRequest {
  type: "hide";
}

export type Auth0LockRequest =
  | Auth0LockLoginRequest
  | Auth0LockLogoutRequest
  | Auth0LockTokenRequest
  | Auth0LockHideRequest;

interface Props {
  domain: string;
  clientId: string;
  redirectUrl: string;
  audience: string;
  options?: Auth0LockConstructorOptions;
}

export interface Auth0SignEvent {
  action: "signin" | "signup";
  kind: string;
}

export interface Auth0ShowEvent {
  action: "show";
  kind: "signin" | "signup";
}

export interface Auth0OtherEvent {
  action: "hide" | "authenticated";
}

export type Auth0Event = Auth0ShowEvent | Auth0SignEvent | Auth0OtherEvent;

export interface Auth0LockSource {
  token$: Stream<string | null>;
  event$: Stream<Auth0Event>;
}

export const makeAuth0LockDriver = (
  props: Props
): ((stream: Stream<Auth0LockRequest>) => Auth0LockSource) => {
  const lock = new Auth0Lock(props.clientId, props.domain, props.options);

  const source: Auth0LockSource = {
    token$: Stream.createWithMemory(),
    event$: Stream.create(),
  };
  setLockEventListener(lock, source);

  return (stream): Auth0LockSource => {
    stream
      .filter(
        (request): request is Auth0LockLoginRequest => request.type === "login"
      )
      .addListener({ next: (request) => lock.show(request.options) });
    stream
      .filter(
        (request): request is Auth0LockLoginRequest => request.type === "hide"
      )
      .addListener({ next: (_) => lock.hide() });
    stream
      .filter((request) => request.type === "token")
      .addListener({
        next: () =>
          lock.on("authenticated", (authResult) => {
            if (authResult.idToken)
              source.token$.shamefullySendNext(authResult.idToken);
          }),
      });

    stream
      .filter((request) => request.type === "logout")
      .addListener({
        next: (request: Auth0LockLogoutRequest) =>
          lock.logout({ returnTo: request.returnUri }),
      });

    return source;
  };
};

const setLockEventListener = (lock: Auth0LockCore, source: Auth0LockSource) => {
  lock.on("hide", () => {
    source.event$.shamefullySendNext({ action: "hide" });
  });
  lock.on("signin ready", () => {
    source.event$.shamefullySendNext({ action: "show", kind: "signin" });
  });
  lock.on("signup ready", () => {
    source.event$.shamefullySendNext({ action: "show", kind: "signup" });
  });
  lock.on("signin submit", () => {
    source.event$.shamefullySendNext({ action: "signin", kind: "email" });
  });
  lock.on("signup submit", () => {
    source.event$.shamefullySendNext({ action: "signup", kind: "email" });
  });
  lock.on("federated login", (result) => {
    source.event$.shamefullySendNext({
      action: result.action,
      kind: result.name,
    });
  });
  lock.on("authenticated", () => {
    source.event$.shamefullySendNext({ action: "authenticated" });
  });
};
