import { IObservable, IObservableArray, IObservableArrayEventArgs, ObservableArrayAction } from '../Core/Observable';
import { IListBoxGroup, IListBoxItem } from '../ListBox';
import { IItemProvider } from './Provider';
export declare class GroupedItemProvider<T = {}> implements IItemProvider<IListBoxItem<T>>, IObservable<IObservableArrayEventArgs<IListBoxItem<T>>, ObservableArrayAction>, IObservableArray<IListBoxItem<T>> {
    private manageHeaders;
    private listItems;
    private internalGroups;
    private groupedItems;
    /**
     * Create a Provider that arranges IListBoxItems by their groupId.
     * @param initialItems The initial set of items.  Items will be arranged in group order,
     * and dividers and headers will be moved to the top of each group.
     * @param initialGroups The initial set of groups.  Items will be arranged in the order specified by this set.
     * @param manageHeaders Set to true to have the provider create headers and dividers for groups that don't already have them.
     * Headers created this way will have text matching the group's name.
     */
    constructor(initialItems: IListBoxItem<T>[], initialGroups: IListBoxGroup<T>[], manageHeaders?: boolean);
    /**
     * Get the internal array of groups.
     */
    get groups(): IListBoxGroup<T>[];
    /**
     * Get the length of the listItems array.
     */
    get length(): number;
    /**
     * Get the interal array of listItems.
     */
    get value(): IListBoxItem<T>[];
    /**
     * Subscribe to changes in the underlying set of items.
     * @param observer the delegate to be called when there are updates.
     * @param action the action on the set to observe.
     */
    subscribe(observer: (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void;
    /**
     * Unsubscribe from changes in the underlying set of items.
     * @param observer the delegate that was used to subscribe.
     * @param action the action that was used to subsribe.
     */
    unsubscribe(observer: (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): void;
    /**
     * Add items to the end of whichever group they belong to.
     * @param items a list of items to add.
     */
    push(...items: IListBoxItem<T>[]): number;
    /**
     * Add groups to the end of the group list.  If there are items with these group id's already in the
     * item set they will arrange into these new groups.
     * @param groups
     */
    pushGroups(...groups: IListBoxGroup<T>[]): number;
    /**
     * Remove the last item in the item set and return it.
     */
    pop(): IListBoxItem<T> | undefined;
    /**
     * Remove all items that match the given filter.
     * @param filter the filter function to run on all items.  If this returns true, the item will be deleted.
     */
    removeAll(filter?: (item: IListBoxItem<T>) => boolean): IListBoxItem<T>[];
    /**
     * Remove and add items from a provided index.  Added items will be arranged by their groupId.
     * @param start the index to start insertion and deletion.
     * @param deleteCount the number of items to delete.
     * @param itemsToAdd the items to insert at the start index.
     */
    splice(start: number, deleteCount: number, ...itemsToAdd: IListBoxItem<T>[]): IListBoxItem<T>[];
    /**
     * Changes a subsection of the items to a different set of items.  Use over splice if you want to optimize by listening to the change event instead.
     * @param start the index to start the change.
     * @param itemsToAdd the items to replace the current set with.
     */
    change(start: number, ...items: IListBoxItem<T>[]): number;
    /**
     * Remove and add groups from a provided index.  All items in deleted groups will be removed from the item set.
     * @param start the index to start insertion and deletion.
     * @param deleteCount the number of groups to delete.
     * @param groupsToAdd the groups to insert at the start index.
     */
    spliceGroups(start: number, deleteCount: number, ...groupsToAdd: IListBoxGroup<T>[]): IListBoxGroup<T>[];
    /**
     * Set a group's loading status to true or false.  A loading item will be added or removed from the group.
     * @param groupId The group to set the loading status of.
     * @param loading Set to true to add a loading row.  Set to false to remove a loading row.
     * @param loadingItem Provide this to use a custom loading item, otherwise a standard spinner item will be used.
     */
    setGroupLoading(groupId: string, loading: boolean, loadingItem?: IListBoxItem<T>): void;
    /**
     * Add headers and didvers to groups that don't already have them.
     * @param start the groupMap index to add header/dividers to.
     * This is 1 more than the internalGroup index since there is an unassigned group at index 0.
     * @param count the number of groups that are new and may need headers.
     */
    private addHeaders;
    /**
     * Add groups to the internal list of groups.  Items from the unsassigned group will be moved to the new groups
     * If they have a matching groupId.
     * @param index the index to add the groups at.
     * @param groups the groups to add.
     */
    private addGroups;
    /**
     * Add items to the item set, arranging them according to their groupId.
     * @param items the items to add.
     * @param addToListItems set to false to only add to groupedItems and not to full listItems set.
     * @param index the index to try to add the item to.  If the index is out of the bounds of the item's group,
     * it will be added at the closest index.
     */
    private addItems;
    /**
     * Diff this.groupedItems and this.listItems and splice in the extra items in as few splices as possible.
     */
    private addToListItems;
    private addItem;
    /**
     * Removed items from the internal groupedItems lists and optionally from the actual list of items.
     * @param items the items to remove.
     * @param removeFromListItems Whether or not to remove the items from the list of items.
     */
    private removeItems;
}
