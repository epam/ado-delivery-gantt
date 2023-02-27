declare global {
    interface Window { LOCAL_API_HOST_NAME: string; }
}

const { Request, URL, XMLHttpRequest, fetch: globalFetch } = window;

const { open: globalOpen } = XMLHttpRequest.prototype;

window.LOCAL_API_HOST_NAME = "localhost";

type ApiUri = RequestInfo | URL;

const getLocalAPiBasePath = (uri: string) => uri.replace(/^(?:https?:)([/]{2,2})[^/]+/, `http:$1${window.LOCAL_API_HOST_NAME}`);

const resolveRequestUri = (req: ApiUri): ApiUri => {
    if (typeof Request !== "undefined" && req instanceof Request) {
        return new Request(getLocalAPiBasePath(req.url));
    } else if (typeof URL !== "undefined" && req instanceof URL) {
        return new URL(getLocalAPiBasePath(`${req}`));
    } else {
        return getLocalAPiBasePath(`${req}`);
    }
}

window.fetch = async (req: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
    return await globalFetch(resolveRequestUri(req), init);
};

XMLHttpRequest.prototype.open = function() {
    const args: any[] = [].slice.call(arguments).map((it, index) => index === 1 ? resolveRequestUri(it as ApiUri) : it);
    
    const func: { (...args: any[]): void } = globalOpen.bind(this);
    func(...args);
};

export {};