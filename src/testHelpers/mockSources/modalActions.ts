import { Stream } from "xstream";
import { MockSelectableStream } from "../../utilities/selectableStream";

export class MockModalActionsStream extends MockSelectableStream<unknown> {
  select<T>(modalName: string): Stream<T> {
    return super.select(modalName) as Stream<T>;
  }
}

const emptyMockModalActionsStream = new MockModalActionsStream({});

export interface MockModalActionsSource {
  props$: MockModalActionsStream;
  feedback$: MockModalActionsStream;
}

export const mockModalActionsSource = (
  mock: {
    props$?: MockModalActionsStream;
    feedback$?: MockModalActionsStream;
  } = {}
): MockModalActionsSource => ({
  props$: mock.props$ || emptyMockModalActionsStream,
  feedback$: mock.feedback$ || emptyMockModalActionsStream,
});
