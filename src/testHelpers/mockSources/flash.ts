import { Stream } from "xstream";
import { FlashRequest } from "../../drivers/flashDriver";

export interface MockFlashSource {
  stream$?: Stream<FlashRequest>;
}

export const mockFlashSource = (source: MockFlashSource): MockFlashSource => ({
  stream$: source.stream$ || Stream.never(),
});
