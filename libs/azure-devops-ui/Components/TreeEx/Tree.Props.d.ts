/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IFocusZoneProps } from '../../FocusZone';
import { IAnchorProps } from '../../Link';
import { IListSelection } from '../../List';
import { ITable, ITableBreakpoint, ITableColumn, ITableRow, ITableRowDetails } from '../../Table';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
import { ITreeItemEx } from '../../Utilities/TreeItemProvider';
export interface ITree<T> extends ITable<ITreeItemEx<T>> {
}
/**
 * TreeColumns extends TableColumns and allow the creator to specify
 * the tree specific behaviors for a given column.
 */
export interface ITreeColumn<T> extends ITableColumn<ITreeItemEx<T>> {
    /**
     * hierarchical should be specified for any column that will show the
     * indentation of the tree expansion.
     */
    hierarchical?: boolean;
    /**
     * Number of pixels the indentation will apply for each depth.
     *
     * @default 16
     */
    indentationSize?: number;
}
export interface ITreeRow<T> extends ITableRow<ITreeItemEx<T>> {
}
/**
 * ITreeRowDetails are used to describe the details of a given row in the tree.
 * This information is used in rendering rows.
 */
export interface ITreeRowDetails<T> extends ITableRowDetails<ITreeItemEx<T>> {
    /**
     * The data represents the object being rendered in this row. If the caller
     * has asynchronous loading of rows, the data MAY be undefined while we wait
     * for the data to be resolved.
     */
    data: ITreeItemEx<T>;
}
export declare type TreeRowRenderer<T> = (rowIndex: number, item: ITreeItemEx<T>, details: ITreeRowDetails<T>) => JSX.Element;
/**
 * ITreeProps<T> are used to render of Tree into a table where each row is
 * represented by type T.
 *
 * If the object for a given row implements the renderRow function, this
 * function is used instead of the tree scoped renderRow function. If no
 * renderRow function is available from the item or from the tree scope
 * the default TreeRow component will be used.
 */
export interface ITreeProps<T> {
    /**
     * ariaLabel allows the caller to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * Behaviors can be added to the tree and monitor events and interact with the
     * component through the ITree methods.
     */
    behaviors?: IBehavior<Partial<ITreeProps<ITreeItemEx<T>>>, Partial<ITree<T>>>[];
    /**
     * columns is a required property of a tree used to define the column layout
     * for the tree.
     */
    columns: ITreeColumn<T>[];
    /**
     * CSS className to add to the tree root element.
     */
    className?: string;
    /**
     * CSS className to add to the container element.
     */
    containerClassName?: string;
    /**
     * The caller can supply an EventDispatch to the tree if it wishes to
     * participate it extending the behaviors. If one isn't supplied the tree will
     * create its own dispatcher when behaviors are supplied.
     */
    eventDispatch?: IEventDispatch;
    /**
     * focuszoneProps allows the caller to manage the how the tree rows are focused.
     * The default focuszone if one isn't supplied is a Vertical non-cyclic focus zone.
     */
    focuszoneProps?: IFocusZoneProps | null;
    /**
     * Unique Id for this tree.
     */
    id?: string;
    /**
     * The caller MUST supply the set of items to be shown through the ItemProvider.
     * The ITreeItemProvider allows the caller to store their items in the form that
     * bests suits their needs but gives the tree a well defined interface for
     * requesting the items. This can include async fetching of items through
     * observables.
     *
     * There is simple TreeItemProvider<T> for those that just have a set of items
     * they want to supply without writing a custom ItemProvider.
     */
    itemProvider: IItemProvider<ITreeItemEx<T> | IReadonlyObservableValue<ITreeItemEx<T>>>;
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
     * onActivate is called when the row is activated. Activation occurs on
     * the Enter keystroke or double click.
     *
     * @param event - This is the event that is causing the activation.
     * @param treeRow - Details about the tree row being activated.
     */
    onActivate?: (event: React.SyntheticEvent<HTMLElement>, treeRow: ITreeRow<T>) => void;
    /**
     * onFocus is called when a item in the list is focused. Preventing default
     * on the focus event will prevent row selection from occuring even if
     * selectOnFocus is set to true.
     *
     * @param event This is the event that is causing the activation.
     * @param tableRow Details about the list row being activated.
     */
    onFocus?: (event: React.SyntheticEvent<HTMLElement>, listRow: ITreeRow<T>) => void;
    /**
     * onSelect is called when the row is selected. Selection occurs on the
     * Space keystroke or click.
     *
     * @param event - This is the event that is causing the selection.
     * @param treeRow - Details about the tree row being selected.
     */
    onSelect?: (event: React.SyntheticEvent<HTMLElement>, treeRow: ITreeRow<T>) => void;
    /**
     * onToggle is called when an item is either expanded or collapsed.
     *
     * @param event - This is the event that is causing the toggle.
     * @param treeItem - Details about the tree item being toggled.
     */
    onToggle?: (event: React.SyntheticEvent<HTMLElement>, treeItem: ITreeItemEx<T>) => void;
    /**
     * pageSize controls the granularity of row rendering. The tree always renders
     * a full page worth of rows even when they are not needed to fill the viewport.
     *
     * Smaller values will help reduce the number of wasted rows that are rendered
     * outside the viewport, but will force the tree to re-render more often as
     * scrolling occurs.
     *
     * @default 10
     */
    pageSize?: number;
    /**
     * Trees MAY render a header above the tree contents. This is done through the
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
    renderHeader?: (columns: ITreeColumn<T>[]) => JSX.Element;
    /**
     * When a row's value is given as an ObservableValue with an undefined value,
     * the list will render a Loading row for the content. The default will be
     * a shimmer row that is semi random and matches the content.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param details Additional details about this row.
     */
    renderLoadingRow?: (rowIndex: number, details: ITreeRowDetails<T>) => JSX.Element;
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
     * navigation within the tree as well as in and out of the tree function
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
    renderRow?: TreeRowRenderer<T>;
    /**
     * renderSpacer can be supplied to override the spacer columns before and
     * after the actual columns in the table. This is used to apply custom
     * semantics to these areas. The standard spacers should be used unless there
     * is a specific need otherwise.
     */
    renderSpacer?: (rowIndex: number, left: boolean) => React.ReactNode | null;
    /**
     * role defines the aria role of the tree and defaults to "tree"
     *
     * @default "tree"
     */
    role?: string;
    /**
     * If the caller has variable height rows they can specify the rowHeight they
     * want used to estimate the size of virtualized rows. This means that when rows
     * are not rendered, the component will create virtual space for those rows to
     * ensure the scrolling behavior acts appropriately.
     *
     * If the tree has fixed size rows there is no need to specify a rowHeight. The
     * tree will determine the height of the rows after the initial render when
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
     * Set to true to make the text in the tree rows selectable.
     */
    selectableText?: boolean;
    /**
     * scrollable should be set to true if the tree is not contained in a
     * scrolling element. This will ensure the tree scrolls vertically within
     * the tree element itself.
     */
    scrollable?: boolean;
    /**
     * A selection object can be supplied for managing the tree selection. This
     * is not required since the tree offers onSelect as a delegate. If the caller
     * wants multi-selction they must use an IListSelection that supports multi
     * select.
     *
     * There is a basic ListSelection implementation available from the List
     * component.
     */
    selection?: IListSelection;
    /**
     * showHeader determines whether or not the column headers are shown at the top
     * of the tree.
     *
     * @default true if columns are supplied.
     */
    showHeader?: boolean;
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
     * Using singleClickActivation will activate the item when the row is clicked.
     * Where setting singleClickActivation to false will require a doubleclick to
     * activate a given row.
     *
     * @default true
     */
    singleClickActivation?: boolean;
    /**
     * A tree can be defined with a set of breakpoints. These breakpoints will be
     * used to control the column layout as the space available to the tree changes.
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
 * Props that can be used to represent that data available to a custom row
 * rendering component.
 *
 * See ITreeProps.renderRow for parameter details.
 */
export interface ITreeRowProps<T> {
    /**
     * css class names to add to the row element.
     */
    className?: string;
    /**
     * Details about the row being rendered.
     */
    details: ITreeRowDetails<T>;
    /**
     * This is the 0 based row index.
     */
    index: number;
    /**
     * If the tree row should be rendered as a link, the caller can supply the
     * links properties. These are merged with the lists properties to build
     * a list row that is a anchor instead of a table row.
     * The only props which are forwarded are href, rel, and target.
     */
    linkProps?: IAnchorProps;
}
