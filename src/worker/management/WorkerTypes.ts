import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { DaemonCommand, DaemonConfiguration, daemonEventBuilder, DaemonEventType } from '../api';

export type CommandHandler<T, V> = { (command: DaemonCommand<T>, postMessage?: boolean): Promise<V> }
export type CommandHandlerCallback<T, V> = (cmd: DaemonCommand<T>) => Promise<V>;
export interface RequestCancelation {
  abortController: AbortController,
  abort(): void;
}
export interface AuthTokenProvider {
  getAuthorizationHeader(forceRefresh?: boolean): Promise<string>;
}

export interface AccessToken {
  value: string;
  exp: number;
}

export enum AccessTokenStatus {
  VALID,
  PENDING,
  NONE
}

export class DaemonManager {
  private _configuration: DaemonConfiguration | undefined;

  private _accessToken: AccessToken | undefined;

  private _accessTokenStatus: AccessTokenStatus = AccessTokenStatus.NONE;

  private readonly requests = new Set<(value: string | PromiseLike<string>) => void>();

  private isAccessTokenValid() {
    const now = Date.now();
    const accessToken = this._accessToken;
    return accessToken && now < (accessToken.exp || 0) * 1000
  }

  set accessTokenStatus(_accessTokenStatus: AccessTokenStatus) {
    this._accessTokenStatus = _accessTokenStatus;
  }

  set accessToken(_accessToken: AccessToken) {
    this._accessToken = _accessToken;
  }

  set configuration(_configuration: DaemonConfiguration) {
    this._configuration = _configuration;
  }

  get rootPath() {
    const { serviceHost } = this._configuration!;
    return serviceHost
  }

  get authTokenProvider(): AuthTokenProvider {
    const daemonManager = this;
    return {
      getAuthorizationHeader(forceRefresh?: boolean) {
        return new Promise((resolve) => {
          if (!daemonManager.isAccessTokenValid() || forceRefresh) {
            if (daemonManager._accessTokenStatus !== AccessTokenStatus.PENDING) {
              const event = daemonEventBuilder()
                .type(DaemonEventType.ACCESS_TOKEN_REQUESTED)
                .build();

              self.postMessage(event);
            }

            daemonManager.accessTokenStatus = AccessTokenStatus.PENDING;
            daemonManager.requests.add((token) => {
              resolve(`Bearer ${token}`);
              daemonManager.accessTokenStatus = AccessTokenStatus.VALID;
            });
          } else {
            resolve(`Bearer ${daemonManager._accessToken?.value!}`);
          }
        });
      }
    };
  }

  resolveAll(accessToken: AccessToken) {
    if (accessToken) {
      this.accessToken = accessToken;
      this.requests.forEach(request => request(accessToken.value));
      this.requests.clear();
    }
  }
}
