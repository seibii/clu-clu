import { Stream } from "xstream";
import dropRepeats from "xstream/extra/dropRepeats";

export const dropRepeatsExceptTakeOne = <T>(stream: Stream<T>): Stream<T> =>
  Stream.merge(stream.take(1), stream.compose(dropRepeats()));
