import { Auth0Source } from "../drivers/auth0Driver";
import { Stream } from "xstream";
import { notEmpty } from "./extentions";

interface Sources {
  auth: Auth0Source;
}

export const loggedInAuthToken$ = (sources: Sources): Stream<string> =>
  sources.auth.token$.filter(notEmpty);
