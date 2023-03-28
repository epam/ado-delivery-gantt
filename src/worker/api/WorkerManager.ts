import { 
  DaemonEventType, 
  DaemonEventCallback, 
  DaemonEvent, 
  DaemonCommand, 
  DaemonConfiguration, 
  daemonCommandBuilder, 
  DaemonCommandType 
} from ".";

export abstract class DaemonEventHandler<T> extends Function {
  private readonly componentName: string;

  private readonly eventType: DaemonEventType;

  private readonly callback: DaemonEventCallback<T>;

  protected constructor(componentName: string, eventType: DaemonEventType, callback: DaemonEventCallback<T>) {
    super();
    this.componentName = componentName;
    this.eventType = eventType;
    this.callback = callback;
  }

  getEventType(): DaemonEventType {
    return this.eventType;
  }

  getCallback(): DaemonEventCallback<T> {
    return this.callback;
  }

  getComponentName(): string {
    return this.componentName || "";
  }

  apply(event: DaemonEvent<T>): void {
    this.callback(event);
  }

  static builder<T>(): DaemonEventHandlerBuilder<T> {
    return new DaemonEventHandlerBuilder<T>();
  }
}

export class DaemonEventHandlerBuilder<T> {
  private _componentName = "";

  private _eventType: DaemonEventType = DaemonEventType.NO_OP;

  private _callback: DaemonEventCallback<T> = (_) => { };

  componentName(componentName: string): DaemonEventHandlerBuilder<T> {
    this._componentName = componentName;
    return this;
  }

  eventType(eventType: DaemonEventType): DaemonEventHandlerBuilder<T> {
    this._eventType = eventType;
    return this;
  }

  callback(callback: DaemonEventCallback<T>): DaemonEventHandlerBuilder<T> {
    this._callback = callback;
    return this;
  }

  build(): DaemonEventHandler<T> {
    const { _componentName, _eventType, _callback } = this;
    return new class extends DaemonEventHandler<T> {
      constructor() {
        super(_componentName, _eventType, _callback)
      }
    };
  }
}

export class DaemonManager {
  private daemon = new Worker('daemon.js', { name: "daemon" });

  private readonly activeCommands = new Set<string>();

  private handlers = new Map<string, DaemonEventCallback<any>>();

  private readonly _ready: Promise<boolean> = new Promise((resolve) => {
    const controller: DaemonManager = this;
    const daemonReady: DaemonEventCallback<boolean> = (event) => {
      const ready = event.payload!;
      if (ready) {
        resolve(ready);
        controller.unregisterHandler(DaemonEventType.DAEMON_INITIALIZED);
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
    const event = payload.data;
    this.activeCommands.delete(event.replyId);
    const callback = this.handlers.get(event.type + event.source);
    if (typeof callback === "function") {
      callback(event);   
    }
  }

  protected get ready() {
    return this._ready;
  }

  registerHandler<T>(handler: DaemonEventHandler<T>): void {
    const componentName = handler.getComponentName();
    const type = handler.getEventType();
    const callback = handler.getCallback();
    this.handlers.set(`${type}${componentName}`, callback);
  }

  unregisterHandler(type: string): void {
    this.handlers.delete(type);
  }

  fireCommand<T>(command: DaemonCommand<T>): void {
    const { activeCommands } = this;
    const commandId = command.id;
    this.ready.then(() => {
      if (!activeCommands.has(commandId)) {
        activeCommands.add(commandId);
        this.daemon.postMessage(command);
      }
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
