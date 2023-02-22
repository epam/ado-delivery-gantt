import { getClient as originClient, RestClientFactory, } from "azure-devops-extension-api";
export function getClient<T>(clientClass: RestClientFactory<T>): T {
    let url = window.location.href;
    let rootPath;
    if (url.includes("localhost")) {
        rootPath = { rootPath: "http://localhost/WAGL/" };
    } else {
        rootPath = {};
    }
    return originClient(clientClass, rootPath);
}