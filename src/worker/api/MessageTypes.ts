import { IProjectInfo } from "azure-devops-extension-api";
import { ProgressInterface, TeamDictionaryValue } from "service/ProgressCalculationService";
import { WebApiTeam } from "azure-devops-extension-api/Core";
import { FilterInterface } from "component/gantt/GanttView";
import { TeamIteration } from "service/WiqlService";
import { DaemonCommandType, DaemonEventType } from ".";

export type GetTeamDictionaryPayload = {
  teams: WebApiTeam[],
  filter: FilterInterface
};
export type GetTeamIterationsPayload = {
  teams: WebApiTeam[]
};
export type TeamDictionaryPayload = {
  teamDictionary: Map<string, TeamDictionaryValue>
};
export type TeamIterationsPayload = {
  teamIterations: TeamIteration[]
};
export type CancelPayload = {
  id?: string
};
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
export type CanceledPayPaload = {
  id: string
};

export interface DaemonMessage<T extends DaemonCommandType | DaemonEventType, P = any> {
  type: T;
  source: string;
  payload?: P;
  metadata?: { [key: string]: any } | undefined;
}

abstract class DaemonMessageBuilder<T extends DaemonCommandType | DaemonEventType, B extends DaemonMessageBuilder<T, B>> {
  protected _type: T | undefined;

  protected _source = "";

  protected _payload: any | undefined;

  protected _metadata: { [key: string]: any } | undefined;

  type(type: T): B {
    this._type = type;
    return this as unknown as B;
  }

  source(_source: string): B {
    this._source = _source;
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

export interface DaemonEvent<T> extends DaemonMessage<DaemonEventType, T> {
  replyId: string;
}
export interface DaemonCommand<T> extends DaemonMessage<DaemonCommandType, T> {
  id: string;
  cancelable: boolean;
  timestamp: number;
  next?: DaemonCommand<any>;
}
export type DaemonEventCallback<T> = (event: DaemonEvent<T>) => void;
export type DaemonConfiguration = {
  id: string;
  name: string,
  serviceVersion: string,
  serviceHost: string,
  metadata: { [key: string]: any }
}

export class DaemonEventBuilder extends DaemonMessageBuilder<DaemonEventType, DaemonEventBuilder> {

  private _replyId: string | undefined;

  replyId(_replyId: string): DaemonEventBuilder {
    this._replyId = _replyId;
    return this;
  }

  override from(message: DaemonEvent<any>): DaemonEventBuilder {
    return new DaemonEventBuilder()
      .replyId(message.replyId)
      .source(message.source)
      .metadata(message.metadata)
      .payload(message.payload)
      .type(message.type);
  }

  override build<P = any>(): DaemonEvent<P> {
    const { _replyId, _source, _type, _payload, _metadata } = this;
    return {
      get replyId() {
        return _replyId;
      },

      get source() {
        return _source;
      },

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

export class DaemonCommandBuilder extends DaemonMessageBuilder<DaemonCommandType, DaemonCommandBuilder> {
  private _next: DaemonCommand<any> | undefined;

  private _id: string | undefined;

  private _cancelable = false;

  private _timestamp: number = Date.now();

  id(_id: string, keepHierarchy = true): DaemonCommandBuilder {
    this._id = (keepHierarchy ? `${this._type}.${_id}` : _id).toLowerCase();
    return this;
  }

  cancelable(_cancelable: boolean): DaemonCommandBuilder {
    this._cancelable = _cancelable;
    return this;
  }

  timestamp(_timestamp: number): DaemonCommandBuilder {
    this._timestamp = _timestamp;
    return this;
  }

  next<P = any | undefined>(next: DaemonCommand<P>): DaemonCommandBuilder {
    this._next = next;
    return this;
  }

  override from(message: DaemonCommand<any>): DaemonCommandBuilder {
    return new DaemonCommandBuilder()
      .id(message.id)
      .source(message.source)
      .cancelable(message.cancelable)
      .next(message.next!)
      .metadata(message.metadata)
      .payload(message.payload)
      .type(message.type);
  }

  override build<P = any>(): DaemonCommand<P> {
    const { _id, _source, _cancelable = false, _timestamp, _type, _payload, _metadata, _next } = this;
    return {
      get id() {
        return _id || `${_type}.${this.timestamp}`.toLowerCase();
      },

      get source() {
        return _source;
      },

      get cancelable() {
        return _cancelable;
      },

      get timestamp() {
        return _timestamp;
      },

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
