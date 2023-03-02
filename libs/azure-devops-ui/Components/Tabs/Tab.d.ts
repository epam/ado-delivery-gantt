import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ITabProps } from '../../Tabs.Types';
/**
 * Presentational component that represents a single tab.
 */
export declare class Tab extends React.Component<ITabProps> {
    render(): JSX.Element;
    private renderBadge;
    private onClick;
    private onKeyDown;
    /**
     * Updates the state with the new selected pivot.
     */
    private updateSelectedItem;
}
