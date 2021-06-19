import { Stream } from "xstream";
import { MainDOMSource } from "@cycle/dom";

export const prettyDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minutes = `00${date.getMinutes()}`.slice(-2);
  return `${year}年${month}月${day}日 ${hour}:${minutes}`;
};

interface Sources {
  DOM: MainDOMSource;
}

export const onClickDateInputFieldAndPreventDefault = (
  sources: Sources,
  selector: string
): Stream<Event> =>
  Stream.merge(
    // To prevent iOS datetime picker from being displayed.
    sources.DOM.select(selector).events("touchend", { preventDefault: true }),
    sources.DOM.select(selector).events("click", { preventDefault: true })
  );
