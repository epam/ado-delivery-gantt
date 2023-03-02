export interface IEventRecord {
    target: any;
    eventName: string;
    parent: any;
    callback: (args?: any) => void | boolean;
    elementCallback?: (...args: any[]) => void;
    objectCallback?: (args?: any) => void | boolean;
    options?: boolean | AddEventListenerOptions;
}
export declare class EventGroup {
    private static uniqueId;
    static raise(target: any, eventName: string, eventArgs?: any, bubbleEvent?: boolean): any;
    private static isElement;
    private eventRecords;
    private id;
    private isDisposed;
    private parent;
    constructor(parent: any);
    dispose(): void;
    on(target: any, eventName: string, callback: (args?: any) => void | boolean): void;
    off(target?: any, eventName?: string, callback?: (args?: any) => void | boolean): void;
    raise(eventName: string, eventArgs?: any, bubbleEvent?: boolean): boolean | undefined;
}
