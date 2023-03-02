import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabProviderContext, ITabProviderProps } from './Tabs.Props';
export declare const TabProviderContext: React.Context<ITabProviderContext>;
export declare class TabProvider extends React.Component<ITabProviderProps> {
    render(): JSX.Element;
}
