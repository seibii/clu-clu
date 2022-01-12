import { Stream } from "xstream";
import { Auth0Lock } from "auth0-lock";

export interface Auth0LockLogoutRequest {
  type: "logout";
  returnUri?: string;
}

export interface Auth0LockLoginRequest {
  type: "login";
}

export type Auth0LockRequest = Auth0LockLoginRequest | Auth0LockLogoutRequest;
interface Props {
  domain: string;
  clientId: string;
  redirectUrl: string;
  audience: string;
  options?: Auth0LockConstructorOptions;
}

export const makeAuth0LockDriver = (
  props: Props
): ((stream: Stream<Auth0LockRequest>) => void) => {
  const lock = new Auth0Lock(props.clientId, props.domain, props.options);
  lock.on("authenticated", (_authResult) => {
    window.location.reload();
  });

  return (stream) => {
    stream.addListener({
      next: (request: Auth0LockRequest) => {
        switch (request.type) {
          case "login":
            lock.show();
            break;
        }
      },
    });
  };
};
