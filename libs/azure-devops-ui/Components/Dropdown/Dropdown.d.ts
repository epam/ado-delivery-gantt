import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ObservableArray, ObservableValue } from '../../Core/Observable';
import { IExpandable } from '../../Expandable';
import { FilteredListSelection, IListSelection } from '../../List';
import { getUnselectableRanges, IListBoxItem } from '../../ListBox';
import { ITableColumn } from '../../Table';
import { IFocusable } from '../../Utilities/Focus';
import { IDropdownProps, IFilterResults } from "./Dropdown.Props";
import { DropdownCallout } from "./DropdownCallout";
import { DropdownExpandableTextField } from "./DropdownExpandableTextField";
interface IDropdownState<T> {
    expanded: ObservableValue<boolean>;
    props: IDropdownProps<T>;
    wrappedItems?: IListBoxItem<T>[];
    filteredSelection: FilteredListSelection;
    filterText: ObservableValue<string>;
    filteredItems: ObservableArray<IListBoxItem<T>>;
}
export declare class Dropdown<T = {}> extends React.Component<IDropdownProps<T>, IDropdownState<T>> implements IExpandable, IFocusable<{}> {
    static defaultProps: {
        filterByText: boolean;
        filterItem: typeof filterItemByText;
        getUnselectableRanges: typeof getUnselectableRanges;
        renderCallout: typeof DropdownCallout;
        renderExpandable: typeof DropdownExpandableTextField;
        renderSelectedItems: typeof renderDropdownSelectedItemText;
    };
    static getDerivedStateFromProps<T>(props: IDropdownProps<T>, state: IDropdownState<T>): {
        props: IDropdownProps<T>;
        wrappedItems: IListBoxItem<T>[];
        expanded: ObservableValue<boolean>;
        filteredSelection: FilteredListSelection;
        filterText: ObservableValue<string>;
        filteredItems: ObservableArray<IListBoxItem<T>>;
    };
    private expandable;
    private expandableContainer;
    private filterText;
    private parentSelection;
    private timerManagement;
    constructor(props: IDropdownProps<T>);
    componentDidMount(): void;
    render(): JSX.Element;
    collapse: () => void;
    expand: () => void;
    focus(): void;
    private onDismiss;
    private onExpand;
    private onCollapse;
    private onActivate;
    private onFilterTextChanged;
    private onSelect;
    private selectionChanged;
    private renderCallout;
    private updateFilteredItems;
    private debouncedUpdateFilteredItems;
}
export declare function filterItemByText(filterText: string, item: IListBoxItem<{}>): boolean;
export declare function renderDropdownSelectedItemText(selection: IListSelection, items: IListBoxItem<{}>[]): string;
export declare function filterItems<T = {}>(items: IListBoxItem<T>[], filterTextValue: string, currentFilteredIndexMap?: number[], filterItem?: (filterText: string, item: IListBoxItem, items: IListBoxItem<T>[]) => boolean | number[]): {
    filteredItems: IListBoxItem<T>[];
    filteredIndexMap: number[];
    filterMatches: number[][];
};
/**
 * Filter the tree of items using user-entered text. Include all items with text matching
 * the filter and all their predecessors and descendants in the tree.
 * @returns items matching filter and all their predecessors and descendants in the tree, and the index of the first actual match (since we're returning predecessors)
 */
export declare function filterTreeItems<T = {}>(items: IListBoxItem<T>[], filterText: string, currentFilteredIndexMap?: number[], filterItem?: (filterText: string, item: IListBoxItem, items: IListBoxItem<T>[]) => boolean | number[], filterMatchedItem?: (item: IListBoxItem<T>) => boolean): [IFilterResults<T>, number];
export declare function filterMatchedItemByListboxType<T>(item: IListBoxItem<T>): boolean;
export declare function renderHighlightedText(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IListBoxItem>, tableItem: IListBoxItem, filterResults?: number[]): JSX.Element;
export declare function getHighlightedText(text: string, matchingIndices: number[], className?: string): JSX.Element;
export {};
