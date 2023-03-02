import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabsProps } from './Tabs.Props';
/**
 * Renders all children as focusable, selectable elements and indicates whether or not they are
 * currently selected.
 */
export declare class Tabs extends React.Component<ITabsProps> {
    constructor(props: ITabsProps);
    componentWillUnmount(): void;
    render(): JSX.Element;
    private onTabClick;
    private onSelectedTabIdChanged;
}
