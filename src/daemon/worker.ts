import {
    getClient,
} from 'azure-devops-extension-api';
import { BuildProgressMapPayload, DaemonCommand, daemonCommandBuilder, DaemonCommandType, DaemonConfiguration, daemonEventBuilder, DaemonEventType, LoadAssetsPayload } from '../daemon';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking';
import { AdoApiUtil, IconUtil } from '../service/helper';
import { getProgressMap } from '../service/ProgressCalculationService';

type CommandHandler<T, V> = { (command: DaemonCommand<T>, postMessage?: boolean): Promise<V> }

const eventHandlers: { [prop in DaemonCommandType]: CommandHandler<any, any> } = {
    [DaemonCommandType.BUILD_PROGRESS_MAP]: (cmd: DaemonCommand<BuildProgressMapPayload>, postMessage?: boolean) => buildProgressMap(cmd, postMessage),
    [DaemonCommandType.LOAD_ASSETS]: (cmd: DaemonCommand<LoadAssetsPayload>, postMessage?: boolean) => loadAssets(cmd, postMessage),
    [DaemonCommandType.INIT_DAEMON]: async (cmd: DaemonCommand<DaemonConfiguration>, postMessage?: boolean) => initDaemon(cmd),
    [DaemonCommandType.REFRESH_ACCESS_TOKEN]: async (cmd: DaemonCommand<string>, postMessage?: boolean) => accessTokenReady(cmd),
    [DaemonCommandType.AGGREGATE_EXECUTE]: async (cmd: DaemonCommand<void>, postMessage?: boolean) => aggregateExecute(cmd),
    [DaemonCommandType.NO_OP]: async (cmd: DaemonCommand<void>, postMessage?: boolean) => noOpHandler(cmd, postMessage),
};

interface AuthTokenProvider {
    getAuthorizationHeader(forceRefresh?: boolean): Promise<string>;
}

interface AccessToken {
    value: string;
    exp: number;
}

enum AccessTokenStatus {
    VALID,
    PENDING,
    NONE
}

class DaemonManager {
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
                            resolve(token);
                            daemonManager.accessTokenStatus = AccessTokenStatus.VALID;
                        });
                    } else {
                        resolve(daemonManager._accessToken?.value!);
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

const daemonManager = new DaemonManager();

self.addEventListener("message", async (event: MessageEvent<DaemonCommand<any>>) => {
    const { data: command } = event;
    await eventHandlers[command.type](command);
});

const aggregateExecute = async (cmd: DaemonCommand<void>) => {
    const next = cmd.next;
    if (next) {
        const result = await eventHandlers[next.type](next, false);
        const event = daemonEventBuilder()
            .type(DaemonEventType.AGGREGATE_READY)
            .payload(result)
            .build();

        self.postMessage(event);
    }
}

const accessTokenReady = async (cmd: DaemonCommand<string>) => {
    const accessTokenValue = cmd.payload!;
    if (accessTokenValue) {
        const [header, body, signature] = accessTokenValue.split(".");
        const tokenObject: { exp: number } = JSON.parse(atob(body));
        const accessToken: AccessToken = { value: accessTokenValue, exp: tokenObject.exp };
        daemonManager.resolveAll(accessToken);
    }
}

const initDaemon = async (cmd: DaemonCommand<DaemonConfiguration>) => {
    const configuration: DaemonConfiguration = cmd.payload!;
    daemonManager.configuration = configuration;
    const event = daemonEventBuilder()
        .type(DaemonEventType.DAEMON_INITIALIZED)
        .payload(true)
        .build();

    self.postMessage(event);
}

const noOpHandler = async (cmd: DaemonCommand<any>, postMessage: boolean = true) => {
    const payload = cmd.payload!;
    const next = cmd.next;

    if (postMessage) {
        const event = daemonEventBuilder()
            .type(DaemonEventType.NO_OP)
            .payload(payload)
            .build();

        self.postMessage(event);
    }

    if (next) {
        const nextResult = await eventHandlers[next.type](daemonCommandBuilder()
            .from(next)
            .payload({ ...payload })
            .build(), false);

        return { ...payload, ...nextResult };
    }

    return payload;
}

const loadAssets = async (cmd: DaemonCommand<LoadAssetsPayload>, postMessage: boolean = true) => {
    const { project } = cmd.payload!;
    const next = cmd.next;
    const workItemTrackingRestClient = getClient(WorkItemTrackingRestClient, daemonManager);
    const workItemTypes = await workItemTrackingRestClient.getWorkItemTypes(project.name);

    const assets = await Promise.all(
        workItemTypes
            .map(
                ({ name, icon: { url } }) => IconUtil.retrieveIcon(url).then((it) => ({ name, src: it })))
    );

    const result = { workItemTypes: new Map(assets.map(({ name, src }) => [name, src])) };

    if (postMessage) {
        const event = daemonEventBuilder()
            .type(DaemonEventType.ASSETS_LOADED)
            .payload(result)
            .build();

        self.postMessage(event);
    }

    if (next) {
        const nextResult = await eventHandlers[next.type](daemonCommandBuilder()
            .from(next)
            .payload({ ...cmd.payload, ...result })
            .build(), false);

        return { ...result, ...nextResult };
    }

    return result;
}

const buildProgressMap = async (cmd: DaemonCommand<BuildProgressMapPayload>, postMessage: boolean = true) => {
    const next = cmd.next;
    const { project, workItemTypes } = cmd.payload!;

    const teams = await AdoApiUtil.fetchTeams(project, undefined, daemonManager);
    const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams, undefined, daemonManager);

    const progressMap = getProgressMap(teams, teamDictionary, workItemTypes);

    const result = { project, workItemTypes, progressMap };

    if (postMessage) {
        const event = daemonEventBuilder()
            .type(DaemonEventType.PROGRESS_MAP_READY)
            .payload(result)
            .build();

        self.postMessage(event);
    }

    if (next) {
        const nextResult = await eventHandlers[next.type](daemonCommandBuilder()
            .from(next)
            .payload({ ...cmd.payload, ...result })
            .build(), false);

        return { ...result, ...nextResult };
    }

    return result;
}