import { MockSelectableStream } from "../utilities/selectableStream";

export interface MockCryptoSource {
  digested$: MockSelectableStream<ArrayBuffer>;
}

export const mockCryptoSource = (mock: {
  digested$?: MockSelectableStream<ArrayBuffer>;
}): MockCryptoSource => ({
  digested$: mock.digested$ || new MockSelectableStream<ArrayBuffer>({}),
});
