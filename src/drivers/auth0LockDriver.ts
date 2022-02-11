import { Stream } from "xstream";
import { Auth0Lock } from "auth0-lock";

export interface Auth0LockLogoutRequest {
  type: "logout";
  returnUri: string;
}

export interface Auth0LockLoginRequest {
  type: "login";
}

export interface Auth0LockTokenRequest {
  type: "token";
}

export type Auth0LockRequest =
  | Auth0LockLoginRequest
  | Auth0LockLogoutRequest
  | Auth0LockTokenRequest;
interface Props {
  domain: string;
  clientId: string;
  redirectUrl: string;
  audience: string;
  options?: Auth0LockConstructorOptions;
}

export interface Auth0LockSource {
  token$: Stream<string | null>;
}

export const makeAuth0LockDriver = (
  props: Props
): ((stream: Stream<Auth0LockRequest>) => Auth0LockSource) => {
  const lock = new Auth0Lock(props.clientId, props.domain, props.options);

  const source: Auth0LockSource = {
    token$: Stream.createWithMemory(),
  };

  return (stream): Auth0LockSource => {
    stream
      .filter((request) => request.type === "login")
      .addListener({ next: () => lock.show() });
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
