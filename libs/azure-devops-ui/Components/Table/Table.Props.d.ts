import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { ScreenSize } from '../../Core/Util/Screen';
import { IFocusZoneProps } from '../../FocusZone';
import { IIconProps } from '../../Icon';
import { ILinkProps } from '../../Link';
import { IList, IListItemDetails, IListRow, IListSelection, ISimpleListCell } from '../../List';
import { ITooltipProps } from '../../TooltipEx';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
/**
 * ITable<T> is the interace the Table component exposes for use by callers.
 * If they ref the component they should access the table using this interface.
 */
export interface ITable<T> extends IList<T> {
}
/**
 * An ITableRow is used communicate details about a given row in a table.
 */
export interface ITableRow<T> extends IListRow<T> {
}
/**
 * ITableRowDetails are used to describe the details of a given row in the table.
 * This information is used in rendering rows.
 */
export interface ITableRowDetails<T> extends IListItemDetails<T> {
    /**
     * css class name to add to the rendered row element.
     */
    className?: string;
    /**
     * id to add to the rendered row element.
     */
    id?: string;
    /**
     * The caller MUST supply the set of items to be shown through the ItemProvider.
     * The IItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the table a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.
     */
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    /**
     * renderSpacer can be supplied to override the spacer columns before and
     * after the actual columns in the table. This is used to apply custom
     * semantics to these areas. The standard spacers should be used unless there
     * is a specific need otherwise.
     */
    renderSpacer?: (rowIndex: number, left: boolean) => React.ReactNode | null;
    /**
     * Sets the aria role on the tr element.
     */
    role?: string;
    /**
     * A selection object can be supplied for managing the table selection. This
     * is not required since the table offers onSelect as a delegate. If the caller
     * wants multi-selction they must use an IListSelection that supports multi
     * select.
     */
    selection?: IListSelection;
    /**
     * Using singleClickActivation will activate the item when the row is clicked.
     * Where setting singleClickActivation to false will require a doubleclick to
     * activate a given row.
     */
    singleClickActivation?: boolean;
    /**
     * Optional tooltip props to pass to the table row.
     */
    tooltipProps?: ITooltipProps;
}
/**
 * TabelRowRenderer function is used to render rows within a table.
 *
 * @param index The zero based index of the row being rendered.
 * @param item The object that represents the row being rendered.
 * @param details This contains both row and table properties that should be used
 *  to render the row and its children appropriately.
 */
export declare type TableRowRenderer<T> = (index: number, item: T, details: ITableRowDetails<T>) => JSX.Element;
/**
 * ITableProps<T> are used to render of Table where each row is represented
 * by type T.
 *
 * If the object for a given row implements the renderRow function, this
 * function is used instead of the table scoped renderRow function. If no
 * renderRow function is available from the item or from the table scope
 * the default TableRow component will be used.
 */
export interface ITableProps<T> {
    /**
     * columns is a required property of a table used to define the column layout
     * for the table.
     */
    columns: Array<ITableColumn<T>>;
    /**
     *  The caller MUST supply the set of items to be shown through the ItemProvider.
     * The IItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the table a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.
     *
     * There is simple ArrayItemProvider<T> for those that just have a set of items
     * they want to supply without writing a custom ItemProvider.
     */
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * Behaviors can be added to the table and monitor events and interact with the
     * component through the ITable methods.
     */
    behaviors?: Array<IBehavior<ITableProps<T>, ITable<T>>>;
    /**
     * CSS className to add to the table root element.
     */
    className?: string;
    /**
     * CSS className to add to the container element.
     */
    containerClassName?: string;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * The caller can supply an EventDispatch to the table if it wishes to
     * participate it extending the behaviors. If one isn't supplied the table will
     * create its own dispatcher when behaviors are supplied.
     */
    eventDispatch?: IEventDispatch;
    /**
     * Set to true to set the tabIndex of the first row to -1 instead of 0.
     */
    excludeTabStop?: boolean;
    /**
     * focuszoneProps allows the caller to manage the how the table rows are focused.
     * The default focuszone if one isn't supplied is a Vertical non-cyclic focus zone.
     */
    focuszoneProps?: IFocusZoneProps | null;
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
     * showHeader determines whether or not the column headers are shown at the top
     * of the table. If a function is passed, this function will be called whenever
     * the screen size changes.
     *
     * @default true
     */
    showHeader?: boolean | ((screenSize: ScreenSize) => boolean);
    /**
     * showLines determines whether or not lines displayed between rows.
     *
     * @default true
     */
    showLines?: boolean;
    /**
     * showScroll determines whether we allow overflow on the table
     * if it is false (as in default), we will add scroll-hidden css class to the table
     * @default false
     */
    showScroll?: boolean;
    /**
     * Unique Id for this table.
     */
    id?: string;
    /**
     * pageSize controls the granularity of row rendering. The table always renders
     * a full page worth of rows even when they are not needed to fill the viewport.
     *
     * Smaller values will help reduce the number of wasted rows that are rendered
     * outside the viewport, but will force the table to re-render more often as
     * scrolling occurs.
     *
     * @default 10
     */
    pageSize?: number;
    /**
     * Tables MAY render a header above the table contents. This is done through the
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
    renderHeader?: (columns: Array<ITableColumn<T>>) => JSX.Element;
    /**
     * When a row's value is given as an ObservableValue with an undefined value,
     * the list will render a Loading row for the content. The default will be
     * a shimmer row that is semi random and matches the content.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param details Additional details about this row.
     */
    renderLoadingRow?: (index: number, details: ITableRowDetails<T>) => JSX.Element;
    /**
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
     * 3) The row function MUST call onFocusItem when a either the row element of
     * any of the rows child elements receive the focus. This is needed to ensure
     * navigation within the table as well as in and out of the table function
     * correctly.
     *
     * 4) The row function MUST ensure the className for each of the columns is
     * added the cell for the given colmn.
     *
     * 5) The row function MAY dispatch events for behaviors but is not required.
     * If any events are dispatched they should be documented on the row renderer.
     *
     * 6) The row function is responsible for all accessibility and focus
     * management within the row.
     *
     */
    renderRow?: TableRowRenderer<T>;
    /**
     * renderSpacer can be supplied to override the spacer columns before and
     * after the actual columns in the table. This is used to apply custom
     * semantics to these areas. The standard spacers should be used unless there
     * is a specific need otherwise.
     *
     * @param rowIndex - The index of the row to render for.
     * @param left - True if this is the left spacer, false if it is the right spacer
     */
    renderSpacer?: (rowIndex: number, left: boolean) => React.ReactNode | null;
    /**
     * Set to true to allow text selection for table rows.
     */
    selectableText?: boolean;
    /**
     * onActivate is called when the row is activated. Activation occurs on
     * the Enter keystroke or double click.
     *
     * @param event - This is the event that is causing the activation.
     * @param tableRow - Details about the table row being activated.
     */
    onActivate?: (event: React.SyntheticEvent<HTMLElement>, tableRow: ITableRow<T>) => void;
    /**
     * onFocus is called when a item in the list is focused. Preventing default
     * on the focus event will prevent row selection from occuring even if
     * selectOnFocus is set to true.
     *
     * @param event This is the event that is causing the activation.
     * @param tableRow Details about the list row being activated.
     */
    onFocus?: (event: React.SyntheticEvent<HTMLElement>, listRow: ITableRow<T>) => void;
    /**
     * onSelect is called when the row is selected. Selection occurs on the
     * Space keystroke or click.
     *
     * @param event - This is the event that is causing the selection.
     * @param tableRow - Details about the table row being selected.
     */
    onSelect?: (event: React.SyntheticEvent<HTMLElement>, tableRow: ITableRow<T>) => void;
    /**
     * role defines the aria role of the table and defaults to "grid"
     * If the table does not have any focusable elements within the rows, set the role as "table" instead of "grid"
     *
     * @default "grid"
     */
    role?: string;
    /**
     * If the caller has variable height rows they can specify the rowHeight they
     * want used to estimate the size of virtualized rows. This means that when rows
     * are not rendered, the component will create virtual space for those rows to
     * ensure the scrolling behavior acts appropriately.
     *
     * If the table has fixed size rows there is no need to specify a rowHeight. The
     * table will determine the height of the rows after the initial render when
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
     * scrollable should be set to true if the table is not contained in a
     * scrolling element. This will ensure the table scrolls vertically within
     * the table element itself.
     */
    scrollable?: boolean;
    /**
     * A selection object can be supplied for managing the table selection. This
     * is not required since the table offers onSelect as a delegate. If the caller
     * wants multi-selction they must use an IListSelection that supports multi
     * select.
     *
     * There is a basic ListSelection implementation available from the List
     * component.
     */
    selection?: IListSelection;
    /**
     * Should the table select a row when it is clicked?
     *
     *
     * @default true
     */
    selectRowOnClick?: boolean;
    /**
     * Using singleClickActivation will activate the item when the row is clicked.
     * Where setting singleClickActivation to false will require a doubleclick to
     * activate a given row.
     *
     * @default true
     */
    singleClickActivation?: boolean;
    /**
     * Determines the width of the spacer cells on either side of each row.
     */
    spacerWidth?: number;
    /**
     * A table can be defined with a set of breakpoints. These breakpoints will be
     * used to control the column layout as the space available to the table changes.
     */
    tableBreakpoints?: ITableBreakpoint[];
    /**
     * If virtualize false is supplied the list will render all the items supplied
     * to it. This shouldn't be used unless you know you have a limited number of
     * rows. Virtualization is used to avoid performance problems.
     */
    virtualize?: boolean;
}
/**
 * TableColumnLayout is used to define the general shape of the data for a given
 * column. One of the purposes of this is an animation when the rows are loaded
 * asynchronously.
 *
 * If the caller wants non-standard shapes a custom loading row function will need
 * to be implemented. For any columns that fit the standard shapes the exported
 * functions can be used.
 */
export declare enum TableColumnLayout {
    /**
     * If a column is noted as none, when an asynchronous row is loaded no
     * animation will be added to this column.
     */
    none = 0,
    /**
     * The row uses a single line of text. This is the default for a column that
     * doesnt explicitly define a column layout
     */
    singleLine = 1,
    /**
     * The row uses a single line of text with a small prefix.
     */
    singleLinePrefix = 2,
    /**
     * The row uses two lines of text.
     */
    twoLine = 3,
    /**
     * The row uses two lines of text with a large prefex.
     */
    twoLinePrefix = 4
}
/**
 * The ColumnStyles effect how the values for the column should be rendered.
 */
export declare enum TableColumnStyle {
    /**
     * Secondary colums should be rendered normally.
     */
    Secondary = 1,
    /**
     * Primary columns should be rendered with emphasis.
     */
    Primary = 2,
    /**
     * Tertiary columns should be rendered de-emphasized.
     */
    Tertiary = 3
}
export interface ITableColumnBehaviorProps<T> {
    tableProps: Partial<ITableProps<T>>;
    columnIndex: number;
}
/**
 * Sorting order for columns
 */
export declare enum SortOrder {
    ascending = 0,
    descending = 1
}
/**
 * Justification of the content within a column
 */
export declare enum ColumnJustification {
    Left = 0,
    Right = 1
}
/**
 * Within a table columns may optionally be sorted. The table will render an indicator
 * in the header by default for the current sort order. SortProps should be supplied
 * for each column that MAY be sorted even if it isn't currently sorted. This allows
 * the table to know which columns are and which are not sortable.
 */
export interface IColumnSortProps {
    /**
     * This is deprecated, aria-sort is used instead.
     */
    ariaLabelAscending?: string;
    /**
     * This is deprecated, aria-sort is used instead.
     */
    ariaLabelDescending?: string;
    /**
     * If a column is tagged as sorted, the header will indicate the sort order with
     * a visual icon in the if the header uses the standard renderer. If a custom
     * renderer is used, it should handle the sortOrder.
     */
    sortOrder?: SortOrder;
}
/**
 * An ITableBreakpoint is used to define the layout of the columns when a given
 * breakpoint it reached.
 */
export interface ITableBreakpoint {
    /**
     * The table is defined with series of breakpoints. Each of the breakpoints
     * will have a mapping for the column widths. Columns widths should be
     * defined the same here as within an ITableColumn, except 0 should be used
     * for columns that are hidden at this breakpoint.
     */
    breakpoint: number;
    /**
     * The width of each column in the table when this breakpoint is active.
     * The width can be a positive number for a fixed width, a negative number
     * for a proportional width, or 0 for a hidden column.
     */
    columnWidths: number[];
}
/**
 * An IMeasurementStyle is used to represent a fixed size. The fixed size may be
 * based on a number of base measurement values.
 */
export declare enum IMeasurementStyle {
    /**
     * Pixels represented by the 'px' css measurement.
     */
    Pixel = 0,
    /**
     * RootEMs represented by the 'rem' css measurement.
     */
    REM = 1
}
/**
 * ITableColumn is used to communicate details about the column, its layout
 * styles, widths, and basic header information. It requires a function to
 * render the contents of the cell be supplied.
 */
export interface ITableColumn<T> {
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.  Used when no column name or icon is provided.
     */
    ariaLabel?: string;
    /**
     * Behaviors can be added a column to monitor events and interact with the column.
     */
    behaviors?: Array<IBehavior<ITableColumnBehaviorProps<T>, {}>>;
    /**
     * CSS className to that should be added to the table cell for each of the
     * values in this column.
     */
    className?: string;
    /**
     * This is used to help the table understand the general layout of the data.
     * One of the general purposes of this value is used when data is loaded
     * asynchronously the table will render a loading animation by default and
     * the layout is used to help define the visuals for the animation.
     *
     * A column with no columnLayout defined will use the TableColumnLayout.singleLine
     * style.
     */
    columnLayout?: TableColumnLayout;
    /**
     * cell renders MAY use the column style to apply css or other behaviors to
     * this column.
     */
    columnStyle?: TableColumnStyle;
    /**
     * CSS className that will be added to the cell for each header element.
     */
    headerClassName?: string;
    /**
     * If iconProps are supplied the Icon will be drawn to the left of the
     * column name in the header cell.
     */
    iconProps?: IIconProps;
    /**
     * Unique Id for this table. NOTE: If this column uses the renderSimpleCell function
     * the id is used as the property name of the row object to render.
     */
    id: string;
    /**
     * How to justify the content within cells. Will also effect the position of the sorting
     * arrow
     */
    justification?: ColumnJustification;
    /**
     * Mark as readonly if there are no interactive elements in the column
     *
     * @default false
     */
    readonly?: boolean;
    /**
     * maxWidth defines how large the column MAY grow if the column is resizble.
     * This must be an absolute number, it can't be supplied as a percentage.
     */
    maxWidth?: number;
    /**
     * minWidth defines how small the column MAY shrink if the column is resizble.
     * This must be an absolute number, it can't be supplied as a percentage.
     */
    minWidth?: number;
    /**
     * The name of the column is used to render the column header string. If the
     * column has no header shown or only an icon the name can be omitted.
     */
    name?: string;
    /**
     * renderCell MUST be supplied for a column. This defines how the column values
     * will be rendered in the table. Row rendering functions should use this
     * function unless the row rendering function has a custom presentation for
     * the row/column.
     *
     * @param rowIndex - This is the 0 based row index.
     * @param columnIndex - This is the 0 based column index.
     * @param tableColumn - This is the column definition for this cell.
     * @param tableItem - This is the object being rendered in this row.
     * @param ariaRowIndex - This is the index of the row that aria will read.
     */
    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<T>, tableItem: T, ariaRowIndex?: number) => JSX.Element;
    /**
     * renderHeaderCell can be supplied to render a custom header. It will be
     * the responsibility of the custom render function to manage all status
     * of the header. This includes all accessibitlity and focus management.
     *
     * @param index - This is the 0 based column index.
     * @param tableColumn - This is the column definition for the header being rendered.
     * @param focuszoneId - Focuszone id that needs to be included if the header is focusable.
     * @param isFirstActionableHeader - True for the first column header that gets focused on keyboard accessibility.
     */
    renderHeaderCell?: (columnIndex: number, tableColumn: ITableColumn<T>, focuszoneId?: string, isFirstActionableHeader?: boolean) => JSX.Element;
    /**
     * onSize is triggered when the column header is sized by the user. This is
     * a required property to enable the column to be resized.
     *
     * @param event - This is the mouse or keyboard event that has caused the resize to occur.
     * @param index - This is the 0 based column index being resized.
     * @param width - This is the updated width of the column. Note: this is called
     *  with values that conform to the defined min/max values.
     * @param column - This is the column definition for the column being resized.
     */
    onSize?: (event: MouseEvent | KeyboardEvent, columnIndex: number, width: number, column: ITableColumn<T>) => void;
    /**
     * onSizeEnd is called when the currently active sizing operation has completed.
     * This means the user has stopped sizing the column. Any actions the consumer
     * wants to take when sizing ends, they should implement here.
     */
    onSizeEnd?: () => void;
    /**
     * Within a table columns may optionally be sorted. The table will render an indicator
     * in the header by default for the current sort order. SortProps should be supplied
     * for each column that MAY be sorted even if it isn't currently sorted. This allows
     * the table to know which columns are and which are not sortable.
     */
    sortProps?: IColumnSortProps;
    /**
     * The width of a column can one of two values:
     *
     * Positive value - This is the exact width of the column in pixels. This
     * would be something like 250 to have a 250px column.
     *
     * Negative value - This is the percentage of the remaining space in the
     * containing element this column should consume. This would be something
     * like -100 for 100% of the remaining space.
     *
     * NOTE: This is different than css since we dont want to do unneeded
     * string processing, CSS would have you use a string like 250px or 100%.
     */
    width: IReadonlyObservableValue<number> | number;
    /**
     * The widthStyle can be set when the width is a positive number. By default
     * the width is interpreted as a fixed pixel value. If the column is going to have
     * a small UI representation such as a Coin, User Image, and a button these will
     * scale with font size and should be represented with root EM values. This
     * corresponds to the css rem measurement.
     */
    widthStyle?: IMeasurementStyle;
}
/**
 * Table rendering interfaces follow:
 */
/**
 * ITableHeaderCellProps<T> are used byt he standard TableHeaderCell component to
 * render the header cells. If a caller wishes to use the standard header cell
 * component they should supply these properties.
 */
export interface ITableHeaderCellProps<T> {
    /**
     * ariaLabel to pass to the header cell.  By default, the cell is labelled by its content element.
     * If specified, aria-hidden will be set to true on the content element to prevent dupplicate announcements.
     */
    ariaLabel?: string;
    /**
     * column is the core information used to describe a table column.
     */
    column: ITableColumn<T>;
    /**
     * columnIndex is used to define the index of this column.
     */
    columnIndex: number;
    /**
     * An optional focuszoneId that should be added to the component when supplied.
     * This allows the table to provider keyboard accessibility to the header
     * through a focuszone.
     */
    focuszoneId?: string;
    /**
     * Identifies the first column header that will get the focus via keyboard accessibility.
     */
    isFirstActionableHeader?: boolean;
}
/**
 * Props that can be used to represent that data available to a custom row
 * rendering component.
 *
 * See ITableProps.renderRow for parameter details.
 */
export interface ITableRowProps<T> {
    /**
     * css class names that should be added to the row element.
     */
    className?: string;
    /**
     * Index of the row that should be rendered.
     */
    index: number;
    /**
     * Details about how the table is rendering rows.
     */
    details: ITableRowDetails<T>;
    /**
     * If the table row should be rendered as a link, the caller can supply the
     * links properties. These are merged with the lists properties to build
     * a list row that is a anchor instead of a table row.
     * The only props which are forwarded are href, rel, target, and onClick.
     */
    linkProps?: ILinkProps;
}
/**
 * If the table uses renderSimpleCell to render a given cell in the table, the
 * object supplied to the table should have ISimpleTableCell properties that
 * match the id's in the column definitions.
 */
export interface ISimpleTableCell {
    [prop: string]: ISimpleListCell | string | number;
}
