import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabGroupProviderContext, ITabGroupProviderProps } from './Tabs.Props';
export declare const TabGroupProviderContext: React.Context<ITabGroupProviderContext>;
export declare class TabGroupProvider extends React.Component<ITabGroupProviderProps> {
    render(): JSX.Element;
}
