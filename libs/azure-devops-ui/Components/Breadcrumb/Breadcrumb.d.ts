import "../../CommonImports";
import "../../Core/core.css";
import "./Breadcrumb.css";
import * as React from "react";
import { IBreadcrumbItem, IBreadcrumbProps } from "./Breadcrumb.Props";
export interface IBreadcrumbState {
    displayedItems: IBreadcrumbItem[];
    linkItems: IBreadcrumbItem[];
    hiddenItemCount: number;
}
export declare class Breadcrumb extends React.Component<IBreadcrumbProps, IBreadcrumbState> {
    static defaultProps: IBreadcrumbProps;
    static getDerivedStateFromProps(props: IBreadcrumbProps, state: IBreadcrumbState): IBreadcrumbState;
    private breadcrumbId;
    constructor(props: IBreadcrumbProps);
    render(): JSX.Element;
    private renderBreadcrumbItems;
    private renderDivider;
    private renderItem;
    private onLayoutChanged;
    private onMenuItemActivate;
}
