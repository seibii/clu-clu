import { Auth0Source } from "../drivers/auth0Driver";
import { Auth0LockSource } from "../drivers/auth0LockDriver";
import { Stream } from "xstream";
import { notEmpty } from "./extentions";

interface Sources {
  auth: Auth0Source;
  lock: Auth0LockSource;
}

export const loggedInAuthToken$ = (sources: Sources): Stream<string> =>
  sources.auth.token$.filter(notEmpty);

export const loggedInAuthLockToken$ = (sources: Sources): Stream<string> =>
  sources.lock.token$.filter(notEmpty);
