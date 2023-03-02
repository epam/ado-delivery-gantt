import { IReadonlyObservableArray } from '../Core/Observable';
/**
 * The IItemProvider is used to provide items through a number of mechanisms.
 * 1) The simplest is a static array of items, see ArrayItemProvider below.
 *  This works well when all the items are known up front and the caller has
 *  no intention of changing the set at run-time.
 * 2) You can use the standard ObservableArray which implements the IItemProvider
 *  interface minus the getItem call. This allows the caller to update the set
 *  of item dynamically, but an array will used to back all the items. In cases
 *  where there may be 10's or 100's of thousands of items this will cause
 *  memory issues.
 * 3) The most complex scenario is where the caller doesnt have all the data and
 *  may not even know what all the data is. This is the pure virtualization
 *  scenario where data is fetched on demand and the amount of data the provider
 *  maintains may be a small amount. In this case the provider can implement the
 *  getItem method which should be used to retrieve items instead of the value
 *  array when available.
 *
 * The provider may chose to return -1 for the length which indicates an unkown
 * number of items. NOTE: This is not currently implemented, if you feel you
 * need this, you need to have a talk with the team.
 */
export interface IItemProvider<T> extends Partial<IReadonlyObservableArray<T>> {
    /**
     * getItem may be implemented by an item provider if not all the data is
     * available when the item provider is created. This allows the item provider
     * to fetch data only when it is needed.
     *
     * If data is not available the provider may return an ObservableValue with
     * undefined. This tells the consumer the item is not currently available.
     * If the caller intends to return async loading rows the IItemProvider
     * should be declared:
     *
     *      IItemProvider<T | IReadonlyObservableValue<T | undefined>>
     */
    getItem?: (index: number) => T | undefined;
    /**
     * Gets the number of the items in the ItemProvider.
     */
    readonly length: number;
    /**
     * Gets all the items in the ItemProvider.
     */
    readonly value: T[];
}
/**
 * Basic ItemProvider that surfaces an array of items through the IItemProvider
 * interface.
 */
export declare class ArrayItemProvider<T> implements IItemProvider<T> {
    protected items: T[];
    constructor(items: T[]);
    get length(): number;
    get value(): T[];
}
/**
 * Helper function to get the value of a set of items that can be an itemProvider or normal array.
 * @param items the items to retrieve the value from.
 */
export declare function getItemsValue<T>(items: IItemProvider<T> | T[]): T[];
