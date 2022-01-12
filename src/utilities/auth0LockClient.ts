import { Auth0Lock } from "auth0-lock";
import { Auth0UserProfile } from "auth0-js";

export class Auth0LockClient {
  private lock: Auth0LockStatic;
  constructor(
    cliendId: string,
    domain: string,
    audience: string,
    redirectUrl: string,
    options: Auth0LockConstructorOptions,
    lock: Auth0LockStatic = new Auth0Lock(cliendId, domain, {
      auth: { audience, redirectUrl },
      ...options,
    })
  ) {
    this.lock = lock;
  }
  public checkSession(): Promise<AuthResult | undefined> {
    return new Promise((resolve, reject) => {
      this.lock.checkSession({}, (error, authResult) => {
        if (error) {
          if (error.error === "login_required") return resolve(authResult);
          return reject(error);
        }
        return resolve(authResult);
      });
    });
  }
  public show(): void {
    this.lock.show();
  }
  public getUserInfo(accessToken: string): Promise<Auth0UserProfile> {
    return new Promise((resolve, reject) => {
      this.lock.getUserInfo(accessToken, (error, profile) => {
        if (error) return reject(error);
        return resolve(profile);
      });
    });
  }
}

export default Auth0LockClient;
