import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IFocusGroup, IFocusGroupContext, IFocusGroupProps } from "./FocusGroup.Props";
export declare const FocusGroupContext: React.Context<IFocusGroupContext>;
export interface IFocusGroupState {
    defaultElementId?: string;
    focusedElementId?: string;
}
export declare class FocusGroup extends React.Component<IFocusGroupProps, IFocusGroupState> implements IFocusGroup {
    static getDerivedStateFromProps(props: Readonly<IFocusGroupProps>, state: Readonly<IFocusGroupState>): {
        defaultElementId: string;
        focusedElementId: string;
    };
    constructor(props: Readonly<IFocusGroupProps>);
    render(): JSX.Element;
    focus(elementId?: string): void;
    private onFocus;
}
