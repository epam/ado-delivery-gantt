import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IFocusZoneProps } from '../../FocusZone';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
import { IIndexed, ISelectableUI, ISelection, ISelectOptions } from '../../Utilities/Selection';
import { IListRow } from "./List.Props";
/**
 * The IFixedHeightListCellDetails is used to describe the elements and indexes for a given cell.
 * The header row uses rowIndex = -1.
 */
export interface IFixedHeightListCellDetails {
    cellElement: HTMLElement | null;
    cellIndex: number;
    rowElement: HTMLElement | null;
    rowIndex: number;
}
/**
 * An IFixedHeightListRow is used to communicate details about a given row in a list.
 */
export interface IFixedHeightListRow<T> extends IIndexed {
    /**
     * Data that represents the instance of T for this row. In some cases the
     * row data may not be available.
     */
    data: T;
}
/**
 * The FixedHeightList uses an IFixedHeightListSelection to manage the selection state for the
 * rows within the list. This is required for a multi-select list and optional
 * for single select lists. For single select the caller can just use the
 * onSelect property to detect selection changes.
 */
export interface IFixedHeightListSelection extends ISelection, IBehavior<{}, ISelectableUI> {
    /**
     * Whether or not this selection will select items when they receive focus.
     */
    selectOnFocus: boolean;
}
/**
 * Options to describe the list selection behavior.
 */
export interface IFixedHeightListSelectionOptions extends ISelectOptions {
    /**
     * Set to true to select items when they receive focus.
     * @default true
     */
    selectOnFocus?: boolean;
}
export interface IFixedHeightListMaterializedStats {
    firstMaterialized: number;
    lastMaterialized: number;
}
/**
 * IFixedHeightList<T> is the interace the FixedHeightList component exposes for use by callers.
 * If they ref the component they should access the FixedHeightList with this interface.
 */
export interface IFixedHeightList<T> extends ISelectableUI {
    /**
     * scrollIntoView works like the element method in the browser, but instead of being
     * based on the element scrollIntoView will scroll the row specified by the rowIndex
     * into view.
     *
     * @param rowIndex The 0 based rowIndex that should be scrolled into view.
     * @param options These options are passed on to the underlying element.
     * @param onScrollComplete This delegate is called when the scrolling is complete.
     *  This may not be immediate if the list has to materialize rows to scroll.
     *  NOTE: The rowIndex passed to the delegate will be the requested rowIndex or
     *  -1 if another scrollIntoView request is made before this scroll request completes.
     */
    scrollIntoView: (rowIndex: number, options?: ScrollIntoViewOptions, onScrollComplete?: (rowIndex: number) => void) => void;
    /**
     * Returns an object with the indexes of the first and last materialized and rendered rows.
     *
     */
    getStats(): IFixedHeightListMaterializedStats;
}
/**
 * An interface to group properties that get passed to the row renderer of each list row.
 */
export interface IFixedHeightListItemDetails<T> {
    /**
     * Sets aria-busy on the list item element.
     */
    ariaBusy?: boolean;
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * Sets aria-posinset on the div element.  Defaults to the item index.
     */
    ariaPosInSet?: number | null;
    /**
     * Amount to offset the aria-rowindex attribute of a row. This should be added
     * to the index to produce the aria-rowindex of the row. The common use case for this property
     * is accounting for the header row of a Table. Per the ARIA spec, a header row should be included in
     * the aria-rowcount, and provided an aria-rowindex of 1, meaning the first actual row of the table
     * needs an aria-rowindex of 2.
     *
     * @default 1 The default value is 1 because the aria-rowindex is 1-based instead of 0-based
     */
    ariaRowOffset: number;
    /**
     * Sets aria-setsize on the div element.  Defaults to the itemProvider length.
     */
    ariaSetSize?: number | null;
    /**
     * The data represents the object being rendered in this row. If the caller
     * has asynchronous loading of rows, the data MAY be undefined while we wait
     * for the data to be resolved.
     */
    data?: T;
    /**
     * An event dispatch the row MAY use to dispatch custom events to list behaviors.
     */
    eventDispatch: IEventDispatch;
    /**
     * Properties used to render the list as a whole.
     */
    listProps: IFixedHeightListProps<T>;
    /**
   * The caller MUST supply the set of items to be shown through the ItemProvider.
   * The IItemProvider allows the caller to store their items in the form that
   * bests suits their needs but gives the table a well defined interface for
   * requesting the items. This can include async fetching of items through
   * observables.
   */
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    /**
     * The row MUST call onFocusItem when a row or one of the child elements of the row receives focus.
     */
    onFocusItem: (rowIndex: number, event: React.FocusEvent<HTMLElement>) => void;
    /**
     * If true, will make cursor display as a pointer when hovering over the item otherwise default.
     */
    singleClickActivation?: boolean;
}
/**
 * IFixedHeightListProps are used to describe the set of features used by the FixedHeightList component
 * and any attached behaviors.
 *
 * The list provides NO scrolling but does provide virutalization behaviors by default.
 *
 */
export interface IFixedHeightListProps<T> {
    /**
     * The caller MUST supply the set of items to be shown through the ItemProvider.
     * The IItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the list a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.
     *
     * There is simple ArrayItemProvider<T> for those that just have a set of items
     * they want to supply without writing a custom ItemProvider.
     */
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    /**
     * Aria label property for the list.
     */
    ariaLabel?: string;
    /**
     * CSS className to add to the list root element.
     */
    className?: string;
    /**
     * The index of the row that should be tabbable before the list has received focus.
     * @default 0
     */
    defaultTabbableRow?: number;
    /**
     * The caller can supply an EventDispatch to the list if it wishes to
     * participate it extending the behaviors. If one isn't supplied the list will
     * create its own dispatcher when behaviors are supplied.
     */
    eventDispatch?: IEventDispatch;
    /**
     * focuszoneProps allows the caller to manage the how the list rows are focused.
     * The default focuszone if one isn't supplied is a Vertical non-cyclic focus zone.
     */
    focuszoneProps?: IFocusZoneProps | null;
    /**
     * Unique Id for this list.
     */
    id?: string;
    /**
     * The maximum height of the table when virtualized. Browsers have issues
     * rendering elements that are too large and when the FixedHeightList contains thousands
     * of elements, the list renders very large spacer elements to correctly
     * position the scroll bar. The large spacer elements cause rendering issues
     * across browsers. To bypass this, we need to limit how large the list can
     * grow to. By default this size is 1,000,000px. However, if you have multiple
     * items within a scrollable region, this number might need to be reduced.
     * For instance, if you have 5 lists that can contain a lot of rows in the
     * same scrollable region, you would likely want to set the max height for
     * each list to 200,000. Keep in mind that the smaller this number, the harder
     * it will be for a user to scroll with precision.
     *
     * @default 1000000
     */
    maxHeight?: number;
    /**
     * onActivate is called when the row is activated. Activation occurs on
     * the Enter keystroke or double click.
     *
     * @param event This is the event that is causing the activation.
     * @param listRow Details about the list row being activated.
     */
    onActivate?: (event: React.SyntheticEvent<HTMLElement>, listRow: IListRow<T>) => void;
    /**
     * onFocus is called when a item in the list is focused. Preventing default
     * on the focus event will prevent row selection from occuring even if
     * selectOnFocus is set to true.
     *
     * @param event This is the event that is causing the activation.
     * @param listRow Details about the list row being activated.
     */
    onFocus?: (event: React.SyntheticEvent<HTMLElement>, listRow: IFixedHeightListRow<T>) => void;
    /**
     * onSelect is called when the row is selected. Selection occurs on the
     * Space keystroke or click.
     *
     * @param event - This is the event that is causing the selection.
     * @param listRow - Details about the list row being selected.
     */
    onSelect?: (event: React.SyntheticEvent<HTMLElement>, listRow: IFixedHeightListRow<T>) => void;
    /**
     * Number of elements to materialize when an element is being scrolled to. This should be
     * roughly 1/2 the elements you expect to show on screen
     */
    pageSize: number;
    /**
     * When a row's value is given as an ObservableValue with an undefined value,
     * the list will render a Loading row for the content. The default will be
     * a shimmer row that is semi random and matches the content.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param details Additional details about this row.
     */
    renderLoadingRow?: (rowIndex: number, details: IFixedHeightListItemDetails<T>) => JSX.Element;
    /**
     * All callers must supply a function for rendering the list row.
     *
     * This should render what is inside a row of the list. All focus, and positioning of the
     * rows will be handled by the FixedHeightList itself.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param item This is the object that represents the current rows data.
     * @param details Additional details to handle aria attributes and focus.
     */
    renderRow: (rowIndex: number, item: T, details: IFixedHeightListItemDetails<T>) => JSX.Element;
    /**
     * role defines the aria role of the list and defaults to "listbox"
     */
    role?: string;
    /**
     * Required height of each row. Every row in the tree must be this height and all overflow is hidden.
     * The FixedHeightList control uses this value to absolutely position elements within it.
     */
    rowHeight: number;
    /**
     * A selection object can be supplied for managing the list selection. This
     * is not required since the list offers onSelect as a delegate. If the caller
     * wants multi-selction they must use an IFixedHeightListSelection that supports multi
     * select.  Selection should be specified on mount if used and not updated to
     * a new object during the FixedHeightList's lifecycle.
     *
     * There is a basic FixedHeightListSelection implementation available from the FixedHeightList
     * component.
     */
    selection?: IFixedHeightListSelection;
    /**
     * Should the list select a row when it is clicked?
     * Provides a way to turn off row-click selection when necessary, for things like
     * Table with singleClickActivation
     *
     * @default true
     */
    selectRowOnClick?: boolean;
    /**
     * Using singleClickActivation will activate the item when the row is clicked.
     * Where setting singleClickActivation to false will require a doubleclick to
     * activate a given row.
     *
     * @default false
     */
    singleClickActivation?: boolean;
    /**
     * width can be any supported css width value, either a %, px, and vw value.
     */
    width: string;
}
