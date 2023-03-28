import { IProjectInfo } from "azure-devops-extension-api";
import { createContext } from "react";
import { ProgressInterface } from "service/ProgressCalculationService";
import { DaemonManager } from "../worker/api";

export type RootContext = {
  project: IProjectInfo,
  workItemTypes: Map<string, string>,
  progressMap: Map<string, ProgressInterface>,
  daemonController: DaemonManager
}
export type HubContext = {
  workItemTypes: Map<string, string>,
  progressMap: Map<string, ProgressInterface>,
  project: IProjectInfo
}

export const daemonController = new DaemonManager();
export const RootHubContext = createContext({ workItemTypes: new Map(), progressMap: new Map(), daemonController } as RootContext);
