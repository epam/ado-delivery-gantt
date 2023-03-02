import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ObservableArray, ObservableValue } from '../../Core/Observable';
import { ExpandableButton } from '../../Button';
import { IMenuProps } from '../../Menu';
import { IMeasurementStyle, ITableColumn, TableColumnLayout } from "./Table.Props";
/**
 * Standard widths for the more column
 */
export declare enum ColumnMoreWidths {
    compact = 2,
    default = 2.625
}
/**
 * The ColumnMore class is used as a custom column within a Table.
 *
 * It renders a fixed width column with a button that is visible on focus and
 * hover that will show a contextual menu for the given item. The caller
 * should create a new instance of this for each table. The header for this
 * column is empty.
 *
 * When creating the column you must supply delegate that is used to get the
 * menuProps when the menu is opened.
 */
export declare class ColumnMore<T> implements ITableColumn<T> {
    private menuAvailable?;
    private menuProvider;
    private onActivate?;
    ariaLabel: string;
    columnLayout: TableColumnLayout;
    id: string;
    width: ObservableValue<number>;
    widthStyle: IMeasurementStyle;
    private refs?;
    /**
     * Creates an instance of ColumnMore with the appropriate delegates.
     *
     * @param menuProvider Method that returns the menu props. This is called
     *  with the item from the row the menu was activated on.
     * @param menuAvailable Optional method that is called when the row
     *  is rendered. The MoreButton will be shown if no method is supplied
     *  or if the method is supplied and it returns true.
     */
    constructor(menuProvider: (listItem: T, rowIndex: number, buttonRef: React.RefObject<ExpandableButton>) => IMenuProps, menuAvailable?: (listItem: T) => boolean, onActivate?: (rowIndex: number, columnIndex: number, event?: React.MouseEvent | React.KeyboardEvent) => void, width?: number, refs?: ObservableArray<React.RefObject<ExpandableButton>>);
    renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<T>, listItem: T) => JSX.Element;
    renderHeaderCell: (columnIndex: number, tableColumn: ITableColumn<T>) => JSX.Element;
    private onClick;
    private onKeyDown;
}
