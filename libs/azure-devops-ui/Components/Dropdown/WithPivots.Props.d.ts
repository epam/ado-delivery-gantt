/// <reference types="react" />
import { ObservableValue } from '../../Core/Observable';
import { IListBoxItem } from '../../ListBox';
import { IItemProvider } from '../../Utilities/Provider';
import { IDropdownProps } from "./Dropdown.Props";
import { IDropdownCalloutProps } from "./DropdownCallout.Props";
export interface IDropdownPivot<T = {}> extends Pick<IDropdownProps<T>, "actions" | "filterByText" | "filteredNoResultsText" | "filterPlaceholderText" | "items" | "noItemsText" | "showFilterBox" | "userFilteredItems"> {
    /**
     * Unique id for this pivot.
     */
    id: string;
    /**
     * The items to show when this pivot is active.
     */
    items: IItemProvider<IListBoxItem<T>> | IListBoxItem<T>[];
    /**
     * Text to show for this pivot.  Defaults to id if not specified.
     */
    name?: string;
}
export interface IWithPivotsProps<T = {}> {
    /**
     * Props to forward to the DropdownCallout.
     */
    calloutProps?: IDropdownWithPivotsCalloutProps;
    /**
     * The children should be a function that takes IWithPivotsChildProps.
     */
    children: (props: IWithPivotsChildProps) => JSX.Element;
    /**
     * A callback to call when a pivot is clicked.
     */
    onPivotClicked?: (pivot: IDropdownPivot<T>) => void;
    /**
     * A list of pivots to show.
     */
    pivots: IDropdownPivot<T>[];
    /**
     * The id of the currently selected pivot.
     */
    selectedPivot?: string | ObservableValue<string>;
}
export interface IDropdownWithPivotsCalloutProps<T = {}> extends Pick<IDropdownCalloutProps<T>, "anchorElement" | "anchorOffset" | "anchorOrigin" | "anchorPoint" | "dropdownOrigin" | "ignoreMouseDown" | "excludeFocusZone" | "excludeTabStop" | "focusOnMount" | "lightDismiss" | "listBoxClassName" | "listBoxRef" | "onActivate" | "onDismiss" | "onFilterTextChanged" | "title" | "showCloseButton"> {
    /**
     * Pass to specify the text of the filter box.
     */
    filterText?: ObservableValue<string>;
}
export interface IWithPivotsChildProps<T = {}> extends Pick<IDropdownProps<T>, "actions" | "filterByText" | "userFilteredItems" | "filteredNoResultsText" | "filterPlaceholderText" | "noItemsText" | "renderCallout" | "showFilterBox"> {
}
