import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IDropdownCalloutProps } from "./DropdownCallout.Props";
export declare function DropdownCallout<T = {}>(props: IDropdownCalloutProps<T>): JSX.Element;
interface IDropdownCalloutState {
    scrollBarWidth: number;
}
export declare class DropdownCalloutComponent<T = {}> extends React.Component<IDropdownCalloutProps<T>, IDropdownCalloutState> implements IFocusable<{}> {
    static defaultProps: {
        width: number;
        ignoreMouseDown: boolean;
    };
    private callout;
    private calloutContent;
    private filterBox;
    private initFocusElement;
    constructor(props: IDropdownCalloutProps<T>);
    componentDidMount(): void;
    focus(): void;
    render(): JSX.Element;
    private updateLayout;
    private onMouseDown;
    private listBoxDidUpdate;
    private getScrollWidth;
}
export {};
