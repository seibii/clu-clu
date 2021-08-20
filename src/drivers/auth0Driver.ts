import { Auth0Client } from "@auth0/auth0-spa-js";
import { Stream } from "xstream";

export const emailConnection = "Username-Password-Authentication";
export const twitterConnection = "twitter";
export const facebookConnection = "facebook";
export const googleConnection = "google-oauth2";
export const lineConnection = "line";

export interface Auth0TokenRequest {
  type: "token";
}

export interface Auth0LogoutRequest {
  type: "logout";
  returnUri?: string;
}

export interface Auth0LoginRequest {
  type: "login";
  connection: string;
}

export interface Auth0CallbackRequest {
  type: "callback";
}

export type Auth0Request =
  | Auth0TokenRequest
  | Auth0LoginRequest
  | Auth0LogoutRequest
  | Auth0CallbackRequest;

export interface Auth0Source {
  token$: Stream<string>;
  login$: Stream<null>;
  logout$: Stream<null>;
  requiredLogin$: Stream<null>;
  appState$: Stream<any>;
}

export interface Props {
  domain: string;
  clientId: string;
  redirectUrl: string;
  audience: string;
  useRefreshTokens: boolean;
}

export const makeAuth0Driver = (
  props: Props
): ((stream: Stream<Auth0Request>) => Auth0Source) => {
  const client = new Auth0Client({
    domain: props.domain,
    client_id: props.clientId,
    redirect_uri: props.redirectUrl,
    audience: props.audience,
    useRefreshTokens: props.useRefreshTokens,
  });

  return (stream: Stream<Auth0Request>): Auth0Source => {
    const source: Auth0Source = {
      token$: Stream.createWithMemory(),
      login$: Stream.create(),
      logout$: Stream.create(),
      requiredLogin$: Stream.createWithMemory(),
      appState$: Stream.createWithMemory()
    };

    stream
      .filter((request) => request.type === "token")
      .map(() => Stream.fromPromise(client.getTokenSilently()))
      .flatten()
      .map(() => Stream.fromPromise(client.getIdTokenClaims()))
      .flatten()
      .addListener({
        next: (token) => source.token$.shamefullySendNext(token.__raw),
        error: () => source.requiredLogin$.shamefullySendNext(null),
      });

    stream
      .filter((request) => request.type === "login")
      .map((request: Auth0LoginRequest) =>
        Stream.fromPromise(
          client.loginWithRedirect({ connection: request.connection })
        )
      )
      .flatten()
      .addListener({
        next: () => source.login$.shamefullySendNext(null),
        // TODO: error: () => source.requiredLogin$.shamefullySendNext(null)
      });

    stream
      .filter(
        (request): request is Auth0LogoutRequest => request.type === "logout"
      )
      .addListener({
        next: (request) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          client.logout({
            returnTo: request.returnUri
              ? `${props.redirectUrl}${request.returnUri}`
              : props.redirectUrl,
          });
          source.logout$.shamefullySendNext(null);
        },
        // TODO: error: () => source.requiredLogin$.shamefullySendNext(null)
      });

    stream
      .filter((reauest) => reauest.type === "callback")
      .map(() => Stream.fromPromise((client.handleRedirectCallback())))
      .flatten()
      .addListener({
        next: (callback) => source.appState$.shamefullySendNext(callback.appState),
        error: () => source.requiredLogin$.shamefullySendNext(null)
      })

    return source;
  };
};
