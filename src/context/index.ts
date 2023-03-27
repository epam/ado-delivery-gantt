import { IProjectInfo } from "azure-devops-extension-api";
import { DaemonController } from "../daemon";
import { createContext } from "react";
import { ProgressInterface } from "service/ProgressCalculationService";

export type RootContext = {
    project?: IProjectInfo,
    workItemTypes: Map<string, string>,
    progressMap: Map<string, ProgressInterface>,
    daemonController: DaemonController
}
export type HubContext = {
    workItemTypes: Map<string, string>,
    progressMap: Map<string, ProgressInterface>,
    project: IProjectInfo
}

export const daemonController = new DaemonController();
export const RootHubContext = createContext({ workItemTypes: new Map(), progressMap: new Map(), daemonController } as RootContext);
