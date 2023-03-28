import { IProjectInfo } from "azure-devops-extension-api/Common/CommonServices";
import { ExtensionManagementRestClient } from "azure-devops-extension-api/ExtensionManagement"
import { IVssRestClientOptions, getClient } from 'azure-devops-extension-api';
import { CoreRestClient, WebApiTeam } from "azure-devops-extension-api/Core";
import { WorkItemTrackingRestClient, WorkItemExpand, WorkItemErrorPolicy } from "azure-devops-extension-api/WorkItemTracking";
import { FilterInterface } from "component/gantt/GanttView";
import * as SDK from 'azure-devops-extension-sdk';
import { TeamDictionaryValue } from "./ProgressCalculationService";
import { fetchTeamWorkItems } from "./WiqlService";

export type FilterOptions = {
  teams: TeamItem[];
  backlog: BacklogItem[]
};
export type BacklogItem = { name: string; rank: number };
export type TeamItem = { id: string, name: string };
export type GanttHubDocument = {
  id?: string;
  name: string;
  description: string;
  createdBy: string;
  lastModifiedBy: string;
  createdDate: Date;
  lastModifiedDate: Date;
  options: {
    teams: TeamItem[];
    backlog: BacklogItem[]
  };
  __etag?: number;
};

export interface GanttError extends Error {
  status: number;
  responseText: any;
  serverError: any;
}

export interface ExtensionError {
  innerException?: any,
  message?: string,
  typeName?: string,
  typeKey?: string,
  errorCode?: number,
  eventId?: number
}

declare global {
  interface Promise<T = any> {
    handle(fallback?: T, reasonMsg?: string, isDialog?: boolean): Promise<T>;
  }
}

Promise.prototype.handle = function <T>(fallback?: T, reasonMsg?: string, isDialog?: boolean) {
  const self = this;
  return new Promise(async (resolve) => {
    try {
      const value: T = await self; resolve(value);
    } catch (e) {
      resolve(fallback);
      const msg = handleError(e as Error, reasonMsg);
      isDialog && alert(msg);
    }
  });
};

export function handleError(error: Error, message?: string): string {
  let ignore = false;
  let {name} = error;
  let msg = error.message;

  const err = error as GanttError;
  if (err.serverError !== undefined) {
    const responseText = err.serverError as ExtensionError;
    if (responseText.typeKey !== undefined) {
      name = responseText.typeKey;
      if (responseText.typeKey === 'DocumentCollectionDoesNotExistException') {
        ignore = true;
      }
    }
    if (responseText.message !== undefined) {
      msg = responseText.message;
    }
  }

  const dialogMsg = `${message}: \nError name:${name}. \nError message: ${msg}`;
  !ignore && console.error(`${message}: \nError name:${name}. \nError message: ${msg}`);
  return dialogMsg;
}

export const IconUtil = {
  async retrieveIcon(uri: string) {
    return fetch(uri).then((response) =>
      response
        .arrayBuffer()
        .then((buffer = new ArrayBuffer(0)) => this.arrayBufferToBase64(buffer)))
      .handle("", 'Error, getting item icon')
  },

  arrayBufferToBase64(buffer: any) {
    const bytes = [].slice.call(new Uint8Array(buffer))
      .reduce((acc, next) => (`${acc}${String.fromCharCode(next)}`), "");

    return `data:image/svg+xml;base64,${btoa(bytes)}`;
  }
};

const extensionManagementClient = getClient(ExtensionManagementRestClient);
const collectionName = "GanttHub";
const scope = "Default";
const scopeValue = "Current";

const extensionContext = SDK.ready().then(SDK.getExtensionContext);

const runOn = async <T>(callback: { (extensionId: string, publisherId: string): Promise<T> }): Promise<T> => {
  const { extensionId, publisherId } = await extensionContext;
  return callback(publisherId, extensionId);
}

export const ExtensionManagementUtil = {
  async getItem(id: string): Promise<GanttHubDocument> {
    return runOn((publisherId, extensionId) => extensionManagementClient.getDocumentByName(publisherId, extensionId, scope, scopeValue, collectionName, id));
  },
  async getItems(): Promise<GanttHubDocument[]> {
    return runOn((publisherId, extensionId) => extensionManagementClient.getDocumentsByName(publisherId, extensionId, scope, scopeValue, collectionName));
  },
  async createItem(record: any): Promise<GanttHubDocument> {
    return runOn((publisherId, extensionId) => extensionManagementClient.createDocumentByName(record, publisherId, extensionId, scope, scopeValue, collectionName));
  },
  async deleteItem(id: string): Promise<void> {
    return runOn((publisherId, extensionId) => extensionManagementClient.deleteDocumentByName(publisherId, extensionId, scope, scopeValue, collectionName, id));
  },
  async updateItem(record: any): Promise<GanttHubDocument> {
    return runOn((publisherId, extensionId) => extensionManagementClient.updateDocumentByName(record, publisherId, extensionId, scope, scopeValue, collectionName));
  }
}

export const AdoApiUtil = {
  async fetchTeams(project: IProjectInfo, filter?: FilterInterface, clientOptions?: IVssRestClientOptions): Promise<WebApiTeam[]> {
    const { name: projectName } = project;
    const coreClient = getClient(CoreRestClient, clientOptions);
    return coreClient.getTeams(projectName)
      .then(teams => teams.filter(({ id }) => filter?.teams?.some(it => it.id === id) ?? true));
  },

  async collectTeamDictionary(teams: WebApiTeam[], filter?: FilterInterface, clientOptions?: IVssRestClientOptions): Promise<Map<string, TeamDictionaryValue>> {
    const workItemsClient = getClient(WorkItemTrackingRestClient, clientOptions);
    const teamWorkItems = await Promise.all(teams.map(it => fetchTeamWorkItems(it, filter, clientOptions)));
    const projectItems: Map<string, TeamDictionaryValue>[] = await Promise.all(teamWorkItems.map(({ id, ids, connections }) => ids.length > 0 ? workItemsClient.getWorkItemsBatch({
      $expand: WorkItemExpand.All,
      asOf: new Date(),
      errorPolicy: WorkItemErrorPolicy.Omit,
      fields: [],
      ids
    }).then((items = []) => new Map<string, TeamDictionaryValue>([[id, { connections, map: new Map(items.map(item => [`${item.id}`, item])) }]]))
      : Promise.resolve(new Map<string, TeamDictionaryValue>([[id, { connections: {}, map: new Map() }]]))));

    return projectItems.reduce((acc, next) => new Map([...acc, ...next]), new Map());
  }
}
