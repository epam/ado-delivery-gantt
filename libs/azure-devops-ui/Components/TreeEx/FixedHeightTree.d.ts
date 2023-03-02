import "../../CommonImports";
import "../../Core/core.css";
import "./Tree.css";
import "./TreeExpand.css";
import * as React from "react";
import { IFixedHeightListMaterializedStats } from '../../List';
import { IFixedHeightTree, IFixedHeightTreeProps } from "./FixedHeightTree.Props";
export declare class FixedHeightTree<T> extends React.Component<IFixedHeightTreeProps<T>> implements IFixedHeightTree<T> {
    private list;
    render(): JSX.Element;
    getFocusIndex(): number;
    getStats(): IFixedHeightListMaterializedStats;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions): void;
    private onActivateExpand;
    private renderRow;
}
