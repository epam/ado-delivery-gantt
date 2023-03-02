import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { ObservableArray, ObservableValue } from '../../Core/Observable';
import { IMenuItem } from "../Menu/Menu.Props";
import { IResizeGroupContext, IResizeGroupProps } from "./ResizeGroup.Props";
export declare const ResizeGroupContext: React.Context<IResizeGroupContext>;
interface IResizeGroupState {
    hiddenCount: ObservableValue<number>;
    overflowItems: ObservableArray<IMenuItem>;
    editedItems: IMenuItem[];
}
export declare class ResizeGroup extends React.Component<IResizeGroupProps, IResizeGroupState> {
    constructor(props: IResizeGroupProps);
    static getDerivedStateFromProps(nextProps: IResizeGroupProps, prevState: IResizeGroupState): IResizeGroupState;
    render(): JSX.Element;
    private onLayoutChange;
    private static updateOverflowItems;
}
export {};
