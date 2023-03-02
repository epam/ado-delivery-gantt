/// <reference types="react" />
import { IListSelection } from '../../List';
import { IListBoxItem, IListBoxSharedProps } from '../../ListBox';
import { ISelectionRange } from '../../Utilities/Selection';
import { IDropdownCalloutProps } from "./DropdownCallout.Props";
import { IDropdownExpandableProps, IDropdownExpandableTextFieldProps } from "./DropdownExpandable.Props";
export interface IDropdownProps<T = {}> extends IListBoxSharedProps<T>, Pick<IDropdownCalloutProps<T>, "actions" | "calloutContentClassName" | "filteredNoResultsText" | "filterPlaceholderText" | "noItemsText" | "showFilterBox" | "userFilteredItems" | "userFilteredItemsIndexMap" | "renderBeforeContent" | "showTree">, Pick<IDropdownExpandableProps<T>, "ariaLabel" | "ariaLabelledBy" | "className" | "disabled" | "excludeTabStop" | "inputId" | "onCollapse" | "onExpand" | "placeholder" | "required">, Pick<IDropdownExpandableTextFieldProps, "autoSelect" | "showPrefix"> {
    /**
     * Set to false to keep the callout open when an item is selected.
     * By default the callout will close on select unless multiselect or selectOnFocus is enabled on selection.
     */
    dismissOnSelect?: boolean;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * Set to false to not do any text filtering when the user types in the filter box.  Do this if you want
     * to control filtering through userFilteredItems.
     * @default: true
     */
    filterByText?: boolean;
    /**
     * Optional method to perform a custom filter of items based on filter text.
     * If not provided, it will filter items based on item.text.
     */
    filterItem?: (filterText: string, item: IListBoxItem<T>, items: IListBoxItem<T>[]) => boolean | number[];
    /**
     * The throttle wait time to use when updating the filter. The text field
     * will still update on every keystroke, but the updating the filter
     * itself will be throttled by this amount. The default value is 0 ms.
     * Passing a value of 0 here will cause this text field not to be throttled.
     */
    filterThrottleWait?: number;
    /**
     * This is called when updates are made to the listBox items to update the unselectbale items in the selection.
     */
    getUnselectableRanges?: (items: IListBoxItem<T>[]) => ISelectionRange[];
    /**
     * Function which returns the callout for this dropdpown.
     */
    renderCallout?: (props: IDropdownCalloutProps) => JSX.Element;
    /**
     * Function which returns the Expandable for this dropdown.
     */
    renderExpandable?: (props: IDropdownExpandableProps) => JSX.Element;
    /**
     * Renderer for selected items in the expandable.  Defaults to rendering the selected item's text.
     */
    renderSelectedItems?: (selection: IListSelection, items: IListBoxItem<T>[]) => JSX.Element | string;
    /**
     * Supply for a custom width for the callout.  By default, the callout's width will be the same as the
     * expandable.  To change the expandable width, set a className.
     */
    width?: number;
    /**
     * Provide a minimum width for the callout
     */
    minCalloutWidth?: number;
}
/**
 * Result from filtering a list of dropdown items
 */
export interface IFilterResults<T> {
    /**
     * The array of items matching the filter
     */
    filteredItems: IListBoxItem<T>[];
    /**
     * An arrary mapping each filteredItem to its index in the original items array
     */
    filteredIndexMap: number[];
    /**
     * An array of indices of matches within each given item (used to bold the matching text)
     */
    filterMatches: number[][];
}
