/// <reference types="react" />
import { Observable } from '../../Core/Observable';
import { IFocusZoneProps } from '../../FocusZone';
import { IIconProps } from '../../Icon';
import { IListSelection } from '../../List';
import { ITableColumn } from '../../Table';
import { ITooltipProps } from '../../TooltipEx';
import { ITreeColumn } from '../../TreeEx';
import { IItemProvider } from '../../Utilities/Provider';
import { ISelectionRange } from '../../Utilities/Selection';
export interface IListBoxProps<T = {}> extends IListBoxSharedProps<T> {
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * className to pass to the listbox.
     */
    className?: string;
    /**
     * Callback to be called after the listBox renders.
     */
    didUpdate?: () => void;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * Set to true to exclude all listbox rows from focus zones.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true to remove tab stops from the listbox rows.
     */
    excludeTabStop?: boolean;
    /**
     * focuszoneProps allows the caller to manage the how the list box rows are focused.
     */
    focuszoneProps?: IFocusZoneProps | null;
    /**
     * onActivate is called when the row is activated. Activation occurs on
     * the Enter keystroke or double click.
     *
     * @param event - This is the event that is causing the activation.
     * @param tableRow - Details about the table row being activated.
     */
    onActivate?: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<T>) => void;
    /**
     * Whether or not to display a column with checks or checkboxes for selected items.
     * False by default, unless `props.selection.multiSelect` which makes it default true.
     */
    showChecksColumn?: boolean;
}
export interface IListBoxSharedProps<T = {}> {
    /**
     * Optional tree columns if showTree is passed
     */
    columns?: ITreeColumn<IListBoxItem<T>>[];
    /**
     * className to pass to the listbox's container.
     */
    containerClassName?: string;
    /**
     * This is called when updates are made to the listBox items to update the unselectbale items in the selection.
     */
    getUnselectableRanges?: (items: IListBoxItem<T>[]) => ISelectionRange[];
    /**
     * The caller may supply the set of items to be shown through the ItemProvider or array.
     * The IItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the listbox a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.  Use an IItemProvider or something that implements it like ObservableArray
     * If the items will be changing.
     */
    items: IItemProvider<IListBoxItem<T>> | IListBoxItem<T>[] | string[];
    /**
     * Set to true or false to trigger screen reader loading announcements.  To show a loading indicator, pass an item of type ListBoxItemType.Loading in items.
     */
    loading?: boolean | Observable<boolean>;
    /**
     * onToggle is called when an item is either expanded or collapsed. This will only do anything if the list box is being displayed as a tree.
     *
     * @param event - This is the event that is causing the toggle.
     * @param treeItem - Details about the list item being toggled.
     */
    onToggle?: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<T>) => void;
    /**
     * onSelect is called when the row is selected. Selection occurs on the
     * Space keystroke or click.
     *
     * @param event - This is the event that is causing the selection.
     * @param item - Details about the list row being selected.
     */
    onSelect?: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<T>) => void;
    /**
     * If provided, this will be called on each item to determine how it's rendered.
     */
    renderItem?: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IListBoxItem<T>>, tableItem: IListBoxItem<T>) => JSX.Element;
    /**
     * Set to true to show a searching indicator in place of the list and make a screenreader announcement.  Set to null to cancel a search without making
     * an announcement.
     */
    searching?: boolean | Observable<boolean | null>;
    /**
     * String to show when a search is in progress.
     */
    searchResultsLoadingText?: string;
    /**
     * The selection maintains the selected state and defines the selection behavior of the list box.  Defaults to a ListSelection
     * with selectOnFocus set to false if not provided.  Selection should be specified on mount and not updated to a new object
     * during the Listbox's lifecycle.
     */
    selection?: IListSelection;
    /**
     * Set to true to show any current items while searching for more.
     * @default false
     */
    showItemsWhileSearching?: boolean;
    /**
     * Whether or not to display items as a tree rather than a list
     * ListBox will construct a tree using the parent field of ListBoxItems
     */
    showTree?: boolean;
    /**
     * The width of the listbox.
     * @default 100%
     */
    width?: number;
}
export interface IListBoxItem<T = {}> {
    /**
     * className to pass to the item's cell.
     */
    className?: string;
    /**
     * Optional item data to be used in custom render function.
     */
    data?: T;
    /**
     * Disabled items will get a disabled style by default and be ignored by focus and selection.
     */
    disabled?: boolean;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * Expand this item when ListBox builds the tree
     */
    expanded?: boolean;
    /**
     * Provide to indicate this item belongs to a group.  Use a GroupedItemProvider to arrange grouped items.
     * This id is passed to the header html element for the group so it should be a valid html id.
     */
    groupId?: string;
    /**
     * Provide to render the item as a Link.
     */
    href?: string;
    /**
     * Props specifying the icon to render beside the item text.
     */
    iconProps?: IIconProps;
    /**
     * Unique identifier of the item.
     */
    id: string;
    /**
     * Optional parent of this item, used to build a tree in ListBox
     */
    parent?: IListBoxItem<T>;
    /**
     * Text to render in the item's row.
     */
    text?: string;
    /**
     * Optional tooltip props to apply to the ListBox row for this item.  By default, an overflow tooltip is
     * rendered with the item's text.
     */
    tooltipProps?: ITooltipProps;
    /**
     * A function to render custom item content.
     */
    render?: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IListBoxItem<T>>, tableItem: IListBoxItem<T>) => JSX.Element;
    /**
     * The type of list item.  Headers and Separators ignore focus and selection.
     */
    type?: ListBoxItemType;
}
export interface IListBoxGroup<T = {}> {
    /**
     * Unique identifier for the group.
     */
    id: string;
    /**
     * Set to true to indicate this group is loading.  The GroupedItemProvider will check this value and add a loading cell if true.
     */
    loading?: boolean;
    /**
     * Provide a custom loading item to be added if loading is true.
     */
    loadingItem?: IListBoxItem<T>;
    /**
     * Display name for the group.  Not needed if you are supplying your own header items.
     */
    name?: string;
}
export declare enum ListBoxItemType {
    Row = 1,
    Header = 2,
    Divider = 3,
    Loading = 4
}
export interface ILoadingCellProps<T> {
    /**
     * The index of the column this cell is being rendered in.
     */
    columnIndex: number;
    /**
     * The column this cell is being rendered in.
     */
    tableColumn: ITableColumn<IListBoxItem<T>>;
    /**
     * The listbox item associated with this cell.
     */
    tableItem: IListBoxItem<T>;
    /**
     * Function to call after the row has finished rendering.  Use this to trigger data fetching.
     */
    onMount?: () => void;
}
