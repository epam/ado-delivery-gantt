/// <reference types="react" />
import { IObservableArray, IObservableValue, IReadonlyObservableArray, IReadonlyObservableValue, ObservableValue } from '../../Core/Observable';
import { IButtonProps } from '../../Button';
import { ICalloutProps } from '../../Callout';
import { IListBoxItem, IListBoxSharedProps, ListBox } from '../../ListBox';
import { IOrigin } from '../../Utilities/Position';
import { IItemProvider } from '../../Utilities/Provider';
export interface IDropdownCalloutProps<T = {}> extends IListBoxSharedProps<T>, Pick<ICalloutProps, "anchorElement" | "anchorOffset" | "anchorOrigin" | "anchorPoint" | "blurDismiss" | "contentLocation" | "lightDismiss" | "onDismiss"> {
    /**
     * Actions to render in the footer of the dropdown.
     */
    actions?: IReadonlyObservableArray<IButtonProps> | IButtonProps[];
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * ClassName to pass to the callout content.  Use this to override the width.
     */
    calloutContentClassName?: string;
    /**
     * Location on the dropdown to make relative to the expandable location.
     */
    dropdownOrigin?: IOrigin;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * Set to true to exclude all listBox rows from the focusZone
     */
    excludeFocusZone?: boolean;
    /**
     * Set to false to remove the tabIndex from the callout content container.
     */
    excludeTabStop?: boolean;
    /**
     * The final filtered set of items from the dropdown.
     */
    filteredItems?: IObservableArray<IListBoxItem<T>>;
    /**
     * Text to display when there are no filter results.  Will be formatted with the current filter string.
     */
    filteredNoResultsText?: string | IObservableValue<string>;
    /**
     * Text to display while filtered results are loading.
     */
    filteredResultsLoadingText?: string;
    /**
     * Text to show as a placeholder in the filter box.
     */
    filterPlaceholderText?: string;
    /**
     * Pass to specify the text of the filter box.
     */
    filterText: ObservableValue<string>;
    /**
     * Set to false to not set focus to the callout contents when they mount.
     * @default true
     */
    focusOnMount?: boolean;
    /**
     * A unique identifier for this dropdown callout.
     */
    id?: string;
    /**
     * Set to true to prevent default on mouseDown events inside the callout.
     * This keeps the dropdown from closing due to blurDismiss when a mousedown
     * happens inside of it.
     * @default true
     */
    ignoreMouseDown?: boolean;
    /**
     * ClassName to pass to the listbox.
     */
    listBoxClassName?: string;
    /**
     * Ref to forward to the ListBox component.
     */
    listBoxRef?: React.RefObject<ListBox<T>>;
    /**
     * Text to show when there are no items in the listbox.
     */
    noItemsText?: string;
    /**
     * onActivate is called when a listbox row is activated. Activation occurs on
     * the Enter keystroke or double click.
     *
     * @param event - This is the event that is causing the activation.
     * @param tableRow - Details about the table row being activated.
     */
    onActivate?: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<T>) => void;
    /**
     * An optional callback to notify when onKeyDown has been pressed within a filter textbox.
     */
    onFilterKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    /**
     * A callback to notify when the filter text has changed.  Do custom searching here and update the items.
     */
    onFilterTextChanged?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, newValue: string) => void;
    /**
     * Custom content to render before the listbox in the dropdown.
     */
    renderBeforeContent?: () => JSX.Element | null;
    /**
     * Set to true to show a filter box above the listBox, or false to hide.  The filter box will show by default
     * If there are 10 or more items in the dropdown.
     */
    showFilterBox?: boolean;
    /**
     * Title to show at the top of the dropdown.
     */
    title?: React.ReactNode;
    /**
     * Set to true to show a close button in the title area of the dropdown.
     */
    showCloseButton?: boolean;
    /**
     * The function that should be called to update the filtered items.
     */
    updateFilteredItems?: () => boolean;
    /**
     * Provide if you want to show a custom set of filtered items.  The items will still be filtered by text in the filterbox unless filterByText is false.
     */
    userFilteredItems?: IItemProvider<IListBoxItem<T>> | IListBoxItem<T>[];
    /**
     * Provides the original item index for each item in userFilteredItems.
     * Optional, if not provided then this will be computed by traversing items for match indices, which can be slow if there are a lot of items.
     */
    userFilteredItemsIndexMap?: IReadonlyObservableValue<number[]>;
}
