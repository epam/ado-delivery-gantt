import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { IHeaderCommandBarFocusOptions } from '../../HeaderCommandBar';
import { IFocusable } from '../../Utilities/Focus';
import { IHeader, IHeaderProps } from "./Header.Props";
export declare class Header extends React.Component<IHeaderProps> implements IHeader, IFocusable<IHeaderCommandBarFocusOptions> {
    private commandBarClassName;
    private breakpointIndex;
    private headerCommandBarRef;
    constructor(props: Readonly<IHeaderProps>);
    render(): JSX.Element;
    focus(options: IHeaderCommandBarFocusOptions): void;
    private onBreakPoint;
    private getUpdatedCommandBarItems;
}
