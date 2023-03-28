import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { DaemonCommand } from "../api";
import { eventHandlers } from "./Handlers";
import { RequestCancelation, DaemonManager } from './WorkerTypes';

export const commandIdDelimiter = "_$$$_";
export const { fetch: globalFetch } = self;
export const requestCancelations = new Map<string, RequestCancelation>();

export const getRequestInfo = (req: RequestInfo | URL): { commandId: string, request: RequestInfo | URL } => {
  if (typeof self.Request !== "undefined" && req instanceof self.Request) {
    const [commandId, url] = req.url.split(commandIdDelimiter);
    return { commandId, request: new Request(url, req) };
  } if (typeof self.URL !== "undefined" && req instanceof self.URL) {
    const [commandId, url] = `${req}`.split(commandIdDelimiter);
    return { commandId, request: new URL(url) };
  } 
  const [commandId, url] = `${req}`.split(commandIdDelimiter);
  return { commandId, request: url };
    
}

export const daemonManager = new DaemonManager();

export const getClientOptions = (commandId: string) =>
  ({
    rootPath: `${commandId}${commandIdDelimiter}${daemonManager.rootPath}`,
    authTokenProvider: daemonManager.authTokenProvider
  });

self.addEventListener("message", async (event: MessageEvent<DaemonCommand<any>>) => {
  const { data: command } = event;
  await eventHandlers[command.type](command);
});

self.fetch = async (req: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  const { commandId, request } = getRequestInfo(req);
  const cancelation = requestCancelations.get(commandId);
  return globalFetch(request, cancelation ? { ...init, signal: cancelation.abortController.signal } : init);
}