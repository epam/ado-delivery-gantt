import { IObservableArrayEventArgs, IReadonlyObservableArray, Observable, ObservableArrayAction } from '../Core/Observable';
import { IItemProvider } from './Provider';
interface IAggregateItemProviderEntry<T> {
    items: T[];
    provider?: IReadonlyObservableArray<T> | IItemProvider<T>;
    subscriber?: (args: IObservableArrayEventArgs<T>) => void;
}
/**
 * An AggregateItemProvider takes a set of arrays, ObservableArrays, and ItemProviders and returns listItems from them as if they were a single
 * ItemProvider.
 */
export declare class AggregateItemProvider<T> extends Observable<IObservableArrayEventArgs<T>, ObservableArrayAction> implements IItemProvider<T> {
    get length(): number;
    get value(): T[];
    get collections(): Array<IAggregateItemProviderEntry<T>>;
    private internalCollections;
    private items;
    /**
     * Adds an additional collection of items to the end of the array
     *
     * @param collection Array of items or an observable array of items
     */
    push(collection: T[] | IReadonlyObservableArray<T> | IItemProvider<T>): void;
    getItem(index: number): T | undefined;
    subscribe(observer: (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void, action?: ObservableArrayAction): (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void;
    unsubscribe(observer: (value: IObservableArrayEventArgs<T>, action: ObservableArrayAction) => void, action?: ObservableArrayAction): void;
    private getSubscriber;
}
export {};
