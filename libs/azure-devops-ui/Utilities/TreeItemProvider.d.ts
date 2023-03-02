import * as React from "react";
import { IObservable, IObservableArrayEventArgs, ObservableArrayAction } from '../Core/Observable';
import { IItemProvider } from './Provider';
/**
 * An ITreeItem<T> represents a single item within the tree. These are used as the
 * input type to build a Tree components data structure.
 */
export interface ITreeItem<T> {
    /**
     * Optional set of children for this item. The caller can create the childItems
     * array and leave it empty to note that this item should be rendered as if
     * children exist even though the children are not currently available.
     */
    childItems?: ITreeItem<T>[];
    /**
     * The data of type T that represents the object being rendered by this row.
     */
    data: T;
    /**
     * The current expand/collapse state of this element. Expanded shouldnt be set
     * to true if there are no children.
     */
    expanded?: boolean;
    /**
     * Optional unique identifier for this tree item
     */
    id?: string;
    /**
     * Optional text value for this tree items
     */
    text?: string;
    /**
     * Need to highlight a string as a search result
     */
    highlighted?: boolean;
}
/**
 * When adding items to an ITreeItemProvider the ITreeItemAdd object allows the
 * caller to define a specific location to add a set of items.
 */
export interface ITreeItemAdd<T> {
    /**
     * insertAfter is used to note the location within the parent to add the
     * new items. If insertAfter is not supplied, the items will be added
     * at the beginning of the children.
     */
    insertAfter?: ITreeItem<T>;
    /**
     * The set of items that should be added.
     */
    items: ITreeItem<T>[];
}
/**
 * The tree uses the ITreeItem<T> objects supplied to build an internal data
 * structure of ITreeItemEx<T> objects. These have computed details that help
 * improve the rendering performance of the tree.
 *
 * NOTE: These are not the same objects as the ones supplied by the caller.
 */
export interface ITreeItemEx<T> {
    /**
     * ClassName to pass to the item's cell.
     */
    className?: string;
    /**
     * This is the number of parents this tree item has. The depth represents how
     * indented the tree item will be rendered.
     */
    depth: number;
    /**
     * An optional toggle callback that should be used for this tree item. If no
     * toggle method is supplied their wont be any default expand/collapse toggle
     * rendered.
     */
    onToggle?: (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>, treeItem: ITreeItemEx<T>) => boolean | void;
    /**
     * The parent of this tree item. If the item is a root item the parent is
     * undefined.
     */
    parentItem?: ITreeItemEx<T>;
    /**
     * We track the underlying item on the extended item.
     */
    underlyingItem: ITreeItem<T>;
}
/**
 * An ITreeItemProvider is designed to store and manage the state of a tree.
 * As items are added/removed, expanded/collapsed, the providers "value" will
 * represent the current set of ordered items within the tree.
 *
 * NOTE: When making changes to the items in the Provider, DO NOT use the
 * underlying Observable methods, use the TreeItem specific API's. The
 * underlying objects are managed by the provider.
 */
export interface ITreeItemProvider<T> extends IItemProvider<ITreeItemEx<T>> {
    readonly roots: Readonly<ITreeItem<T>[]>;
    /**
     * add can be used to add a single item to the tree at a given location. If the
     * specified parentItem or insertAfter are not in the tree or the insertAfter is not
     * a child of parentItem, the addition will be ignored.
     *
     * @param item The item to add to the tree.
     * @param parentItem The direct parent of the item being added.
     * If this is a rootItem leave the parentItem undefined.
     * @param insertAfter The sibling item this item should be inserted after.
     * If this is the first item within the parent leave insertAfter undefined.
     */
    add: (item: ITreeItem<T>, parentItem?: ITreeItem<T>, insertAfter?: ITreeItem<T>) => void;
    /**
     * clear can be used to reset the provider. This is an optimized way to
     * remove all items from the tree.
     */
    clear: () => void;
    /**
     * Remove the specified item from the tree. If the item doesnt exist the
     * remove will be ignored.
     *
     * @param treeItem The item that should be removed from the tree.
     * @param parentItem The parentItem of the item being removed. If the caller
     * doesnt have the parentItem readily available it will be computed, but this
     * can be expensive. The caller should supply it if they can.
     */
    remove: (treeItem: ITreeItem<T>, parentItem?: ITreeItem<T>) => void;
    /**
     * splice is used to update the direct children of a given item
     * in the tree. If the parentItem is supplied and not in the tree the
     * changes will be ignored.
     *
     * @NOTE: Adds are processed before removes, this allows the existing
     * elements to be used as an insertAfter for placement. An item can't
     * be in both the add and remove set. This will cause duplication.
     *
     * @param parentItem The item whos children are being updated. If undefined
     * is supplied the updates will modify the root.
     * @param itemsToRemove The set of items that should removed from the parent.
     * @param itemsToAdd The set of items that should be added to the parent.
     */
    splice: (parentItem: ITreeItem<T> | undefined, itemsToRemove?: ITreeItem<T>[], itemsToAdd?: ITreeItemAdd<T>[]) => void;
    /**
     * toggle is used to update the expand/collapse state of a given tree item.
     *
     * @param treeItem The item whose state should be toggled. If the treeItem is
     * not in the tree the method will no-op.
     */
    toggle: (treeItem: ITreeItem<T>) => void;
}
/**
 * A TreeItemProvider is designed to store and manage the state of a tree.
 * As items are added/removed, expanded/collapsed, the providers "value" will
 * represent the current set of ordered items within the tree.
 */
export declare class TreeItemProvider<T> implements ITreeItemProvider<T>, IObservable<IObservableArrayEventArgs<ITreeItemEx<T>>, ObservableArrayAction> {
    private itemMap;
    private rootItems;
    private tableItems;
    constructor(rootItems?: ITreeItem<T>[]);
    get length(): number;
    get roots(): ITreeItem<T>[];
    get value(): ITreeItemEx<T>[];
    subscribe(observer: (value: IObservableArrayEventArgs<ITreeItemEx<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): (value: IObservableArrayEventArgs<ITreeItemEx<T>>, action?: ObservableArrayAction) => void;
    unsubscribe(observer: (value: IObservableArrayEventArgs<ITreeItemEx<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): void;
    /**
     * add can be used to add a single item to the tree at a given location. If the
     * specified parentItem or insertAfter are not in the tree or the insertAfter is not
     * a child of parentItem, the addition will be ignored.
     *
     * @param item The item to add to the tree.
     * @param parentItem The direct parent of the item being added.
     * If this is a rootItem leave the parentItem undefined.
     * @param insertAfter The sibling item this item should be inserted after.
     * If this is the first item within the parent leave insertAfter undefined.
     */
    add(item: ITreeItem<T>, parentItem?: ITreeItem<T>, insertAfter?: ITreeItem<T>): void;
    /**
     * clear can be used to reset the provider. This is an optimized way to
     * remove all items from the tree.
     */
    clear(): void;
    /**
     * Collapse the node.
     *
     * @param treeItem The item whose state should be collapsed. If the treeItem is
     * not in the tree or if the item is already expanded the method will no-op.
     */
    collapse(treeItem: ITreeItem<T>): void;
    /**
     * Expand the node. Optionally expand all parent nodes.
     *
     * @param treeItem The item whose state should be expanded. If the treeItem is
     * not in the tree the method will no-op.
     * @param expandParents If all parent nodes should be expanded. @default false
     */
    expand(treeItem: ITreeItem<T>, expandParents?: boolean): void;
    /**
     * Remove the specified item from the tree. If the item doesnt exist the
     * remove will be ignored.
     *
     * @param treeItem The item that should be removed from the tree.
     * @param parentItem The parentItem of the item being removed. If the caller
     * doesnt have the parentItem readily available it will be computed, but this
     * can be expensive. The caller should supply it if they can.
     */
    remove(treeItem: ITreeItem<T>, parentItem?: ITreeItem<T>): void;
    /**
     * spliceItems is used to update the direct children of a given item
     * in the tree. If the parentItem is supplied and not in the tree the
     * changes will be ignored.
     *
     * @NOTE: Adds are processed before removes, this allows the existing
     * elements to be used as an insertAfter for placement. An item can't
     * be in both the add and remove set. This will cause duplication.
     *
     * @param parentItem The item whos children are being updated. If undefined
     * is supplied the updates will modify the root.
     * @param itemsToRemove The set of items that should removed from the parent.
     * @param itemsToAdd The set of items that should be added to the parent.
     */
    splice(parentItem: ITreeItem<T> | undefined, itemsToRemove?: ITreeItem<T>[], itemsToAdd?: ITreeItemAdd<T>[]): void;
    /**
     * toggleItem is used to toggle the expand/collapse state of a given tree item.
     *
     * @param treeItem The item whose state should be toggled. If the treeItem is
     * not in the tree the method will no-op.
     */
    toggle(treeItem: ITreeItem<T>): void;
    private addItems;
    private getTableItems;
    private getTableChildCount;
    /**
     * indexOfItem is used to find the index of a source treeItem. The underlying
     * observable indexOf will find instances of ITreeItemEx. This returns the
     * index from the set of items passed to the table.
     *
     * @param treeItem The item to find in the tree.
     * @param fromIndex The index to start the search.
     * @returns If the item is found an index >= 0 is returned, if it is not found -1 is returned.
     */
    private indexOf;
    private removeItem;
}
