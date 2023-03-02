import "../../CommonImports";
import "../../Core/core.css";
import "./ListBox.css";
import * as React from "react";
import { ITableColumn } from '../../Table';
import { IItemProvider } from '../../Utilities/Provider';
import { ISelectionRange } from '../../Utilities/Selection';
import { ITreeItem } from '../../Utilities/TreeItemProvider';
import { IListBoxItem, IListBoxProps, ILoadingCellProps } from "./ListBox.Props";
export declare const DefaultListBoxWidth = -100;
export declare class ListBox<T> extends React.Component<IListBoxProps<T>> {
    static defaultProps: {
        getUnselectableRanges: typeof getUnselectableRanges;
        width: number;
    };
    private columns;
    private tabbableIndex;
    private positions;
    private count;
    private multiSelect;
    private selection;
    private wrappedItems;
    private table;
    private tree;
    constructor(props: IListBoxProps<T>);
    componentDidUpdate(): void;
    render(): JSX.Element;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions): void;
    /**
     * Try to pull list box items out of props and variables.
     * Returns undefined in case where IItemProvider was passed in.
     */
    private getListBoxItems;
    private getItemWidth;
    private loadingChanged;
    private searchingChanged;
    private onItemsChanged;
    private onActivate;
    private onSelect;
    private onTreeActivate;
    private onTreeSelect;
    private renderListBoxRow;
    private renderListBoxTreeRow;
    private renderListBoxCell;
}
export declare function renderListBoxCell<T>(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IListBoxItem<T>>, tableItem: IListBoxItem<T>, multiSelect?: boolean): JSX.Element;
/**
 * Retrieve a list of unselectable ranges based on a itemSelectable function.
 * @param items the set of items
 * @param itemSelectable A function that returns false when an items is not selectable.
 *        Defaults to checking that the item type is not header or divider.
 */
export declare function getUnselectableRanges<T>(items: IListBoxItem<T>[], itemSelectable?: (item: IListBoxItem<T>) => boolean): ISelectionRange[];
/**
 * Return whether a ListBoxItem can be selected or not.
 * @param item the ListBoxItem to evaluate
 */
export declare function listBoxItemSelectable<T>(item: IListBoxItem<T>): boolean;
/**
 * When items is a string[], wrap each item in a ListBoxItem.  Otherwise, do nothing.
 * @param items the items prop
 */
export declare function wrapListBoxItems<T>(items: string[] | IListBoxItem<T>[] | IItemProvider<IListBoxItem<T>>): IListBoxItem<T>[] | undefined;
/**
 * Walk through the ListBoxItems and construct a tree
 */
export declare function convertListBoxItemsToTreeItems<T>(items: IListBoxItem<T>[]): ITreeItem<IListBoxItem<T>>[];
/**
 * Helper to get the value of the items prop.  If items is a string[], it should first be wrapped using wrapListBoxItems.
 * If it's an itemProvider, .value will be called on the provider.
 * @param items the items prop.  If items was provided as a string[], it should first be wrapped using wrapListBoxItems.
 */
export declare function getListBoxItemsValue<T>(items: string[] | IListBoxItem<T>[] | IItemProvider<IListBoxItem<T>>): IListBoxItem<T>[];
export declare class LoadingCell<T> extends React.Component<ILoadingCellProps<T>> {
    componentDidMount(): void;
    render(): JSX.Element;
}
export declare function isListBoxItemVisible<T>(item: IListBoxItem<T>): boolean;
