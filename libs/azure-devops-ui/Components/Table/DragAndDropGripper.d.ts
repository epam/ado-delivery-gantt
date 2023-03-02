import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
/**
 * The DragAndDropGripper is meant to be rendered inside of the
 * spacer column of a table, to indicate an item can be dragged in a table.
 */
export declare class DragAndDropGripper extends React.Component<{}> {
    render(): JSX.Element;
}
export declare function renderGripper(index: number, left: boolean): JSX.Element;
