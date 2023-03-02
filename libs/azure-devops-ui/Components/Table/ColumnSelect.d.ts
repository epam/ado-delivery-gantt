/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import { IBehavior } from '../../Utilities/Behavior';
import { IMeasurementStyle, ITableColumn, ITableColumnBehaviorProps, TableColumnLayout } from "./Table.Props";
interface IColumnSelectProps {
    excludeFocusZone?: boolean;
    role?: string;
}
/**
 * ColumnSelect is used to render additional selection ui for a given row.
 *
 * This renders a fixed width column that contains a checkbox in the header
 * as well as each row that represents the selection state of the row. It
 * also allows the user to change the selection state. The header checkbox
 * is used to set the state of all rows in the table to the same state.
 *
 */
export declare class ColumnSelect implements ITableColumn<{}> {
    private itemProvider?;
    private ariaHidden;
    private selection?;
    private onSelect?;
    private props;
    private columnSelectBehavior;
    private allSelected;
    columnLayout: TableColumnLayout;
    id: string;
    width: number;
    widthStyle: IMeasurementStyle;
    behaviors: IBehavior<ITableColumnBehaviorProps<{}>, {}>[];
    constructor(props?: IColumnSelectProps);
    componentDidMount(props: ITableColumnBehaviorProps<{}>): void;
    componentDidUpdate(props: ITableColumnBehaviorProps<{}>): void;
    componentWillUnmount(): void;
    renderCell: (rowIndex: number, columnIndex: number, listColumn: ITableColumn<{}>) => JSX.Element;
    renderHeaderCell: (columnIndex: number, listColumn: ITableColumn<{}>, focuszoneId?: string) => JSX.Element;
    private onChangeHeader;
    private onSelectionChange;
    private updateSelection;
    private getListRow;
}
export {};
