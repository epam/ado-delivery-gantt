import { 
  ProgressMapReadyPayload,
  LoadAssetsPayload, 
  BuildProgressMapPayload,
  DaemonMessage, 
  DaemonCommand, 
  DaemonEvent, 
  DaemonEventCallback, 
  DaemonConfiguration,
  DaemonEventBuilder,
  DaemonCommandBuilder,
  CancelPayload,
  GetTeamDictionaryPayload,
  GetTeamIterationsPayload,
  TeamDictionaryPayload,
  TeamIterationsPayload
} from "./MessageTypes";

import { DaemonManager, DaemonEventHandler } from "./WorkerManager"

export const daemonEventBuilder: { (): DaemonEventBuilder } = () => new DaemonEventBuilder();

export const daemonCommandBuilder: { (): DaemonCommandBuilder } = () => new DaemonCommandBuilder();

export enum DaemonCommandType {
  GET_TEAM_DICTIONARY = "get-team-dictionary",
  GET_TEAM_ITERATIONS = "get-team-iterations",
  INIT_DAEMON = "init-daemon",
  LOAD_ASSETS = "assets-loaded",
  BUILD_PROGRESS_MAP = "build-progress-map",
  REFRESH_ACCESS_TOKEN = "refresh-access-token",
  AGGREGATE_EXECUTE = "aggregate-execute",
  CANCEL = "cancel",
  NO_OP = "no-op"
}

export enum DaemonEventType {
  TEAM_DICTIONARY_READY = "team-dictionary-ready",
  TEAM_ITERATIONS_READY = "team-iterations-ready",
  ACCESS_TOKEN_REQUESTED = "access-token-requested",
  DAEMON_INITIALIZED = "daemon-initialized",
  ASSETS_LOADED = "assets-loaded",
  PROGRESS_MAP_READY = "progress-map-ready",
  AGGREGATE_READY = "aggregate-ready",
  CANCELED = "canceled",
  NO_OP = "no-op"
}

export { 
  ProgressMapReadyPayload, 
  LoadAssetsPayload, 
  BuildProgressMapPayload, 
  DaemonMessage, 
  DaemonCommand, 
  DaemonEvent, 
  DaemonEventCallback, 
  DaemonConfiguration,
  CancelPayload,
  GetTeamDictionaryPayload,
  GetTeamIterationsPayload,
  TeamDictionaryPayload,
  TeamIterationsPayload
}

export { 
  DaemonManager, 
  DaemonEventHandler 
}

