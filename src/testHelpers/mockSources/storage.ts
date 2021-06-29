import { ResponseCollection } from "@cycle/storage";
import { Stream } from "xstream";

export type MockStorageData = Record<string, Stream<unknown>>;

export const mockStorageSource = (storageData: {
  local?: MockStorageData;
  session?: MockStorageData;
}): ResponseCollection => ({
  local: {
    key: (_n: number): Stream<string> => Stream.never(),
    getItem: <T>(key: string): Stream<T> =>
      (storageData.local?.[key] || Stream.never()) as Stream<T>,
  },
  session: {
    key: (_n: number): Stream<string> => Stream.never(),
    getItem: <T>(key: string): Stream<T> =>
      (storageData.session?.[key] || Stream.never()) as Stream<T>,
  },
});
