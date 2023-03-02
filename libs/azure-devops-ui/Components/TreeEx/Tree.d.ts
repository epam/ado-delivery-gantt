import "../../CommonImports";
import "../../Core/core.css";
import "./Tree.css";
import "./TreeExpand.css";
import * as React from "react";
import { IListMaterializedStats, IOverlayRenderProps } from '../../List';
import { ISimpleTableCell } from '../../Table';
import { ITreeItemEx } from '../../Utilities/TreeItemProvider';
import { ITree, ITreeColumn, ITreeProps, ITreeRowDetails, ITreeRowProps } from "./Tree.Props";
export declare class Tree<T> extends React.Component<ITreeProps<T>> implements ITree<T> {
    private table;
    render(): JSX.Element;
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number): void;
    removeOverlay(id: string): void;
    focusRow(rowIndex: number, direction?: number): Promise<void>;
    getFocusIndex(): number;
    getStats(): IListMaterializedStats;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions): void;
    private onActivateExpand;
    private renderRow;
}
export declare class TreeRow<T> extends React.Component<ITreeRowProps<T>> {
    private rowElement;
    render(): JSX.Element;
    private onFocus;
    private onKeyDown;
    private onPostprocessKeyStroke;
}
export declare function renderTreeRow<T>(rowIndex: number, item: ITreeItemEx<T>, details: ITreeRowDetails<T>, columns: ITreeColumn<T>[], data?: T, className?: string, key?: React.Key | null): JSX.Element;
/**
 * Standard cell renderer for a tree cell with expandable children. This will use the tree items
 * state to determine whether or not the row is expanded etc.
 */
export declare function ExpandableTreeCell<T>(props: {
    children?: React.ReactNode;
    className?: string;
    colspan?: number;
    columnIndex: number;
    contentClassName?: string;
    treeColumn?: ITreeColumn<T>;
    treeItem: ITreeItemEx<T>;
}): JSX.Element;
export declare function renderExpandableTreeCell<T extends ISimpleTableCell>(rowIndex: number, columnIndex: number, treeColumn: ITreeColumn<T>, treeItem: ITreeItemEx<T>): JSX.Element;
export declare function renderTreeCell<T extends ISimpleTableCell>(rowIndex: number, columnIndex: number, treeColumn: ITreeColumn<T>, treeItem: ITreeItemEx<T>): JSX.Element;
export declare function renderTreeCellWithClassName<T extends ISimpleTableCell>(rowIndex: number, columnIndex: number, treeColumn: ITreeColumn<T>, treeItem: ITreeItemEx<T>, contentClassName: string): JSX.Element;
