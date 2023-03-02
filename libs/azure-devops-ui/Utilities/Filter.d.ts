import * as React from "react";
import { IObservable, IObservableValue, Observable } from '../Core/Observable';
export declare enum FilterOperatorType {
    /**
     * The filter's value should be treated as having the AND operator
     * e.g. If the value is ['a', 'c', 'd'] any item which does not contain
     * 'a' AND 'c' AND 'd' should not be included
     */
    and = "and",
    /**
     * The filter's value should be treated as having the OR operator
     * e.g. If the value is ['a', 'c', 'd'] any item which contains
     * 'a' OR 'c' OR 'd' should be included
     */
    or = "or"
}
/**
 * Dictionary of filter item values
 */
export interface IFilterState {
    /**
     * Maps a key to an IFilterItemState
     */
    [key: string]: IFilterItemState | null;
}
/**
 * Contains the filter item's value and an optional operator
 */
export interface IFilterItemState {
    /**
     * Current value of a filter item
     */
    value: any;
    /**
     * Operator currently being used in the filter item.
     */
    operator?: string;
}
/**
 * Store for a set of filter values
 */
export interface IFilter extends IObservable<IFilterState> {
    /**
     * Gets the value of the specified filter item
     * @param key Filter item key
     */
    getFilterItemState: (key: string) => IFilterItemState | null;
    /**
     * Sets the value of the specified filter item
     * @param key Filter item key
     * @param value Filter value
     */
    setFilterItemState: (key: string, value: IFilterItemState) => void;
    /**
     * Update what the filter considers as its default state
     * @param defaultState The new default state
     */
    setDefaultState: (defaultState: IFilterState) => void;
    /**
     * Gets a dictionary containing the default values of all filter items
     */
    getDefaultState: () => IFilterState;
    /**
     * Gets a dictionary containing the current values of all filter items
     */
    getState: () => IFilterState;
    /**
     * Sets the current values of all filter items
     * @param state Dictionary of all current filter item values
     * @param supressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    setState: (state: IFilterState, suppressChangeEvent?: boolean) => void;
    /**
     * Resets all filter values to their default state
     * @param suppressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    reset: (suppressChangeEvent?: boolean) => void;
    /**
     * Resets the value of the specified filter item to its default state
     * @param key The filter item's key
     */
    resetFilterItemState: (key: string) => void;
    /**
     * Updates the filter's applied state to match the current state - used for scenarios
     * where the consumer of the filter does not want to be notified on every change to the filter,
     * only when the user specifices that changes should be applied.
     */
    applyChanges: () => void;
    /**
     * If true, indicates that updates to this filter should not be applied immediately, but
     * rather only after an "apply" operation is performed (e.g. "enter" press or click "apply")
     */
    usesApplyMode: () => boolean;
    /**
     * Whether or not the applied state matches the current state.
     */
    hasChangesToApply: () => boolean;
    /**
     * Whether or not the default state matches the current state.
     */
    hasChangesToReset: () => boolean;
    /**
     * Whether or not the two specified states are considered equal.
     */
    statesAreEqual: (state1: IFilterState, state2: IFilterState) => boolean;
    /**
     * Whether or not the two specified states of a filterBarItem are considered equal.
     */
    filterItemStatesAreEqual: (item: string, state1: IFilterItemState | null, state2: IFilterItemState | null) => boolean;
    /**
     * Gets the value property for the filter item with the given key.
     * @param key The filter item's key
     */
    getFilterItemValue<T>(key: string): T | undefined;
    /**
     * Gets a dictionary containing the applied values of all filter items.
     * When useApplyMode is false, this always matches the value returned by getState.
     */
    getAppliedState(): IFilterState;
    /**
     * Gets the applied value of the specified filter item
     * @param key Filter item key
     */
    getAppliedFilterItemState(key: string): IFilterItemState | null;
}
/**
 * Options used when creating a filter
 */
export interface IFilterOptions {
    /**
     * Default state of the filter. When reset, the filter is restored to these values.
     */
    defaultState?: IFilterState;
    /**
     * If true, indicates that updates to this filter should not be applied immediately, but
     * rather only after an "apply" operation is performed (e.g. "enter" press or click "apply")
     */
    useApplyMode?: boolean;
    /**
     * Optional comparer functions to disentangle the displayed value from the internally maintained value.
     * For example, this could be useful in a TextFilterBarItem where the user inputs a number and you don't want to treat "0" and "0.0" as different filter values.
     */
    customValueComparers?: {
        [key: string]: (a: any, b: any) => boolean;
    };
}
export declare const FILTER_CHANGE_EVENT = "filter-changed";
export declare const FILTER_APPLIED_EVENT = "filter-applied";
export declare const FILTER_RESET_EVENT = "reset-filters";
/**
 * Store for a set of filter values
 *
 * Events:
 *
 *  FILTER_CHANGE_EVENT: IFilterState
 *  Fired whenever a filter value changes. The event object contains the changed items.
 *  When using explicit apply-mode, this event is fired when the filter is changed (i.e. by user action)
 *  but not yet applied.
 *
 *  FILTER_APPLIED_EVENT: IFilterState
 *  Fired when new filter changes have been applied. The event object contains the changed items.
 *  When not using explicit apply-mode, this event is fired on every state change
 */
export declare class Filter implements IFilter {
    private observable;
    private defaultState;
    private currentState;
    private appliedState;
    private applyMode;
    private customValueComparers;
    /**
     * Create a new Filter store
     * @param options Options for the filter store
     */
    constructor(options?: IFilterOptions, observable?: Observable<IFilterState>);
    subscribe(observer: (value: IFilterState, action?: string) => void, action?: string): (value: IFilterState, action?: string) => void;
    unsubscribe(observer: (value: IFilterState, action?: string) => void, action?: string): void;
    /**
     * Gets a dictionary containing the current values of all filter items
     */
    getState(): IFilterState;
    /**
     * Gets a dictionary containing the applied values of all filter items.
     * When useApplyMode is false, this always matches the value returned by getState.
     */
    getAppliedState(): IFilterState;
    /**
     * Gets a dictionary containing the default values of all filter items
     */
    getDefaultState(): IFilterState;
    /**
     * Update what the filter considers as its default state
     * @param defaultState The new default state
     */
    setDefaultState(defaultState: IFilterState): void;
    /**
     * Sets the current values of all filter items
     * @param state Dictionary of all current filter item values
     * @param supressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    setState(state: IFilterState, supressChangeEvent?: boolean): void;
    /**
     * Gets the value of the specified filter item
     * @param key Filter item key
     */
    getFilterItemState(key: string): IFilterItemState | null;
    /**
     * Gets the applied value of the specified filter item. When applyMode is false,
     * this is equivalent to getFilterItemState.
     * @param key Filter item key
     */
    getAppliedFilterItemState(key: string): IFilterItemState | null;
    /**
     * Gets the value property for the filter item with the given key.
     * @param key The filter item's key
     */
    getFilterItemValue<T>(key: string): T | undefined;
    /**
     * Sets the value of the specified filter item
     * @param key Filter item key
     * @param value Filter value
     */
    setFilterItemState(key: string, value: IFilterItemState): void;
    /**
     * Resets the filter values to their default state
     * @param suppressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    reset(suppressChangeEvent?: boolean): void;
    resetFilterItemState(key: string): void;
    applyChanges(): void;
    usesApplyMode(): boolean;
    hasChangesToApply(): boolean;
    hasChangesToReset(): boolean;
    statesAreEqual(state1: IFilterState, state2: IFilterState): boolean;
    filterItemStatesAreEqual(item: string, state1: IFilterItemState | null, state2: IFilterItemState | null): boolean;
    private _triggerStateChange;
    private _raiseEventAndCallListeners;
    private _checkStateEquality;
    private _checkFilterItemStateEquality;
    private _checkValueEquality;
}
export declare const FilterContext: React.Context<{
    filter: IFilter | null;
    filterToggled: IObservableValue<boolean> | null;
}>;
