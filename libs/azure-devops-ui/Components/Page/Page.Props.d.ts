import * as React from "react";
import { IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IVssContributedTab, ITabGroup } from '../../Tabs';
export declare enum Orientation {
    Vertical = 0,
    Horizontal = 1
}
/**
 * Properties for the Page component.
 */
export interface IPageProps {
    
    children?: React.ReactNode;
    /**
     * Optional root classname for the page element.
     */
    className?: string;
    /**
     * Describes if the page should render elements in a flex-row
     * or flex-column
     */
    orientation?: Orientation;
    /**
     * Optional ref to the scrollable container for the page.
     */
    scrollableContainerRef?: React.RefObject<HTMLDivElement>;
    /**
     * Tracks the selected tab id within the page.
     */
    selectedTabId?: IReadonlyObservableValue<string> | string;
    /**
     * A list of providers contributing tab groups to the page.
     */
    tabGroups?: IReadonlyObservableArray<ITabGroup>;
    /**
     * A list of providers contributing tabs to the page.
     */
    tabProviders?: IReadonlyObservableArray<IVssContributedTab>;
}
