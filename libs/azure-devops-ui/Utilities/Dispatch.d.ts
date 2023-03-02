import * as React from "react";
export declare type EventDelegate<T> = (event: React.SyntheticEvent<HTMLElement>, data?: T) => void;
export interface IEventDispatch {
    addEventListener: <T>(eventType: string, callback: EventDelegate<T>) => void;
    dispatchEvent: <T>(event: React.SyntheticEvent<HTMLElement>, data?: T, type?: string) => void;
    removeEventListener: <T>(eventType: string, callback: EventDelegate<T>) => void;
}
export declare class EventDispatch implements IEventDispatch {
    private listeners;
    addEventListener<T>(eventType: string, callback: EventDelegate<T>): void;
    dispatchEvent<T>(event: React.SyntheticEvent<HTMLElement>, data?: T, type?: string): void;
    removeEventListener<T>(eventType: string, callback: EventDelegate<T>): void;
}
