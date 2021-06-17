import { Stream } from 'xstream';
import { trimPrefix } from './string';

export type SelectableElement<T> = [string, T];

export class SelectableStream<T> {
  private stream: Stream<SelectableElement<T>>;
  constructor() {
    this.stream = Stream.create();
  }
  select(name: string): Stream<T> {
    return this.stream.filter(([streamName, _]) => streamName === name).map(([_, response]) => response);
  }
  filterStartWith(prefix: string): Stream<[string, T]> {
    return this.stream
      .filter(([streamName, _]) => streamName.startsWith(prefix))
      .map(([name, response]) => [trimPrefix(name, prefix), response]);
  }
  shamefullySendNext(response: SelectableElement<T>): void {
    this.stream.shamefullySendNext(response);
  }
}

export class MockSelectableStream<T> {
  private src: { [name: string]: Stream<T> };
  constructor(src: { [name: string]: Stream<T> }) {
    this.src = src;
  }

  select(name: string): Stream<T> {
    return this.src[name] || Stream.never();
  }
  filterStartWith(prefix: string): Stream<[string, T]> {
    return Stream.merge(
      ...Object.keys(this.src)
        .filter((name) => name.startsWith(prefix))
        .map((name): Stream<[string, T]> => this.src[name].map((element) => [trimPrefix(name, prefix), element]))
    );
  }
}
