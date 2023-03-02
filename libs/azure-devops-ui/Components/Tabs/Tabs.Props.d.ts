import * as React from "react";
import { IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IHeaderCommandBarItem } from '../../HeaderCommandBar';
import { IIconProps } from '../../Icon';
import { ITooltipProps } from '../../TooltipEx';
export declare enum TabSize {
    /**
     * 32px tall with 14px text
     */
    Compact = "compact",
    /**
     * 48px tall with 14px text
     */
    Tall = "tall",
    /**
     * 40px tall with 17px text
     */
    LargeLink = "large-link"
}
/**
 * Defines the orientation of the child FocusZone and the flex orientation
 * of the list
 */
export declare enum Orientation {
    Horizontal = 0,
    Vertical = 1
}
export interface ITabBarProps extends ITabsProps {
    
    children?: React.ReactNode;

    /**
     * If true, do not apply position: sticky to the tab bar.
     */
    disableSticky?: boolean;
    /**
     * Non-tabs content to render in the tab bar, such as filterbar, view actions, etc.
     */
    renderAdditionalContent?: () => JSX.Element | undefined;
    /**
     * Optional root classname for the tabs element.
     */
    tabsClassName?: string;
}
export interface ITabListProps extends ITabsProps {
    /**
     * Header string to render
     */
    listTitle?: string;
    /**
     * Subtitle string to render
     */
    listSubTitle?: string;
    /**
     * Defines the tab groups that tabs can be placed into
     */
    tabGroups?: ITabGroup[];
}
/**
 * Properties for the Tabs component.
 */
export interface ITabsProps {
    /**
     * Aria-label for the tab group
     */
    ariaLabel?: string;
    /**
     * Optional root classname for the tabs element.
     */
    className?: string;
    /**
     * Called when the selected tab has changed (through click or keyboard)
     */
    onSelectedTabChanged: (newTabId: string) => void;
    /**
     * Determines if we'll render as Flex-Row or Flex-Column
     * @default flex-column
     */
    orientation?: Orientation;
    /**
     * The selected tab's id either as a string or a readonly observable value
     */
    selectedTabId?: IReadonlyObservableValue<string> | string;
    /**
     * Tab display size
     */
    tabSize?: TabSize;
}
interface ISharedTabProps {
    /**
     * Aria label for the tab
     */
    ariaLabel?: string;
    /**
     * Class name of the tab element
     */
    className?: string;
    /**
     * Unique id of the tab, used to report selection
     */
    id: string;
    /**
     * Name of the tab that will get rendered in the tab
     */
    name?: IReadonlyObservableValue<string> | string;
    /**
     * Icon which appears to the left of the name of the tab
     */
    iconProps?: IIconProps;
}
export interface ITabProps extends ISharedTabProps {
    /**
     * Number to display next to the name of the tab in a badge. If a non-numeric value is desired
     * in the badge, use the renderBadge prop and pass a <TabBadge /> instead.
     */
    badgeCount?: number | IReadonlyObservableValue<number>;
    /**
     * Matches this Tab to a Group
     */
    groupId?: string;
    /**
     * Used for aria attributes on tab.
     * Does not need to be provided when used in the context of a TabBar or Tabs component
     */
    index?: number;
    /**
     * Whether or not the tab is appearing as selected.
     * Does not need to be provided when used in the context of a TabBar or Tabs component
     */
    isSelected?: boolean;
    /**
     * Called when the user requests to change to this pivot. If this method return false, the change will be blocked.
     */
    onBeforeTabChange?: (ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | null, tabId: string, url?: string) => boolean;
    /**
     * Handles click/keydown events on the tab.
     * Does not need to be provided when used in the context of a TabBar or Tabs component
     */
    onClick?: (selectedTabId: string) => void;
    /**
     * Used to provide custom content in the badge area of a Tab. If the content is simply a number, use badgeCount instead.
     * In cases where the Badge should be a standard Pill, but just with text instead of a number, use a TabBadge, like the following:
     *
     * renderBadge={() => <TabBadge>50+</TabBadge>}
     */
    renderBadge?: () => React.ReactNode;
    /**
     * Used for aria attributes on tab.
     * Does not need to be provided when used in the context of a TabBar or Tabs component
     */
    setSize?: number;
    /**
     * If provided will use an <a> for the tab as well as allow it to be CTRL-clicked to open in
     * a new browser tab
     */
    url?: string;
}
export interface ITabBadgeProps {
    /**
     * A custom className to add to the underlying <Pill />.
     */
    className?: string;
    /**
     * Whether or not the <Pill /> contains a number.
     * @default true
     */
    containsCount?: boolean;
    /**
     * If defined, wrap the <Pill /> in a <Tooltip /> with this props.
     */
    tooltipProps?: ITooltipProps;
}
export interface ITabGroup {
    /**
     * Unique identifier for a TabGroup
     */
    id: string;
    /**
     * Display name
     */
    name: string;
    /**
     * Ordering: Lower = renders first
     */
    order?: number;
}
export interface ITabProviderContext {
    /**
     * A list of commands that should be rendered in the header.
     */
    commandBarItems?: IHeaderCommandBarItem[] | IReadonlyObservableArray<IHeaderCommandBarItem>;
    /**
     * Called to render content for the tab
     */
    renderContent?: () => JSX.Element;
    /**
     * Called to render content for the filter bar
     */
    renderFilterBar?: (inTabBar: boolean) => JSX.Element | undefined;
    /**
     * Tracks the selected tab id.
     */
    selectedId?: IReadonlyObservableValue<string> | string;
    /**
     * The current list of all provided tabs (not defined directly as children to the Tabs component)
     */
    tabs: IVssContributedTab[];
}
export interface ITabGroupProviderContext {
    groups: ITabGroup[];
}
export interface ITabProviderProps {
    providers: IReadonlyObservableArray<IVssContributedTab>;
    /**
     * Tracks the selected tab id.
     */
    selectedTabId: IReadonlyObservableValue<string> | string;
}
export interface ITabGroupProviderProps {
    providers: IReadonlyObservableArray<ITabGroup>;
}
export interface IVssContributedTab extends ISharedTabProps {
    /**
     * Number to display next to the name of the tab in a badge. If a non-numeric value is desired
     * in the badge, use the renderBadge prop and pass a <TabBadge /> instead.
     */
    badgeCount?: number | IReadonlyObservableValue<number>;
    /**
     * A list of commands that should be rendered in the header.
     */
    commandBarItems?: IHeaderCommandBarItem[] | IReadonlyObservableArray<IHeaderCommandBarItem>;
    /**
     * If true, use a fast page switch when switching to this pivot (a url must be supplied by the pivot).
     */
    fpsRequired?: boolean;
    /**
     * Matches this Tab to a Group
     */
    groupId?: string;
    /**
     * Called when the user requests to change to this pivot. If this method return false, the change will be blocked.
     */
    onBeforeTabChange?: (ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | null, tabId: string, url?: string) => boolean;
    /**
     * Used to sort tabs. Lower order means the tab will be rendered first. If not provided, defaults to 100
     */
    order?: number;
    /**
     * Renders content for the tab
     */
    render?: () => JSX.Element;
    /**
     * Used to provide custom content in the badge area of a Tab. If the content is simply a number, use badgeCount instead.
     * In cases where the Badge should be a standard Pill, but just with text instead of a number, use a TabBadge, like the following:
     *
     * renderBadge={() => <TabBadge>50+</TabBadge>}
     */
    renderBadge?: () => React.ReactNode;
    /**
     * Renders a filter bar - provides a parameter to determine whether or not this render
     * is taking place in the tab bar or in the content
     */
    renderFilterBar?: (inTabBar: boolean) => JSX.Element | undefined;
    /**
     * Id of the route to use to compute the url for this pivot
     */
    routeId?: string;
    /**
     * Optional route values to use along with the supplied route id when computing this pivot's url
     */
    routeValues?: {
        [key: string]: string;
    };
    /**
     * If provided will use an <a> for the tab as well as allow it to be CTRL-clicked to open in
     * a new browser tab
     */
    url?: IReadonlyObservableValue<string> | string;
}
export {};
