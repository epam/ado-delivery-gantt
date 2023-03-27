import { IProjectInfo } from "azure-devops-extension-api";
import { ProgressInterface } from "service/ProgressCalculationService";

export type LoadAssetsPayload = {
    project: IProjectInfo
};
export type BuildProgressMapPayload = {
    project: IProjectInfo,
    workItemTypes: Map<string, string>
};
export type AssetsLoadedPayload = {
    workItemTypes: Map<string, string>
};
export type ProgressMapReadyPayload = {
    progressMap: Map<string, ProgressInterface>
};

export enum DaemonCommandType {
    INIT_DAEMON = "init-daemon",
    LOAD_ASSETS = "assets-loaded",
    BUILD_PROGRESS_MAP = "build-progress-map",
    REFRESH_ACCESS_TOKEN = "refresh-access-token",
    AGGREGATE_EXECUTE = "aggregate-execute",
    NO_OP = "no-op"
};

export enum DaemonEventType {
    ACCESS_TOKEN_REQUESTED = "access-token-requested",
    DAEMON_INITIALIZED = "daemon-initialized",
    ASSETS_LOADED = "assets-loaded",
    PROGRESS_MAP_READY = "progress-map-ready",
    AGGREGATE_READY = "aggregate-ready",
    NO_OP = "no-op"
};

export interface DaemonMessage<T extends DaemonCommandType | DaemonEventType, P = any> {
    type: T;
    payload?: P;
    metadata?: { [key: string]: any } | undefined;
}

abstract class DaemonMessageBuilder<T extends DaemonCommandType | DaemonEventType, B extends DaemonMessageBuilder<T, B>> {
    protected _type: T | undefined;
    protected _payload: any | undefined;
    protected _metadata: { [key: string]: any } | undefined;

    type(type: T): B {
        this._type = type;
        return this as unknown as B;
    }

    payload<P = any | undefined>(payload: P): B {
        this._payload = payload;
        return this as unknown as B;
    }

    metadata(metadata: { [key: string]: any } | undefined): B {
        this._metadata = metadata;
        return this as unknown as B;
    }

    abstract build<P = any>(): DaemonMessage<T, P>;

    abstract from(message: T extends DaemonCommandType ? DaemonCommand<T> : DaemonEvent<T>): B;
}

export interface DaemonEvent<T> extends DaemonMessage<DaemonEventType, T> { };
export interface DaemonCommand<T> extends DaemonMessage<DaemonCommandType, T> {
    next?: DaemonCommand<any>;
};
export type DaemonEventCallback<T> = (event: DaemonEvent<T>) => void;
export type DaemonConfiguration = {
    id: string;
    name: string,
    serviceVersion: string,
    serviceHost: string,
    metadata: { [key: string]: any }
}

class DaemonEventBuilder extends DaemonMessageBuilder<DaemonEventType, DaemonEventBuilder> {

    override from(message: DaemonEvent<any>): DaemonEventBuilder {
        return new DaemonEventBuilder()
            .metadata(message.metadata)
            .payload(message.payload)
            .type(message.type);
    }

    override build<P = any>(): DaemonEvent<P> {
        const { _type, _payload, _metadata } = this;
        return {
            get type() {
                return _type as DaemonEventType || DaemonEventType.NO_OP;
            },

            get payload() {
                return _payload;
            },

            get metadata() {
                return _metadata;
            }
        } as DaemonEvent<P>;
    }
}

export const daemonEventBuilder: { (): DaemonEventBuilder } = () => new DaemonEventBuilder();

class DaemonCommandBuilder extends DaemonMessageBuilder<DaemonCommandType, DaemonCommandBuilder> {
    private _next: DaemonCommand<any> | undefined;

    next<P = any | undefined>(next: DaemonCommand<P>): DaemonCommandBuilder {
        this._next = next;
        return this;
    }

    override from(message: DaemonCommand<any>): DaemonCommandBuilder {
        return new DaemonCommandBuilder()
            .next(message.next!)
            .metadata(message.metadata)
            .payload(message.payload)
            .type(message.type);
    }

    override build<P = any>(): DaemonCommand<P> {
        const { _type, _payload, _metadata, _next } = this;
        return {
            get type() {
                return _type as DaemonCommandType || DaemonCommandType.NO_OP;
            },

            get payload() {
                return _payload;
            },

            get metadata() {
                return _metadata;
            },

            get next() {
                return _next;
            }
        } as DaemonCommand<P>
    }
}

export const daemonCommandBuilder: { (): DaemonCommandBuilder } = () => new DaemonCommandBuilder();

export abstract class DaemonEventHandler<T> extends Function {
    private readonly eventType: DaemonEventType;
    private readonly callback: DaemonEventCallback<T>;

    protected constructor(eventType: DaemonEventType, callback: DaemonEventCallback<T>) {
        super();
        this.eventType = eventType;
        this.callback = callback;
    }

    getEventType(): DaemonEventType {
        return this.eventType;
    }

    getCallback(): DaemonEventCallback<T> {
        return this.callback;
    }

    apply(event: DaemonEvent<T>): void {
        this.callback(event);
    }

    static builder<T>(): DaemonEventHandlerBuilder<T> {
        return new DaemonEventHandlerBuilder<T>();
    }
}

export class DaemonEventHandlerBuilder<T> {
    private _eventType: DaemonEventType = DaemonEventType.NO_OP;
    private _callback: DaemonEventCallback<T> = (_) => { };

    eventType(eventType: DaemonEventType): DaemonEventHandlerBuilder<T> {
        this._eventType = eventType;
        return this;
    }

    callback(callback: DaemonEventCallback<T>): DaemonEventHandlerBuilder<T> {
        this._callback = callback;
        return this;
    }

    build(): DaemonEventHandler<T> {
        const { _eventType, _callback } = this;
        return new class extends DaemonEventHandler<T> {
            constructor() {
                super(_eventType, _callback)
            }
        };
    }
}

export class DaemonController {
    private daemon = new Worker('daemon.js', { name: "daemon" });
    private handlers = new Map<DaemonEventType, DaemonEventCallback<any>[]>();
    private readonly _ready: Promise<boolean> = new Promise((resolve) => {
        const controller: DaemonController = this;
        const daemonReady: DaemonEventCallback<boolean> = (event) => {
            const ready = event.payload!;
            if (ready) {
                resolve(ready);
                controller.unregisterHandler(DaemonEventType.DAEMON_INITIALIZED, daemonReady);
            }
        };
        controller.registerHandler(DaemonEventHandler.builder<boolean>()
            .eventType(DaemonEventType.DAEMON_INITIALIZED)
            .callback(daemonReady)
            .build())
    });
    private readonly eventHandler = this.handleEventByType.bind(this);
    private readonly errorHandler = (error: ErrorEvent) => {
        console.error(error);
    };

    private handleEventByType(payload: { data: DaemonEvent<any> }) {
        const callbacks = this.handlers.get(payload.data.type) || [];
        callbacks.forEach(callback => callback(payload.data));
    }

    protected get ready() {
        return this._ready;
    }

    registerHandler<T>(handler: DaemonEventHandler<T>): void {
        const type = handler.getEventType();
        const callback = handler.getCallback();
        const callbacks = [...(this.handlers.get(type) || []), callback];
        this.handlers.set(type, callbacks);
    }

    unregisterHandler<T>(type: DaemonEventType, callback: DaemonEventCallback<T>): void {
        const callbacks = this.handlers.get(type) || [];
        this.handlers.set(type, callbacks.filter(it => it !== callback));
    }

    fireCommand<T>(command: DaemonCommand<T>): void {
        this.ready.then(() => {
            this.daemon.postMessage(command);
        });
    }

    init(configuration: DaemonConfiguration): void {
        this.daemon.postMessage(daemonCommandBuilder()
            .type(DaemonCommandType.INIT_DAEMON)
            .payload(configuration)
            .build());

        this.daemon.addEventListener("message", this.eventHandler);
        this.daemon.addEventListener("error", this.errorHandler);
    }

    close(): void {
        this.daemon.removeEventListener("message", this.eventHandler);
        this.daemon.removeEventListener("error", this.errorHandler);
        this.handlers.clear();
        this.daemon.terminate();
    }
}