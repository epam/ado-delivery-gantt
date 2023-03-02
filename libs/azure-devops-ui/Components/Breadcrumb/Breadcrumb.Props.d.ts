import * as React from "react";
import { IIconProps } from '../../Icon';
import { IMenuItem } from '../../Menu';
export interface IBreadcrumbProps {
    /**
     * Aria label to be used for the entire breadcrumb
     */
    ariaLabel?: string;
    /**
     * Class name to apply to the root element
     */
    className?: string;
    /**
     * Set to false to prevent breadcrumb items from being managed by a focus group.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to false to prevent tab index being set to 0 for breadcrumb items.
     */
    excludeTabStop?: boolean;
    /**
     * Custom element to render after the breadcrumb.
     */
    extraContent?: JSX.Element;
    /**
     * Class name to apply to the extra content element
     */
    extraContentClassName?: string;
    /**
     * items to display
     * @default []
     */
    items?: IBreadcrumbItem[];
    /**
     * Optional aria role to apply to the breadcrumb container.
     */
    role?: string;
}
export interface IBreadcrumbItem {
    /**
     * Aria description for an individual breadcrumb item
     */
    ariaDescription?: string;
    /**
     * Aria label to be used for an individual breadcrumb item
     */
    ariaLabel?: string;
    /**
     * Url to navigate to when this breadcrumb is clicked.
     */
    href?: string;
    /**
     * Optional props for an icon to display before the text
     */
    iconProps?: IIconProps;
    /**
     * Arbitrary unique string associated with the breadcrumb
     */
    key: string;
    /**
     * Optional props for the menu item generated on overflow, to override default props
     */
    menuItemProps?: IMenuItem;
    /**
     * Callback issued when the breadcrumb is selected.
     */
    onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => void;
    /**
     * If multiple items with the same id are contributed, the one with the highest priority will be shown.
     */
    priority?: number;
    /**
     * Sets the order items should be displayed in (lowest first, undefined and 0 last).
     */
    rank?: number;
    /**
     * Text to display to the user for the breadcrumb
     */
    text: string;
    /**
     * Set to true to hide this item.  This should only be used with priority to hide default items.
     */
    hidden?: boolean;
}
