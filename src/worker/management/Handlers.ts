import {
  getClient,
} from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking';
import { BuildProgressMapPayload, CancelPayload, DaemonCommand, daemonCommandBuilder, DaemonCommandType, DaemonConfiguration, daemonEventBuilder, DaemonEventType, GetTeamDictionaryPayload, GetTeamIterationsPayload, LoadAssetsPayload } from '../api';
import { AdoApiUtil, IconUtil } from '../../service/helper';
import { getProgressMap } from '../../service/ProgressCalculationService';
import { requestCancelations, daemonManager, getClientOptions, commandIdDelimiter } from '.';
import { CommandHandler, CommandHandlerCallback, AccessToken } from './WorkerTypes';
import { fetchIterationDefinition } from '../../service/WiqlService';

export const eventHandlers: { [prop in DaemonCommandType]: CommandHandler<any, any> } = {
  [DaemonCommandType.BUILD_PROGRESS_MAP]: (cmd: DaemonCommand<BuildProgressMapPayload>, postMessage?: boolean) => buildProgressMap(cmd, postMessage),
  [DaemonCommandType.LOAD_ASSETS]: (cmd: DaemonCommand<LoadAssetsPayload>, postMessage?: boolean) => loadAssets(cmd, postMessage),
  [DaemonCommandType.INIT_DAEMON]: async (cmd: DaemonCommand<DaemonConfiguration>, postMessage?: boolean) => initDaemon(cmd),
  [DaemonCommandType.REFRESH_ACCESS_TOKEN]: async (cmd: DaemonCommand<string>, postMessage?: boolean) => accessTokenReady(cmd),
  [DaemonCommandType.AGGREGATE_EXECUTE]: async (cmd: DaemonCommand<void>, postMessage?: boolean) => aggregateExecute(cmd),
  [DaemonCommandType.CANCEL]: async (cmd: DaemonCommand<CancelPayload>, postMessage?: boolean) => cancelationHandler(cmd, postMessage),
  [DaemonCommandType.GET_TEAM_DICTIONARY]: async (cmd: DaemonCommand<GetTeamDictionaryPayload>, postMessage?: boolean) => getTeamDictionary(cmd, postMessage),
  [DaemonCommandType.GET_TEAM_ITERATIONS]: async (cmd: DaemonCommand<GetTeamIterationsPayload>, postMessage?: boolean) => getTeamIterations(cmd, postMessage),
  [DaemonCommandType.NO_OP]: async (cmd: DaemonCommand<void>, postMessage?: boolean) => noOpHandler(cmd, postMessage)
};

const createHandler = <T, V>(eventType: DaemonEventType, handler: CommandHandlerCallback<T, V>): CommandHandler<T, V> => async (cmd: DaemonCommand<T>, postMessage = true) => {
  const { next, id, cancelable, source } = cmd;
  if (cancelable && !requestCancelations.has(id)) {
    requestCancelations.set(id, {
      abortController: new AbortController(),
      abort() {
        this.abortController.abort();
      },
    });
  }

  let result: V = {} as V;

  try {
    result = await handler(cmd);
  } catch (e) {
    const err = e as Error;
    if (err.name.startsWith("NetworkException") && requestCancelations.has(id)) {
      const event = daemonEventBuilder()
        .type(DaemonEventType.CANCELED)
        .replyId(id)
        .build();

      self.postMessage(event);
      requestCancelations.delete(id);
      return;
    }
    throw e;
  }

  if (postMessage) {
    cancelable && requestCancelations.delete(id);
    const event = daemonEventBuilder()
      .replyId(id)
      .source(source)
      .type(eventType)
      .payload(result)
      .build();

    self.postMessage(event);
  }

  if (next && cmd.type !== DaemonCommandType.AGGREGATE_EXECUTE) {
    const nextResult = await eventHandlers[next.type](daemonCommandBuilder()
      .from(next)
      .id(cmd.id, false)
      .cancelable(cmd.cancelable)
      .payload({ ...cmd.payload, ...result })
      .source(source)
      .build(), false);

    return { ...result, ...nextResult };
  }

  return result;
}

const aggregateExecute = createHandler(DaemonEventType.AGGREGATE_READY, async (cmd: DaemonCommand<void>) => {
  const { next } = cmd;
  if (next) {
    const nextCommand = daemonCommandBuilder().from(next)
      .id(cmd.id, false)
      .cancelable(cmd.cancelable)
      .build();
    return eventHandlers[next.type](nextCommand, false);
  }
  return next;
});

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

const noOpHandler = createHandler(DaemonEventType.NO_OP, async (cmd: DaemonCommand<any>) => cmd.payload!);

const cancelationHandler = createHandler(DaemonEventType.CANCELED, async (cmd: DaemonCommand<CancelPayload>) => {
  const id = cmd.payload?.id;

  if (id && requestCancelations.has(id)) {
    requestCancelations.get(id)?.abort();
  } else {
    requestCancelations.forEach(cancelation => cancelation.abort());
  }
});

const loadAssets = createHandler(DaemonEventType.ASSETS_LOADED, async (cmd: DaemonCommand<LoadAssetsPayload>) => {
  const { project } = cmd.payload!;
  const workItemTrackingRestClient = getClient(WorkItemTrackingRestClient, getClientOptions(cmd.id));
  const workItemTypes = await workItemTrackingRestClient.getWorkItemTypes(project.name);
  
  const assets = await Promise.all(
    workItemTypes
      .map(
        ({ name, icon: { url } }) => IconUtil.retrieveIcon(`${cmd.id}${commandIdDelimiter}${url}`).then((it) => ({ name, src: it })))
  );

  const result = { workItemTypes: new Map(assets.map(({ name, src }) => [name, src])) };

  return result;
});

const buildProgressMap = createHandler(DaemonEventType.PROGRESS_MAP_READY, async (cmd: DaemonCommand<BuildProgressMapPayload>) => {
  const { project, workItemTypes } = cmd.payload!;
  const teams = await AdoApiUtil.fetchTeams(project, undefined, getClientOptions(cmd.id));
  const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams, undefined, getClientOptions(cmd.id));

  const progressMap = getProgressMap(teams, teamDictionary, workItemTypes);
  const result = { project, workItemTypes, progressMap };

  return result;
});

const getTeamDictionary = createHandler(DaemonEventType.TEAM_DICTIONARY_READY, async (cmd: DaemonCommand<GetTeamDictionaryPayload>) => {
  const { teams, filter } = cmd.payload!;
  const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams, filter, getClientOptions(cmd.id));

  return { teamDictionary };
});

const getTeamIterations = createHandler(DaemonEventType.TEAM_ITERATIONS_READY, async (cmd: DaemonCommand<GetTeamIterationsPayload>) => {
  const { teams } = cmd.payload!;
  const teamIterations = await Promise.all(teams.map(team => fetchIterationDefinition(team, getClientOptions(cmd.id))));

  return { teamIterations };
});
