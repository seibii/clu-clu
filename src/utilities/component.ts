import { MainDOMSource, VNode } from "@cycle/dom";
import { HTTPSource, RequestInput } from "@cycle/http";
import { Reducer, StateSource } from "@cycle/state";
import { ResponseCollection, StorageRequest } from "@cycle/storage";
import { HistoryInput, RouterSource } from "cyclic-router";
import { Stream } from "xstream";
import { AnalyticsRequest, AnalyticsSource } from "../drivers/analyticsDriver";
import { Auth0Request, Auth0Source } from "../drivers/auth0Driver";
import { CanvasRequest } from "../drivers/canvasDriver";
import { CrispChatRequest } from "../drivers/crispDriver";
import { FlashRequest, FlashSource } from "../drivers/flashDriver";
import { LocationRequest } from "../drivers/locationDriver";
import {
  MediaDevicesSource,
  MediaRequest,
} from "../drivers/mediaDevicesDriver";
import { MediaQuerySource } from "../drivers/mediaQueryDriver";
import { ShakenQRRequest, ShakenQRSource } from "../drivers/shakenQRDriver";
import { SentryRequest } from "../drivers/sentryDriver";
import { OuterSi } from "@cycle/isolate";
import {
  ModalActionRequest,
  ModalActionSource,
} from "../drivers/modalActionsDriver";
import { ScrollTopRequest } from "../drivers/scrollTopDriver";
import { NavigatorShareRequest } from "../drivers/navigatorShareDriver";
import { TimeSource } from "@cycle/time/lib/cjs/src/time-source";
import { CryptoRequest, CryptoSource } from "../drivers/cryptoDriver";
import { mergeSinks } from "cyclejs-utils";

export type Component<State> = (s: Sources<State>) => Sinks<State>;

export interface Sources<State> {
  DOM: MainDOMSource;
  HTTP: HTTPSource;
  analytics: AnalyticsSource;
  auth: Auth0Source;
  crypto: CryptoSource;
  flash: FlashSource;
  mediaDevices: MediaDevicesSource;
  mediaQuery: MediaQuerySource;
  modalDOM: MainDOMSource;
  modalActions: ModalActionSource;
  router: RouterSource;
  shakenQR: ShakenQRSource;
  state: StateSource<State>;
  storage: ResponseCollection;
  timer: TimeSource;
}

export interface Sinks<State> {
  DOM: Stream<VNode>;
  HTTP: Stream<RequestInput>;
  analytics: Stream<AnalyticsRequest>;
  auth: Stream<Auth0Request>;
  canvas: Stream<CanvasRequest>;
  crypto: Stream<CryptoRequest>;
  crisp: Stream<CrispChatRequest>;
  flash: Stream<FlashRequest>;
  location: Stream<LocationRequest>;
  mediaDevices: Stream<MediaRequest>;
  modalDOM: Stream<VNode>;
  modalActions: Stream<ModalActionRequest>;
  navigatorShare: Stream<NavigatorShareRequest>;
  router: Stream<HistoryInput>;
  scrollTop: Stream<ScrollTopRequest>;
  sentry: Stream<SentryRequest>;
  shakenQR: Stream<ShakenQRRequest>;
  state: Stream<Reducer<State>>;
  storage: Stream<StorageRequest>;
}

type SinksForOverride<State> = { [K in keyof Sinks<State>]?: Sinks<State>[K] };

export const createSinks = <T>(override: SinksForOverride<T>): Sinks<T> => ({
  DOM: override.DOM || Stream.never(),
  HTTP: override.HTTP || Stream.never(),
  analytics: override.analytics || Stream.never(),
  auth: override.auth || Stream.never(),
  canvas: override.canvas || Stream.never(),
  crypto: override.crypto || Stream.never(),
  crisp: override.crisp || Stream.never(),
  flash: override.flash || Stream.never(),
  location: override.location || Stream.never(),
  mediaDevices: override.mediaDevices || Stream.never(),
  modalDOM: override.modalDOM || Stream.never(),
  modalActions: override.modalActions || Stream.never(),
  navigatorShare: override.navigatorShare || Stream.never(),
  router: override.router || Stream.never(),
  scrollTop: override.scrollTop || Stream.never(),
  sentry: override.sentry || Stream.never(),
  shakenQR: override.shakenQR || Stream.never(),
  state: override.state || Stream.never(),
  storage: override.storage || Stream.never(),
});

export const mergeSinksAndOverrideDOM = <BaseState, OverrideState, FlashState>(
  base: Sinks<BaseState>,
  override: SinksForOverride<OverrideState>,
  dom: Stream<VNode>,
  flash?: OuterSi<Sources<FlashState>, Sinks<FlashState>>
): Sinks<BaseState> => ({
  ...mergeSinks([base, override]),
  DOM: dom,
  flash:
    override.flash && flash
      ? Stream.merge(base.flash, override.flash, flash.flash)
      : base.flash,
  state: (override.state
    ? Stream.merge(override.state, base.state)
    : base.state) as Stream<Reducer<BaseState>>,
});

export type Intent<Actions, State> = (sources: Sources<State>) => Actions;

export type Model<Actions, State> = (
  actions: Actions
) => optionalModelResult<State>;
export interface ModelResult<State> {
  analytics$: Stream<AnalyticsRequest>;
  auth$: Stream<Auth0Request>;
  canvas$: Stream<CanvasRequest>;
  crisp$: Stream<CrispChatRequest>;
  crypto$: Stream<CryptoRequest>;
  flash$: Stream<FlashRequest>;
  location$: Stream<LocationRequest>;
  mediaDevices$: Stream<MediaRequest>;
  modalDOM$: Stream<VNode>;
  modalActions$: Stream<ModalActionRequest>;
  navigatorShare$: Stream<NavigatorShareRequest>;
  reducer$: Stream<Reducer<State>>;
  request$: Stream<RequestInput>;
  router$: Stream<HistoryInput>;
  scrollTop$: Stream<ScrollTopRequest>;
  sentry$: Stream<SentryRequest>;
  shakenQR$: Stream<ShakenQRRequest>;
  storage$: Stream<StorageRequest>;
}
export type optionalModelResult<State> = {
  [K in keyof ModelResult<State>]?: ModelResult<State>[K];
};

export type View<S> = (state$: Stream<S>) => Stream<VNode>;

export const createComponent =
  <A, S>(intent: Intent<A, S>, model: Model<A, S>, view: View<S>) =>
  (sources: Sources<S>): Sinks<S> => {
    const actions = intent(sources);
    const streams = model(actions);
    const view$ = view(sources.state.stream);

    return createSinks({
      DOM: view$,
      HTTP: streams.request$,
      state: streams.reducer$,
      analytics: streams.analytics$,
      auth: streams.auth$,
      canvas: streams.canvas$,
      crypto: streams.crypto$,
      crisp: streams.crisp$,
      flash: streams.flash$,
      location: streams.location$,
      mediaDevices: streams.mediaDevices$,
      modalDOM: streams.modalDOM$,
      modalActions: streams.modalActions$,
      navigatorShare: streams.navigatorShare$,
      router: streams.router$,
      scrollTop: streams.scrollTop$,
      sentry: streams.sentry$,
      shakenQR: streams.shakenQR$,
      storage: streams.storage$,
    });
  };

export const mergeStreamSinks = <State>(
  app: Sinks<State>,
  page$: Stream<Sinks<State>>
): Sinks<State> => {
  return Object.keys(app)
    .map((key: keyof Sinks<State>): [keyof Sinks<State>, Stream<unknown>] => [
      key,
      Stream.merge(
        app[key] as Stream<unknown>,
        page$.map((component) => component[key] as Stream<unknown>).flatten()
      ),
    ])
    .reduce(
      (acc, [key, val]) => Object.assign(acc, { [key]: val }),
      {}
    ) as Sinks<State>;
};
