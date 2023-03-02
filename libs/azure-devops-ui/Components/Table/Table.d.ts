import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { IIconProps } from '../../Icon';
import { IListMaterializedStats, IOverlayRenderProps, ISimpleListCell } from '../../List';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { ISimpleTableCell, ITable, ITableColumn, ITableColumnBehaviorProps, ITableHeaderCellProps, ITableProps, ITableRowDetails, ITableRowProps, TableColumnLayout } from "./Table.Props";
/** Id used for the ColumnFill */
export declare const ColumnFillId = "_fill";
/**
 * ColumnFill is used to fill the remaining space in the parent element with an
 * empty column. This column can be used anywhere in the column order. Columns
 * that appear after this will be pushed to the right.
 */
export declare const ColumnFill: ITableColumn<{}>;
/**
 * ITableState is the internal state managed by the Table.
 */
export interface ITableState<T> {
    columnBehaviors: Array<IBehavior<Partial<ITableColumnBehaviorProps<T>>, {}>>;
    eventDispatch: IEventDispatch;
    renderInvisible: boolean;
    /**
     * Internal key intended to force a re-render when columns visibility changes
     */
    visibleColumnsKey: string;
    maxWidth?: string;
    minWidth?: string;
    tableBehaviors: Array<IBehavior<Partial<ITableProps<T>>, Partial<ITable<T>>>>;
    tableWidth: string;
}
/**
 * The Table is a multi-column List component with an optional header.
 */
export declare class Table<T> extends React.Component<ITableProps<T>, ITableState<T>> implements ITable<T> {
    static defaultProps: Partial<ITableProps<any>>;
    static getDerivedStateFromProps<T>(props: Readonly<ITableProps<T>>, state: Readonly<ITableState<T>>): Partial<ITableState<T>>;
    currentElement: React.RefObject<HTMLDivElement>;
    private list;
    constructor(props: Readonly<ITableProps<T>>);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number, columnIndex?: number): void;
    removeOverlay(id: string): void;
    focusRow(rowIndex: number, direction?: number): Promise<void>;
    getFocusIndex(): number;
    getStats(): IListMaterializedStats;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions): void;
    private onBreakpoint;
    private onColumnsChanged;
    private renderHeader;
    private renderLoadingRow;
    private renderRow;
}
export declare function renderColumns<T>(rowIndex: number, columns: Array<ITableColumn<T>>, item: T, details: ITableRowDetails<T>): JSX.Element[];
export interface ITableHeaderCellState {
    measuredWidth: number;
    isFocused: boolean;
}
export declare class TableHeaderCell<T> extends React.Component<ITableHeaderCellProps<T>, ITableHeaderCellState> {
    private element;
    private headerCellId;
    state: {
        measuredWidth: number;
        isFocused: boolean;
    };
    constructor(props: ITableHeaderCellProps<T>);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private onSize;
    private updateMeasuredWidth;
}
export declare function TableRow<T>(props: ITableRowProps<T> & {
    children?: React.ReactNode;
}): JSX.Element;
export declare function TableLoadingRow<T>(props: {
    columns: Array<ITableColumn<T>>;
    details: ITableRowDetails<T>;
    rowIndex: number;
}): JSX.Element;
export declare function TableCell<T>(props: {
    ariaLabel?: string;
    ariaRowIndex?: number;
    children?: React.ReactNode;
    className?: string;
    colspan?: number;
    columnIndex: number;
    role?: string;
    tableColumn?: ITableColumn<T>;
}): JSX.Element;
export declare function SimpleTableCell<T>(props: {
    ariaLabel?: string;
    ariaRowIndex?: number;
    children?: React.ReactNode;
    className?: string;
    colspan?: number;
    columnIndex: number;
    contentClassName?: string;
    role?: string;
    tableColumn?: ITableColumn<T>;
}): JSX.Element;
export declare function TwoLineTableCell<T>(props: {
    ariaRowIndex?: number;
    className?: string;
    columnIndex: number;
    colspan?: number;
    iconProps?: IIconProps;
    line1: React.ReactNode;
    line2: React.ReactNode;
    tableColumn?: ITableColumn<T>;
}): JSX.Element;
export declare function renderEmptyCell<T>(rowIndex: number, columnIndex: number): JSX.Element;
/**
 * A basic cell renderer that works well for most simple columns. Gets the value of the
 * the {column.id} property in the given table item and displays it as a string
 *
 * @param rowIndex Index of the row being rendered
 * @param columnIndex Index of the column being rendered
 * @param tableColumn Column definition
 * @param tableItem The data item being rendered for the current row
 */
export declare function renderSimpleCell<T extends ISimpleTableCell>(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<T>, tableItem: T, ariaRowIndex?: number): JSX.Element;
/**
 * Renders a simple table cell value
 *
 * @param columnIndex Index of the column being rendered
 * @param tableColumn Column definition
 * @param tableCell Simple value to render as text
 */
export declare function renderSimpleCellValue<T extends ISimpleTableCell>(columnIndex: number, tableColumn: ITableColumn<T>, tableCell: string | number | ISimpleListCell, ariaRowIndex?: number): JSX.Element;
export declare function renderLoadingCell(columnLayout?: TableColumnLayout): JSX.Element | null;
