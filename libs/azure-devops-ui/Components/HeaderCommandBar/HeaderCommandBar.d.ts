import "../../CommonImports";
import "../../Core/core.css";
import "./HeaderCommandBar.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IHeaderCommandBarProps, IHeaderCommandBarWithFilterProps } from "./HeaderCommandBar.Props";
export interface IHeaderCommandBarFocusOptions {
    commandBarItemId: string;
}
export declare class HeaderCommandBar extends React.Component<IHeaderCommandBarProps> implements IFocusable<IHeaderCommandBarFocusOptions> {
    private moreButtonId;
    private overflowButtonRef;
    private buttonRefs;
    constructor(props: Readonly<IHeaderCommandBarProps>);
    render(): JSX.Element;
    focus(options: IHeaderCommandBarFocusOptions): void;
}
export interface IHeaderCommandBarWithFilterState {
    filterHasChanges: boolean;
}
export declare class HeaderCommandBarWithFilter extends React.Component<IHeaderCommandBarWithFilterProps, IHeaderCommandBarWithFilterState> implements IFocusable<IHeaderCommandBarFocusOptions> {
    private headerCommandBarRef;
    constructor(props: IHeaderCommandBarWithFilterProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    focus(options: IHeaderCommandBarFocusOptions): void;
    private onFilterClicked;
    private onFilterChanged;
}
