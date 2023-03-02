/// <reference types="react" />
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { ITable, ITableColumn, ITableProps, SortOrder } from "./Table.Props";
/**
 * The sortDelegate function is used to notify the caller when a change to the
 * sort order is being requested.
 *
 * @param columnIndex - The index of the column the request was made on.
 * @param proposedSortOrder - The proposed sort order is based on the default changes
 *  from the current sort order of the column. If the affected column is not sorted
 *  or is sorted descending, SortOrder.ascending is proposed. If the column is
 *  currently sorted ascending, SortOrder.descending is proposed.
 * @param event - This is the event that caused the sorting request.
 */
export declare type sortDelegate = (columnIndex: number, proposedSortOrder: SortOrder, event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => void;
/**
 * The ColumnSorting class is a behavior that can be used with the Table
 * component to provide column sorting. To use the ColumnSorting, create an
 * instance passing the sorting delegate to the constructor. Then supply
 * the created behavior to the table.
 */
export declare class ColumnSorting<T> implements IBehavior<ITableProps<T>, ITable<T>> {
    private onSort;
    private props;
    private eventDispatch?;
    constructor(onSort: sortDelegate);
    initialize: (props: Readonly<ITableProps<T>>, table: ITable<T>, eventDispatch: IEventDispatch) => void;
    componentDidMount: (props: Readonly<ITableProps<T>>) => void;
    componentDidUpdate: (props: Readonly<ITableProps<T>>) => void;
    componentWillUnmount: () => void;
    private onClick;
    private onKeyDown;
    private processSortEvent;
}
/**
 * sortItems is a helper method that works with the ColumnSorting and a Table
 * component to make it eaiser to maintain the props of the table. This function
 * will update the column definitions and return the sorted data. The caller
 * needs to update the props to the table appropriately after calling this
 * method.
 *
 * @param columnIndex The column that should be sorted.
 * @param sortOrder The order the data should be sorted.
 * @param sortFunctions An array of sort functions. Each sortable column should
 *  have a function supplied. If there are non-sortable columns, null should be
 *  supplied for their index.
 * @param columns The column definitions for the table.
 * @param items The array of items that should be sorted. Note: This is done in
 *  place so the input array will be updated.
 *
 * @return The resulting sorted array of items.
 */
export declare function sortItems<T>(columnIndex: number, sortOrder: SortOrder, sortFunctions: Array<((item1: T, item2: T) => number) | null>, columns: ITableColumn<T>[], items: T[]): T[];
