import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabBarProps } from './Tabs.Props';
/**
 * Renders tabs (provided as children or through a tab provider context) as well as addtional
 * content such as in-line filters, view options, etc.
 *
 * Tabs provided directly as children will always be place before contributed tabs.
 */
export declare class TabBar extends React.Component<ITabBarProps> {
    static contextType: React.Context<import("../../Core/Util/Screen").IScreenContext>;
    render(): JSX.Element;
    private renderAdditionalContent;
    private createTab;
}
