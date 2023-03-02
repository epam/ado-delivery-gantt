/// <reference types="react" />
import { ObservableValue } from '../../Core/Observable';
import { IDropdownPivot } from '../../Dropdown';
import { IListSelection } from '../../List';
import { IListBoxItem } from '../../ListBox';
import { IFilter } from '../../Utilities/Filter';
import { IItemProvider } from '../../Utilities/Provider';
export interface IFilterProps<T = {}> {
    /**
     * The currently selected filter.  If omitted, the Filter will keep track of this internally.
     */
    activeFilter?: ObservableValue<IFilterItem<T> | null>;
    /**
     * Specify an item to be highlighted as a best hit when the user performs a top level search in the filter box.
     */
    bestHitItem?: ObservableValue<IListBoxItem<T>>;
    /**
     * Classname to pass to the Filter's Expandable Button.
     */
    className?: string;
    /**
     * Set to false to not do any text filtering when the user types in the filter box.  Do this if you want
     * to control filtering through userFilteredItems.
     * @default: true
     */
    filterByText?: boolean;
    /**
     * The store object that holds the filter state.
     */
    filterStore: IFilter;
    /**
     * Items that correspond to different keys within the filterStore.  Items will render as rows in the inital callout view of the Filter,
     * and if selected will display their items or custom content to select the value for that filter key.
     */
    filterItems: IFilterItem<T>[];
    /**
     * Set to true to hide the back button when a filter is active.
     * @default false
     */
    hideBackButton?: boolean;
    /**
     * The caller may supply the set of items to be shown through the ItemProvider or array.
     * The IItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the underlying listbox a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.  Use an IItemProvider or something that implements it like ObservableArray
     * If the items will be changing.
     */
    items: IItemProvider<IListBoxItem<T>> | IListBoxItem<T>[] | string[];
    /**
     * A callback to notify when the active filter has changed.
     */
    onActiveFilterChanged?: (activeFilter: IFilterItem | null) => void;
    /**
     * A callback to notify when the filter box text has changed.  Do custom searching here and update the filterItem's items.
     */
    onFilterTextChanged?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, newValue: string) => void;
    /**
     * A selection object used by the underlying Dropdown to maintain the selection state.
     */
    selection?: IListSelection;
    /**
     * Set to true to show a reset button instead of a clear button in the active filter view.
     */
    showActiveFilterResetButton?: boolean;
    /**
     * Whether or not the filter button text should change to "Filter on" when there is an active filter
     */
    showFilterOnText?: boolean;
    /**
     * The title displayed at the top of the Filter's callout.
     */
    title?: string;
    /**
     * Provide if you want to show a custom set of filtered items.
     */
    userFilteredItems?: IItemProvider<IListBoxItem<T>> | IListBoxItem<T>[];
    /**
     * The width of the Filter's callout in px.
     * @default 320
     */
    width?: number;
}
export interface IFilterItem<T = {}> extends IDropdownPivot<T> {
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * The key in the filterStore that selection within this item corresponds to.
     */
    filterItemKey: string;
    /**
     * A custom renderer for content rendered before the Listbox in the Dropdown.
     * @param onEditingComplete call this function when the user indicates they are done eidting and wish to return to the top level filter view.
     */
    renderBeforeContent?: (onEditingComplete: () => void) => JSX.Element;
    /**
     * A custom function for rendering the selected items within a filterItem.  This may be required if the ListBoxItems have a custom render function.
     * This should not return table markup, but rather the contents of the table cell each item would normally be rendered in.
     * @param selectedItems A list of ListBoxItems that are selected within this filterItem's items
     */
    renderSelectedItems?: (selectedItems: IListBoxItem<T>[]) => JSX.Element | null;
    /**
     * A custom title to show in the Dropdown when this filterItem is active.
     */
    title?: string;
}
