import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabListProps } from './Tabs.Props';
export declare class TabList extends React.Component<ITabListProps> {
    constructor(props: ITabListProps);
    render(): JSX.Element;
    private generateGroupMap;
    private processChildren;
    private processContributions;
    private processGroups;
    private createRow;
    private renderTitle;
    private renderSubTitle;
    private onSelectedTabIdChanged;
}
