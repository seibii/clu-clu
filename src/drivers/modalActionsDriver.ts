import { Stream } from "xstream";
import { SelectableStream } from "../utilities/selectableStream";

export interface ModalActionRequest {
  type: "props" | "feedback";
  modalName: string;
  value: any;
}

export const createModalActionProps = <T>(
  modalName: string,
  value: T
): ModalActionRequest => ({
  type: "props",
  modalName: modalName,
  value: value,
});

export const createModalActionFeedback = <T>(
  modalName: string,
  value: T
): ModalActionRequest => ({
  type: "feedback",
  modalName: modalName,
  value: value,
});

export interface ModalActionSource {
  props$: ModalActionStream;
  feedback$: ModalActionStream;
}

class ModalActionStream extends SelectableStream<unknown> {
  select<T>(name: string): Stream<T> {
    return super.select(name).map((action) => action as T);
  }
}

export const modalActionDriver = (
  stream: Stream<ModalActionRequest>
): ModalActionSource => {
  const source: ModalActionSource = {
    props$: new ModalActionStream(),
    feedback$: new ModalActionStream(),
  };

  stream
    .filter((request) => request.type === "props")
    .addListener({
      next: (props) =>
        source.props$.shamefullySendNext([props.modalName, props.value]),
    });

  stream
    .filter((request) => request.type === "feedback")
    .addListener({
      next: (feedback) =>
        source.feedback$.shamefullySendNext([
          feedback.modalName,
          feedback.value,
        ]),
    });

  return source;
};
