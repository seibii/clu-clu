import { Auth0Client, IdToken } from "@auth0/auth0-spa-js";
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
  token$: Stream<string | null>;
  login$: Stream<null>;
  logout$: Stream<null>;
  appState$: Stream<any>;
}

export interface Props {
  domain: string;
  clientId: string;
  redirectUrl: string;
  audience: string;
  useRefreshTokens: boolean;
  errorReporter: (error: Error) => void;
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
      appState$: Stream.create(),
    };

    stream
      .filter((request) => request.type === "token")
      .map(() => Stream.fromPromise(client.getTokenSilently()))
      .flatten()
      .map(() => Stream.fromPromise(client.getIdTokenClaims()))
      .flatten()
      .addListener({
        next: (token: IdToken) => source.token$.shamefullySendNext(token.__raw),
        error: (err: any) => {
          console.log("login error");
          source.token$.shamefullySendNext(null);
          if (err?.error !== "login_required") {
            props.errorReporter(err);
          }
        },
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
        error: (err) => props.errorReporter(err),
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
          source.token$.shamefullySendNext(null);
        },
      });

    stream
      .filter((request) => request.type === "callback")
      .map(() => Stream.fromPromise(client.handleRedirectCallback()))
      .flatten()
      .addListener({
        next: (callback) =>
          source.appState$.shamefullySendNext(callback.appState),
        error: (err) => {
          source.appState$.shamefullySendError(err);
          props.errorReporter(err);
        },
      });

    return source;
  };
};
