import { Stream } from "xstream";
import { MockMediaDevicesSource } from "./index";

export const mockMediaStream = (): MediaStream => ({
  active: true,
  id: "id",
  onaddtrack(this: MediaStream, _: MediaStreamTrackEvent) {
    return null;
  },
  onremovetrack(this: MediaStream, _: MediaStreamTrackEvent) {
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addTrack(_: MediaStreamTrack) {},
  clone(): MediaStream {
    return mockMediaStream();
  },
  getAudioTracks(): MediaStreamTrack[] {
    return [];
  },
  getTrackById(_: string): MediaStreamTrack | null {
    return null;
  },
  getTracks(): MediaStreamTrack[] {
    return [];
  },
  getVideoTracks(): MediaStreamTrack[] {
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeTrack(_: MediaStreamTrack) {},
  addEventListener<K extends keyof MediaStreamEventMap>(
    _: K,
    __: (this: MediaStream, ev: MediaStreamEventMap[K]) => any,
    ___?: boolean | AddEventListenerOptions
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {},
  removeEventListener<K extends keyof MediaStreamEventMap>(
    _: K,
    __: (this: MediaStream, ev: MediaStreamEventMap[K]) => any,
    ___?: boolean | EventListenerOptions
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {},
  dispatchEvent(_: Event) {
    return false;
  },
});

export const mockMediaDevicesSource = (
  userMedia$: Stream<MediaStream>
): MockMediaDevicesSource => ({ userMedia$ });
