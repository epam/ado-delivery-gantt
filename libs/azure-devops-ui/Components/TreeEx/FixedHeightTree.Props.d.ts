/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IFocusZoneProps } from '../../FocusZone';
import { IFixedHeightList, IFixedHeightListItemDetails, IListSelection } from '../../List';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
import { ITreeItemEx } from '../../Utilities/TreeItemProvider';
import { ITreeRow } from "./Tree.Props";
export interface IFixedHeightTree<T> extends IFixedHeightList<ITreeItemEx<T>> {
}
/**
 * ITreeRowDetails are used to describe the details of a given row in the tree.
 * This information is used in rendering rows.
 */
export interface IFixedHeightTreeRowDetails<T> extends IFixedHeightListItemDetails<ITreeItemEx<T>> {
    /**
     * The data represents the object being rendered in this row. If the caller
     * has asynchronous loading of rows, the data MAY be undefined while we wait
     * for the data to be resolved.
     */
    data: ITreeItemEx<T>;
}
export declare type FixedHeightTreeRowRenderer<T> = (rowIndex: number, item: ITreeItemEx<T>, details: IFixedHeightTreeRowDetails<T>) => JSX.Element;
/**
 * IFixedHeightTreeProps<T> are used to render of Tree into a table where each row is
 * represented by type T.
 *
 * If the object for a given row implements the renderRow function, this
 * function is used instead of the tree scoped renderRow function. If no
 * renderRow function is available from the item or from the tree scope
 * the default TreeRow component will be used.
 */
export interface IFixedHeightTreeProps<T> {
    /**
     * CSS className to add to the tree root element.
     */
    className?: string;
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
    focuszoneProps?: IFocusZoneProps;
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
     * When a row's value is given as an ObservableValue with an undefined value,
     * the list will render a Loading row for the content. The default will be
     * a shimmer row that is semi random and matches the content.
     *
     * @param index This is the 0 based row index that should be rendered.
     * @param details Additional details about this row.
     */
    renderLoadingRow?: (rowIndex: number, details: IFixedHeightTreeRowDetails<T>) => JSX.Element;
    /**
     * The row that should be rendered in the tree. The resulting div will be placed inside the
     * FixedHeightList control. Keep in mind any overflow content will be cut off, so consider
     * the width and rowHeight values passed in.
     *
     */
    renderRow: FixedHeightTreeRowRenderer<T>;
    /**
     * role defines the aria role of the tree and defaults to "tree"
     *
     * @default "tree"
     */
    role?: string;
    /**
     * Required height of each row. Every row in the tree must be this height and all overflow is hidden.
     * The FixedHeightList control uses this value to absolutely position elements within it.
     */
    rowHeight: number;
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
     * Using singleClickActivation will activate the item when the row is clicked.
     * Where setting singleClickActivation to false will require a doubleclick to
     * activate a given row.
     *
     * @default true
     */
    singleClickActivation?: boolean;
    /**
     * Width can be any supported css width value, either a %, px, and vw value.
     *
     * @default 100%
     */
    width?: string;
}
