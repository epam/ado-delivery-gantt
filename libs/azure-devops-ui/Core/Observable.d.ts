import * as React from "react";
/**
 * Core client interface for an IObservable collection keyed by K with values of type V.
 */
export interface IObservable<T, TAction extends string = string> {
    /**
     * subscribe should be called when the caller wants to be notified about changes to
     * the underlying data. The caller should only call once per delegate, but will
     * get notified N times (once for each call to subscribe).
     *
     * @param observer - This is the delegate to be notified when the underlying data changes.
     *
     * @param action - Optional argument that allows the consumer to supply a action
     *  with the delegate. If the action is supplied only those actions are delievered,
     *  while all actions are delivered is no action is supplied.
     *
     * @returns observer parameter, unchanged
     */
    subscribe: (observer: (value: T, action?: TAction) => void, action?: TAction) => (value: T, action?: TAction) => void;
    /**
     * unsubscribe should be called with a previously supplied delegate to subscribe.
     * The client MUST call unsubscribe once for every call to subscribe with the
     * appropriate delegates.
     *
     * @param observer - This is the delegate that was previously registered with subscribe.
     *
     * @param action - Optional argument that defines the action that was subscribed to.
     */
    unsubscribe: (observer: (value: T, action?: TAction) => void, action?: TAction) => void;
}
/**
 * An Observable implementation that will track a set of subscribers and supports
 * notifications when the underlying system changes.
 */
export declare class Observable<T, TAction extends string = string> implements IObservable<T, TAction> {
    private observers;
    private events?;
    protected subscriberCount: number;
    /**
     * notify is used to send the event to all subscribers that have signed up for this events
     * action. This means they have subscribed directly to this action, or to all actions.
     * If the caller requested the event be persisted the event will be fired in order to new
     * subscribers as well when they subscribe.
     *
     * @param value - The object that represents the event data.
     *
     * @param action - The action that happened on this observable to produce the event.
     *
     * @param persistEvent - Optional value that determines if all future subscribers will
     *  recieve the event as well.
     */
    notify(value: T, action: TAction, persistEvent?: boolean): void;
    subscribe(observer: (value: T, action: TAction) => void, action?: string): (value: T, action?: TAction) => void;
    unsubscribe(observer: (value: T, action: TAction) => void, action?: string): void;
}
export declare type IObservableLikeValue<T> = IObservableValue<T> | T;
export declare type IObservableLikeArray<T> = IObservableArray<T> | IReadonlyObservableArray<T> | T[];
export declare namespace ObservableLike {
    /**
     * Check whether the specified object is an observable or not.
     *
     * @param observableLike Object to perform observable check.
     */
    function isObservable<T>(observableLike: IObservable<T> | any): observableLike is IObservable<T>;
    /**
     * Gets the value of the specified observable like. If not observable, returns the passed argument.
     *
     * @param observableLike Object to get the value.
     * @returns Observable value or the observable like itself.
     */
    function getValue<T>(observableLike: IObservableLikeValue<T>): T;
    /**
     * Gets the value of the specified observable like. If not observable, returns the passed argument.
     *
     * @param observableLikeArray Object to get the value.
     * @returns Observable value or the observable like itself.
     */
    function getValue<T>(observableArrayLike: IObservableLikeArray<T>): T[];
    /**
     * Subscribes to the specified object if it is an observable.
     *
     * @param observableLike Object to subscribe its value change if applicable.
     * @param observer Delegate to be executed when the underlying data changes.
     * @param action Optional argument that allows the consumer to supply a action
     *  with the delegate. If the action is supplied only those actions are delievered,
     *  while all actions are delivered is no action is supplied.
     * @returns observer
     */
    function subscribe<T>(observableLike: IObservable<T> | any, observer: (value: T, action: string) => void, action?: string): (value: T, action: string) => void;
    /**
     * Unsubscribes from the specified object if it is an observable.
     *
     * @param observableLike Object to subscribe its value change if applicable.
     * @param observer Delegate to be executed when the underlying data changes.
     * @param action Optional argument that allows the consumer to supply a action
     *  with the delegate. If the action is supplied only those actions are delievered,
     *  while all actions are delivered is no action is supplied.
     */
    function unsubscribe<T>(observableLike: IObservable<T> | any, observer: (value: T, action: string) => void, action?: string): void;
}
/**
 * An IReadonlyObservableValue<T> gives a readonly view of an IObservableValue<T>.
 *
 * The normal pattern to follow is for a parent object/component creates an IObservableValue<T>
 * and pass it to dependants as an IReadonlyObservableValue<T>. This prevents the callee
 * from changing the value and treating the relationship as a two way binding. Observables
 * are intended to be used as a one way binding where the object owner uses the observable to
 * notify others about changes to the value without giving them control over the value.
 */
export interface IReadonlyObservableValue<T> extends IObservable<T> {
    /**
     * Read access to the value being observed.
     */
    readonly value: T;
}
/**
 * Given a type, returns the type that it is observing.
 */
export declare type ObservedValue<T> = T extends IReadonlyObservableValue<infer U> ? U : T;
/**
 * An IObservableValue<T> tracks an instance of type T and allows consumers
 * be notified with the value is changed.
 *
 * EventTypes:
 *  set - T
 */
export interface IObservableValue<T> extends IReadonlyObservableValue<T> {
    /**
     * This is the current value of the observable.
     */
    value: T;
}
export declare class ObservableValue<T> extends Observable<T> implements IObservableValue<T> {
    private v;
    constructor(value: T);
    get value(): T;
    set value(value: T);
}
/**
 * When an action occurs on an IObservableObject the event should take the form
 * of an IObjectProperty<T> where T is the type of the value being stored.
 */
export interface IObjectProperty<T> {
    key: string;
    value?: T;
}
/**
 * An Observable collection is used to track a set of objects by name and offer notifications
 * for consumers when the collection has changed.
 *
 * EventTypes:
 *  add - ICollectionEvent<V>
 */
export interface IObservableObject<V> extends IObservable<IObjectProperty<V>> {
    /**
     * Adding an object to the collection will notify all observers of the collection
     * and keep track of the objects.
     *
     * @param objectName - name of the object be registered.
     *
     * @param objectDefinition - details of the object being registered
     */
    add: (objectName: string, objectDefinition: V) => void;
    /**
     * get is used to retrieve the objectDefinition for named object.
     *
     * @param objectName - name of the object to get the definition.
     */
    get: (objectName: string) => V | undefined;
    /**
     * Adds an object to the collection, overwriting the old
     *
     * @param objectName - name of the object be registered.
     *
     * @param objectDefinition - details of the object being registered
     */
    set: (objectName: string, objectDefinition: V) => void;
    /**
     * A read-only collection of the existing objects.
     */
    keys: () => string[];
}
/**
 * An ObservableObject can be used to key a named collection of properties
 * and offer an observable endpoint.
 */
export declare class ObservableObject<V> extends Observable<IObjectProperty<V>> implements IObservableObject<V> {
    private objects;
    add(objectName: string, objectDefinition: V): void;
    get(objectName: string): V | undefined;
    set(objectName: string, objectDefinition: V): void;
    keys(): string[];
}
/**
 * List of actions that are notified on the ObservableArray.
 */
export declare type ObservableArrayAction = "change" | "push" | "pop" | "splice" | "removeAll";
/**
 * All ObservableArray events will have an action associated with them.
 */
export interface IObservableArrayEventArgs<T> {
    /**
     * Items added to ObservableArray.
     */
    addedItems?: T[];
    /**
     * Items that were changed.
     */
    changedItems?: T[];
    /**
     * The index that the operation started.
     */
    index: number;
    /**
     * Items removed from ObservableArray.
     */
    removedItems?: T[];
}
/**
 * An Observable array is used to track an array of items and offer notifications
 * for consumers when the array has changed.
 *
 * EventTypes:
 *  change - { changedItems, index }
 *  push - {addedItems, index }
 *  pop - { index, removedItems}
 *  removeAll - {index, removedItems }
 *  splice - { addedItems, index, removedItems }
 */
export interface IReadonlyObservableArray<T> extends IObservable<IObservableArrayEventArgs<T>, ObservableArrayAction> {
    /**
     * Gets the number of the items in the ObservableArray.
     */
    readonly length: number;
    /**
     * Gets all the items in the ObservableArray.
     */
    readonly value: T[];
}
/**
 * An Observable array is used to track an array of items and offer notifications
 * for consumers when the array has changed.
 *
 * EventTypes:
 *  change - { changedItems, index }
 *  push - {addedItems, index }
 *  pop - { index, removedItems}
 *  removeAll - {index, removedItems }
 *  splice - { addedItems, index, removedItems }
 */
export interface IObservableArray<T> extends IReadonlyObservableArray<T> {
    /**
     * Change can be used to update a set of items in the array. Using change instead
     * of splice allows any observers to potentially optimize the updates to only the
     * affected data.
     *
     * @param start Zero based index of the first item to change.
     * @param items The set of items to change.
     */
    change: (start: number, ...items: T[]) => number;
    /**
     * The length property can be used to determine the number of elements in
     * the observable array.
     */
    readonly length: number;
    /**
     * Appends new elements to an array, and returns the new length of the array.
     *
     * NOTE: Use of ...array places all items onto the stack which can cause the
     * browser to run out of stack space if you pass more than 32K/64K items (browser dependent).
     * Use "value" or add items in batches in this case.
     *
     * @param items - new elements of the ObservableArray.
     *
     * @returns - number of the newly inserted items.
     */
    push: (...items: T[]) => number;
    /**
     * Removes the last element from an array and returns it.
     *
     * @returns - removed element or undefined if ObservableArray has no items.
     */
    pop: () => T | undefined;
    /**
     * Remove all items from the array that match the specified filter
     *
     * @param filter - Delegate which returns true for each item to remove. If undefined, all items in the array are removed.
     */
    removeAll: (filter?: (item: T) => boolean) => void;
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     *
     * NOTE: Use of ...array places all items onto the stack which can cause the
     * browser to run out of stack space if you pass more than 32K/64K items (browser dependent).
     * Use "value" or add items in batches in this case.
     *
     * @param start - Zero-based location in the array from which to start removing elements.
     *
     * @param deleteCount - Number of elements to remove.
     *
     * @param items - Elements to insert into the array in place of the deleted elements.
     *
     * @returns - deleted elements.
     */
    splice: (start: number, deleteCount: number, ...items: T[]) => T[];
    /**
     * Gets all the items in ObservableArray.
     */
    value: T[];
}
/**
 * EventTypes:
 *  change - { changedItems, index }
 *  push - {addedItems, index }
 *  pop - { index, removedItems}
 *  removeAll - {index, removedItems }
 *  splice - { addedItems, index, removedItems }
 */
export declare class ObservableArray<T> extends Observable<IObservableArrayEventArgs<T>, ObservableArrayAction> implements IObservableArray<T> {
    protected internalItems: T[];
    constructor(items?: T[]);
    change(start: number, ...items: T[]): number;
    get length(): number;
    push(...items: T[]): number;
    pop(): T | undefined;
    removeAll(filter?: (item: T) => boolean): T[];
    splice(start: number, deleteCount: number, ...itemsToAdd: T[]): T[];
    get value(): T[];
    set value(items: T[]);
}
/**
 * An Observable Collection takes an arry of arrays or observable arrays
 * and flattens out the items into a single readonly observable array
 * (with all the underlying array values aggregated together).
 *
 * This handles subscribing to any underlying observable arrays and
 * updating the aggregate array as appropriate (and notifying subscribers)
 */
export declare class ObservableCollection<T> extends Observable<IObservableArrayEventArgs<T>, ObservableArrayAction> implements IReadonlyObservableArray<T> {
    get length(): number;
    get value(): T[];
    private collections;
    private items;
    /**
     * Adds an additional collection of items to the end of the array
     *
     * @param collection Array of items or an observable array of items
     * @params transformItems Delegate to process each item that is pulled from the given collection
     */
    push<TInput = T>(collection: TInput[] | IReadonlyObservableArray<TInput>, transformItems?: (input: TInput) => T | undefined): void;
    subscribe(observer: (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void, action?: ObservableArrayAction): (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void;
    unsubscribe(observer: (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void, action?: ObservableArrayAction): void;
    /**
     * Recalculate items. This is necessary while we work without subscribers, as we're not listening to changes in observable inner collections.
     * Once the first subscriber joins, items collection will be in sync real-time.
     */
    private recalculateItems;
    private transformItems;
    private getSubscriber;
}
/**
 * Indicates an object that has a ready property to let consumers know when the object is ready.
 */
export interface IReadyable {
    /**
     * An observable which lets the consumer know when the object is ready
     */
    ready: IObservableValue<boolean>;
}
/**
 * Indicates an object that has a ready property to let consumers know when the object is ready.
 */
export interface IReadonlyReadyable {
    /**
     * An observable which lets the consumer know when the object is ready
     */
    ready: IReadonlyObservableValue<boolean>;
}
/**
 * An observable array which lets consumers know when its initial items have been populated and it is ready to use.
 */
export interface IReadyableReadonlyObservableArray<T> extends IReadonlyObservableArray<T>, IReadonlyReadyable {
}
/**
 * An observable array which lets consumers know when its initial items have been populated and it is ready to use.
 */
export interface IReadyableObservableArray<T> extends IObservableArray<T>, IReadyable {
}
export declare class ReadyableObservableArray<T> extends ObservableArray<T> implements IReadyableObservableArray<T> {
    readonly ready: ObservableValue<boolean>;
    constructor(items?: T[], ready?: boolean);
}
/**
 * React Hooks extension that allows the consumer to track Observables with a useState like
 * hooks API.
 *
 * @param initialState Initial value for the state, or a function that will resolve the value
 * the when the value is initialized.
 */
export declare function useObservable<T>(initialState: T | (() => T)): [ObservableValue<T>, React.Dispatch<React.SetStateAction<T>>];
/**
 * React Hooks extension that allows the consmer to track ObservableArrays with a useState like
 * hooks API.
 *
 * @param initialState Initial value for the state, or a function that will resolve the value
 * the when the value is initialized.
 */
export declare function useObservableArray<T>(initialState: T[] | (() => T[])): [IObservableArray<T>, React.Dispatch<React.SetStateAction<T[]>>];
/**
 * React Hooks extension that provides a constant reference to an ObservableValue which will update
 * based on another observable.
 *
 * @remarks
 * The subscription will be safely unsubscribed any time:
 * - The source observable points to a new object
 * - The callback dependencies array changes
 * - The component is unmounted
 *
 * @param sourceObservable
 * @param getDerivedValue
 * @param callbackDependencies
 */
export declare function useDerivedObservable<TSource, T>(sourceObservable: IObservableValue<TSource>, getDerivedValue: (source: TSource) => T, callbackDependencies: unknown[]): IReadonlyObservableValue<T>;
/**
 * React Hooks extension that fires a callback whenever the provided observable changes.
 * Note that when an observable array is provided, the callback will be called with the entire array rather
 * than with the usual observable array subscription args.
 *
 * @remarks
 * The subscription will be safely unsubscribed any time:
 * - The source observable points to a new object
 * - The callback dependencies array changes
 * - The component is unmounted
 *
 * @param sourceObservable
 * @param callbackFn
 * @param callbackDependencies
 */
export declare function useSubscription<T>(sourceObservable: IObservableValue<T>, callbackFn: (value: T) => void, callbackDependencies?: unknown[]): void;
export declare function useSubscription<T>(sourceObservable: IObservableArray<T>, callbackFn: (value: T[]) => void, callbackDependencies?: unknown[]): void;
/**
 * React Hooks extension that debounces the firing of a callback whenever the provided observable changes.
 * Note that when an observable array is provided, the callback will be called with the entire array rather
 * than with the usual observable array subscription args.
 *
 * @remarks
 * The subscription will be safely unsubscribed any time:
 * - The source observable points to a new object
 * - The timeout value changes
 * - The callback dependencies array changes
 * - The component is unmounted
 *
 * @param sourceObservable
 * @param callbackFn
 * @param callbackDependencies
 */
export declare function useDebouncedSubscription<T>(sourceObservable: IObservableValue<T>, debounceMs: number, callbackFn: (value: T) => void, callbackDependencies?: unknown[]): void;
export declare function useDebouncedSubscription<T>(sourceObservable: IObservableArray<T>, debounceMs: number, callbackFn: (value: T[]) => void, callbackDependencies?: unknown[]): void;
