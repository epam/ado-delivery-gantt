/// <reference types="react" />
import { ITooltipProps } from '../../TooltipEx';
export interface IAnchorProps {
    /**
     * Optional href; if you don't provide one your link won't point anywhere
     */
    href?: string;
    /**
     * When a link opens in a new tab/window
     */
    rel?: string;
    /**
     * Optional target, eg. _blank
     */
    target?: string;
}
export interface ILink {
    focus(): void;
}
export interface ILinkProps extends IAnchorProps {
    /**
     * Optional aria described by for detailed information about the link
     */
    ariaDescribedBy?: string;
    /**
     * Optional expanded flag for accessibility
     */
    ariaExpanded?: boolean;
    /**
     * Optional hasPopup for accessibility
     */
    ariaHasPopup?: boolean;
    /**
     * Optional aria label
     */
    ariaLabel?: string;
    /**
     * Optional selected for accessibility
     */
    ariaSelected?: boolean;
    /**
     * Optional class name to render
     */
    className?: string;
    /**
     * Optional standin for data-is-focusable
     * @@OFFICE_FABRIC remove when we are done.
     */
    dataIsFocusable?: boolean;
    /**
     * Optional disabled boolean for the
     */
    disabled?: boolean;
    /**
     * Optional point to a download location
     */
    download?: string;
    /**
     * Sets the draggable attribute on the element.
     */
    draggable?: boolean;
    /**
     * Set to true if you don't want the link's focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true if you don't want the link's to be tabbable.
     */
    excludeTabStop?: boolean;
    /**
     * Optional ID to emit
     */
    id?: string;
    /**
     * Optional onBlur handler
     */
    onBlur?: (event: React.FocusEvent<HTMLAnchorElement>) => void;
    /**
     * Optional onClick handler
     */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void;
    /**
     * Optional onFocus handler
     */
    onFocus?: (event: React.FocusEvent<HTMLAnchorElement>) => void;
    /**
     * Optional hoverStart handler
     */
    onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Optional hoverEnd handler
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Optional mouseOver handler
     */
    onMouseOver?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Optional onTouchEnd handler
     */
    onTouchEnd?: (event: React.TouchEvent<HTMLAnchorElement>) => void;
    /**
     * Optional onTouchMove handler
     */
    onTouchMove?: (event: React.TouchEvent<HTMLAnchorElement>) => void;
    /**
     * Optional onTouchStart handler
     */
    onTouchStart?: (event: React.TouchEvent<HTMLAnchorElement>) => void;
    /**
     * Optional role
     */
    role?: string;
    /**
     * Whether or not to apply subtle styling to the link
     */
    subtle?: boolean;
    /**
     * Optional tabIndex
     */
    tabIndex?: number;
    /**
     * Optional link title
     */
    title?: string;
    /**
     * Optional tooltip to show when the link is hovered.
     */
    tooltipProps?: ITooltipProps;
    /**
     * Set to true to underline the link text.
     */
    underline?: boolean;
}
