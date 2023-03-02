import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IFocusZoneProps } from '../../FocusZone';
import { IIconProps } from '../../Icon';
import { ILinkProps } from '../../Link';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { BoltDragEvent } from '../../Utilities/DragDrop';
import { IItemProvider } from '../../Utilities/Provider';
import { IIndexed, ISelectableUI, ISelection, ISelectionRange, ISelectOptions } from '../../Utilities/Selection';
/**
 * The IListCellDetails is used to describe the elements and indexes for a given cell.
 * The header row uses rowIndex = -1.
 */
export interface IListCellDetails {
    cellElement: HTMLElement | null;
    cellIndex: number;
    rowElement: HTMLElement | null;
    rowIndex: number;
}
/**
 * An IListRow is used to communicate details about a given row in a list.
 */
export interface IListRow<T> extends IIndexed {
    /**
     * Data that represents the instance of T for this row. In some cases the
     * row data may not be available.
     */
    data: T;
}
export interface IFilteredListSelection extends IListSelection {
    /**
     * Let the filtered selection know that its parent selection has changed.
     * @param value the selection ranges returned from the change on the parent selection.
     * @param action the action that occured on the parent selection.
     */
    selectionChanged: (value: ISelectionRange[], action: string) => void;
    /**
     * Using the parent selection and a map of filtered indices to parent selection indices,
     * update the state of the filteredSelection.
     * @param filteredIndexMap a mapping of filtered indices to parent selection indices
     */
    updateFilteredSelection: (filteredIndexMap: number[]) => void;
}
/**
 * The List uses an IListSelection to manage the selection state for the
 * rows within the list. This is required for a multi-select list and optional
 * for single select lists. For single select the caller can just use the
 * onSelect property to detect selection changes.
 */
export interface IListSelection extends ISelection, IBehavior<{}, ISelectableUI> {
    /**
     * Whether or not this selection will select items when they receive focus.
     */
    selectOnFocus: boolean;
}
/**
 * Options to describe the list selection behavior.
 */
export interface IListSelectionOptions extends ISelectOptions {
    /**
     * Set to true to select items when they receive focus.
     * @default true
     */
    selectOnFocus?: boolean;
}
export interface IOverlayRenderProps {
    rowElement: HTMLElement;
}
export interface IRowOverlayableUI {
    /**
     * addOverlay is used to create, or update an existing, overlay over an existing list row.
     * This allows the caller to apply effects to the row by having elements
     * that appear over top of the row.
     *
     * @param id This is a unique id for this overlay.
     * @param rowIndex The index of the row the overlay should hover over.
     * @param render A function which returns the React nodes that should be placed within the overlay.
     *  The parent element will be positioned, and have the same height and width
     *  as the underlying row element.
     * @param zIndex If there are multiple overlays the caller can use the zIndex
     *  parameter to ensure they are layered correctly.
     * @param columnIndex The index of the column the overlay should hover over (used for column header drag/drop)
     */
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number, columnIndex?: number): void;
    /**
     * removeOverlay is used to remove an overlay that has already been registered.
     * The unique id is all that is needed.
     * @param id This is a unique id for this overlay.
     */
    removeOverlay(id: string): void;
}
export interface IDragDroppableUI extends ISelectableUI, IRowOverlayableUI {
}
export interface BoltListDragEvent<T, D> extends BoltDragEvent<T, D, IListDragDropSecondaryData> {
}
export interface IListDragDropSecondaryData {
    readonly index: number;
    readonly sourceId: string;
}
export interface IListMaterializedStats {
    firstMaterialized: number;
    firstRendered: number;
    lastMaterialized: number;
    lastRendered: number;
}
/**
 * IList<T> is the interace the List component exposes for use by callers.
 * If they ref the component they should access the List with this interface.
 */
export interface IList<T> extends ISelectableUI, IRowOverlayableUI {
    /**
     * Sets the focus to the given row after scrolling to it. If it's not focusable, it will use `direction` to find the closest one.
     * @param rowIndex The index of the row to focus.
     * @param direction Use 1 or -1 to try previous or next rows when given row is not focusable.
     */
    focusRow(rowIndex: number, direction?: number): Promise<void>;
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
    getStats(): IListMaterializedStats;
}
/**
 * An interface to group properties that get passed to the row renderer of each list row.
 */
export interface IListItemDetails<T> {
    /**
     * Sets aria-busy on the list item element.
     */
    ariaBusy?: boolean;
    /**
     * Sets aria-describedby on the list item element.
     */
    ariaDescribedBy?: string;
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * Sets aria-posinset on the tr element.  Defaults to the item index.
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
     * Sets aria-setsize on the tr element.  Defaults to the itemProvider length.
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
     * Set to true to exclude the list item from the focus zone.
     */
    excludeFocusZone?: boolean;
    /**
     * If false, the row will get tabIndex=0, otherwise tabIndex=-1.
     * @default true
     */
    excludeTabStop?: boolean;
    /**
     * Properties used to render the list as a whole.
     */
    listProps: IListProps<T>;
    /**
     * The row MUST call onFocusItem when a row or one of the child elements of the row receives focus.
     */
    onFocusItem: (rowIndex: number, event: React.FocusEvent<HTMLElement>) => void;
    /**
     * Set to true if text in the list row should be selectable.
     */
    selectableText?: boolean;
    /**
     * If true, will make cursor display as a pointer when hovering over the item otherwise default.
     */
    singleClickActivation?: boolean;
}
/**
 * IListProps are used to describe the set of features used by the List component
 * and any attached behaviors.
 *
 * The list provides NO scrolling or virutalization behaviors by default. It requires
 * the user to define the behavior through an Intersection component. This is used to
 * monitor the visiblity with the intersections viewport.
 *
 * If the user just wants a List where its contents scroll, make sure you use a
 * ScrollableList or SimpleList with scrollable set to true, instead of a List. If
 * the user wants to embed the list in scrollable element with other elements the
 * scrolling element should have an Intersection defined around it.
 */
export interface IListProps<T> {
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
     * Amount to offset the aria-rowcount attribute of a list. This should be added
     * to the number of items in the list to produce the aria-rowcount. The common use case for this property
     * is accounting for the header row of a Table. Per the ARIA spec, a header row should be included in
     * the aria-rowcount.
     *
     * @default 0
     */
    ariaRowOffset?: number;
    /**
     * The number of columns visible to the screen reader.
     *
     * By default this is the value of columnCount
     */
    ariaColumnCount?: number;
    /**
     * Aria label property for the list.
     */
    ariaLabel?: string;
    /**
     * Behaviors can be added to the list and monitor events and interact with the
     * component through the IList methods.
     */
    behaviors?: IBehavior<Partial<IListProps<T>>, Partial<IList<T>>>[];
    /**
     * CSS className to add to the list root element.
     */
    className?: string;
    /**
     * Number of columns the list is going to represent. This is important to get
     * correct if the contents are going to show as multi-column since the
     * virtualization is emitting elements (non-visible) into the list for paging.
     *
     * By default the list is a single column value.
     */
    columnCount?: number;
    /**
     * The index of the row that should be tabbable before the list has received focus.
     * @default 0
     */
    defaultTabbableRow?: number;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * The caller can supply an EventDispatch to the list if it wishes to
     * participate it extending the behaviors. If one isn't supplied the list will
     * create its own dispatcher when behaviors are supplied.
     */
    eventDispatch?: IEventDispatch;
    /**
     * The element should not be tabable but still should be able to receieve focus.
     */
    excludeTabStop?: boolean;
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
     * initialPageCount is used when the list is drawing pages and no pages are
     * visible. This primarily happens when the list is initially rendered.
     *
     * The impact of setting this value effects performance of the initial render.
     * Since the component performs 0 measurements it renders the initialPages and
     * uses the IntersectionObserver to determine whether or not it has filled the
     * components viewport. This means that in the first pass it will render the
     * requested rows and then update the rows after the observer reports on the
     * visibility of the rendered pages. If 3 was not enough to fill the UI it will
     * render more, but this will happen async.
     *
     * The default is 3 pages with a default of 10 rows per page - 30 rows..
     */
    initialPageCount?: number;
    /**
     * The maximum height of the table when virtualized. Browsers have issues
     * rendering elements that are too large and when the List contains thousands
     * of elements, the list renders very large spacer elements to correctly
     * position the scroll bar. The large spacer elements cause rendering issues
     * across browsers. To bypass this, we need to limit how large the list can
     * grow to. By default this size is 100,000px. However, if you have multiple
     * items within a scrollable region, this number might need to be reduced.
     * For instance, if you have 5 lists that can contain a lot of rows in the
     * same scrollable region, you would likely want to set the max height for
     * each list to 20,000. Keep in mind that the smaller this number, the harder
     * it will be for a user to scroll with precision.
     *
     * @default 100000
     */
    maxHeight?: number;
    /**
     * maxWidth is used to control the maximum width of the list.
     */
    maxWidth?: string;
    /**
     * minWidth is used to control the minumum width of the list.
     */
    minWidth?: string;
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
    onFocus?: (event: React.SyntheticEvent<HTMLElement>, listRow: IListRow<T>) => void;
    /**
     * onSelect is called when the row is selected. Selection occurs on the
     * Space keystroke or click.
     *
     * @param event - This is the event that is causing the selection.
     * @param listRow - Details about the list row being selected.
     */
    onSelect?: (event: React.SyntheticEvent<HTMLElement>, listRow: IListRow<T>) => void;
    /**
     * pageSize controls the granularity of row rendering. The list always renders
     * a full page worth of rows even when they are not needed to fill the viewport.
     *
     * Smaller values will help reduce the number of wasted rows that are rendered
     * outside the viewport, but will force the list to re-render more often as
     * scrolling occurs.
     */
    pageSize?: number;
    /**
     * When a row's value is given as an ObservableValue with an undefined value,
     * the list will render a Loading row for the content. The default will be
     * a shimmer row that is semi random and matches the content.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param details Additional details about this row.
     */
    renderLoadingRow?: (rowIndex: number, details: IListItemDetails<T>) => JSX.Element;
    /**
     * All callers must supply a function for rendering the list row.
     *
     * The requirements of this function are quite complicated and before writing
     * a new row renderer you should ensure one doesnt already exist that solves
     * your needs.
     *
     * Requirements:
     *
     * 1) The row function MUST return a singlely rooted component that resolves
     * to single rooted element, or return a single element that is either a <tr>
     * or another acceptable tag that is marked as a display: table-row.
     *
     * 2) The row function MUST only include direct child elements that are either
     * <td>'s or acceptable elements that are maked as display: table-cell. The
     * renderer MUST return one element for each defined column even if there is
     * no data to be rendered in the column.
     *
     * 3) The row function MUST call onFocusItem when either the row element or
     * any of the rows child elements receive the focus. This is needed to ensure
     * navigation within the list as well as in and out of the list function
     * correctly.
     *
     * Exception: If your list doesn't support row level focus/selection.
     *
     * 4) The row function MUST add data-row-index on the row element.  This is
     * needed to ensure mouse events can be translated to rows.
     *
     * 5) The row function MAY dispatch events for behaviors but is not required.
     * If any events are dispatched they should be documented on the row renderer.
     *
     * 6) The row function is responsible for all accessibility and focus
     * management within the row.
     *
     * Exception: If your list doesn't support row level focus/selection.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param item This is the object that represents the current rows data.
     * @param details Additional details to handle aria attributes and focus.
     */
    renderRow: (rowIndex: number, item: T, details: IListItemDetails<T>) => JSX.Element | null;
    /**
     * Lists MAY render a header above the list contents. This is done through the
     * onRenderHeader. Like the renderRow method, there are set of restrictions the
     * implmentation MUST follow.
     *
     * Requirements:
     *
     * 1) The header function MUST return a singlely rooted component that resolves
     * to single rooted element, or return a single element that is either a <tr>
     * or another acceptable tag that is marked as a display: table-row.
     *
     * 2) The header function MUST only include direct child elements that are either
     * <td>'s or acceptable elements that are maked as display: table-cell. The
     * renderer MUST return one element for each defined column even if there is
     * no data to be rendered in the column.
     */
    renderHeader?: () => JSX.Element;
    /**
     * role defines the aria role of the list and defaults to "listbox"
     */
    role?: string;
    /**
     * If the caller has variable height rows they can specify the rowHeight they
     * want used to estimate the size of virtualized rows. This means that when rows
     * are not rendered, the component will create virtual space for those rows to
     * ensure the scrolling behavior acts appropriately.
     *
     * If the list has fixed size rows there is no need to specify a rowHeight. The
     * list will determine the height of the rows after the initial render when
     * the observer reports on page visibility.
     *
     * Question: How do I determine the rowHeight if their are variable height rows.
     * This one is a tough question, and the general answer is come up with a fair
     * average for the rows on a given page. If the select too large or too small
     * scrolling behaviors can become a bit odd, generally select on the smaller
     * side if you are unsure.
     */
    rowHeight?: number;
    /**
     * An array of heights to be used when calculating the spacer heights.  If not supplied, the heights used
     * will be estimations.
     */
    rowHeights?: number[];
    /**
     * Set to true to allow text selection on all list rows.
     */
    selectableText?: boolean;
    /**
     * A selection object can be supplied for managing the list selection. This
     * is not required since the list offers onSelect as a delegate. If the caller
     * wants multi-selction they must use an IListSelection that supports multi
     * select.  Selection should be specified on mount if used and not updated to
     * a new object during the List's lifecycle.
     *
     * There is a basic ListSelection implementation available from the List
     * component.
     */
    selection?: IListSelection;
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
     * Whether we should allow scrolling on this list
     * If false, we will add scroll-hidden css class to the list
     *
     * @default false
     */
    showScroll?: boolean;
    /**
     * If virtualize false is supplied the list will render all the items supplied
     * to it. This shouldn't be used unless you know you have a limited number of
     * rows. Virtualization is used to avoid performance problems.
     */
    virtualize?: boolean;
    /**
     * width can be any supported css width value, either a %, px, and vw value.
     */
    width?: string;
    /**
     * This determines which element will be used for the overlay instead of the default element.
     * The format expected here is the CSS selector.
     */
    overlay?: string;
}
/**
 * ISimpleListCell instances are used with the SimpleList to render basic cells
 * in a list or table. It supports an optional icon, text and the text can be made
 * into a hyper link.
 */
export interface ISimpleListCell {
    /**
     * iconProps for the icon within the cell.
     */
    iconProps?: IIconProps;
    /**
     * text that should within the cell.
     */
    text?: string;
    /**
     * Optional node that will render instead of the text string.
     * Separate to preserve needed access to the text like with sorting.
     */
    textNode?: React.ReactNode;
    /**
     * Optionally className that should be applied to the text.
     */
    textClassName?: string;
    /**
     * A link that should be applied to the text of the cell.
     */
    href?: string;
    /**
     * Optional.  Where to display the linked URL, as the name for a browsing context.  Used only if href is defined.
     * See https://developer.mozilla.org/docs/Web/HTML/Element/a for more information.
     */
    hrefTarget?: string;
    /**
     * Optional.  The relationship of the linked URL as space-separated link types.  Used only if href is defined.
     * See https://developer.mozilla.org/docs/Web/HTML/Element/a for more information.
     */
    hrefRel?: string;
}
/**
 * Scrollable lists use a container to house the list. This container can be
 * hooked up to a scroll event handler.
 */
export interface IScrollableListProps<T> extends IListProps<T> {
    /**
     * onScroll is called when the list is scrolled. This event is not throttled.
     *
     * @param event Scroll event details
     */
    onScroll?: (event: React.SyntheticEvent<HTMLElement>) => void;
    /**
     * Scrollable List has an outer div. Use this to add classes to it. Use className to
     * add classes to the inner list element.
     */
    outerClassName?: string;
}
/**
 * ISimpleListProps are used to create a SimpleList. The SimpleList renders its
 * rows using either an ISimpleCell, string, or number.
 */
export interface ISimpleListProps extends Pick<IListProps<ISimpleListCell | string | number>, Exclude<keyof IListProps<ISimpleListCell | string | number>, "renderRow">> {
    /**
     * scrollable should be set to true if the list is not contained in a
     * scrolling element. This will ensure the list scrolls vertically within
     * the list element itself.
     */
    scrollable?: true;
}
/**
 * If the caller wants to control the row they can render the entire row on their
 * own, or they can use a ListItem to get the majority of the row handled.
 *
 * Using the ListItem instead of renderListItem gives the caller access to more
 * detailed control over the list item. An example is the ability to render the
 * list item as a link (a tag) instead of a table row.
 */
export interface IListItemProps<T> {
    /**
     * css class that will be added to the list item.
     */
    className?: string;
    /**
     * Details about the list item being rendered. This is given to the caller
     * when a row needs to be rendered.
     */
    details: IListItemDetails<T>;
    /**
     * Index of the row that is being rendered.
     */
    index: number;
    /**
     * If the list item should be rendered as a link, the caller can supply the
     * links properties. These are merged with the lists properties to build
     * a list row that is a anchor instead of a table row.
     */
    linkProps?: ILinkProps;
    /**
     * Id of represented work item
     */
    itemId?: number;
    /**
     * Desired tab index
     */
    tabIndex?: number;
}
