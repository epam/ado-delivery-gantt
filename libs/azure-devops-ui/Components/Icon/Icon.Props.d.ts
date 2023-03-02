import * as React from "react";
import { ITooltipProps } from '../../TooltipEx';
/**
 * Note the default IconSize when a custom size is not specified matches
 * the standard body-m font or 0.875rem - 14px.
 */
export declare enum IconSize {
    /**
     * Inherit has the icon take on the current text size.
     */
    inherit = "",
    /**
     * 1.5rem - 24px
     */
    large = "large",
    /**
     * 1rem - 16px
     */
    medium = "medium",
    /**
     * 0.75rem - 12px
     */
    small = "small"
}
export interface IIconProps {
    /**
     * Optional aria-describedBy
     */
    ariaDescribedBy?: string;
    /**
     * Optional aria-expanded attribute
     */
    ariaExpanded?: boolean;
    /**
     * Optional aria-hidden
     */
    ariaHidden?: boolean | "true" | "false";
    /**
     * label that can be added to the icon to help assistive technology understand
     * the meaning of the icon.
     */
    ariaLabel?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     */
    ariaLabelledBy?: string;
    /**
     * Optional classname to add to the Icon component. If the user wants to use
     * an icon that is not coming from the fabric font the className should
     * contain the font-family and the character to display.
     */
    className?: string;
    /**
     * The iconName of the fabric icon to show. Only specify an iconName when the
     * icon is coming from the fabric icon font.
     */
    iconName?: string;
    /**
     * Optional id for the root element
     */
    id?: string;
    /**
     * A unique identifier for this component.
     */
    key?: string;
    /**
     * Optional click handler for the icon
     */
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    /**
     * Optional mousedown handler for the icon.
     */
    onMouseDown?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    /**
     * Optional keydown handler for the icon.
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
    /**
     * Allows for arbitrary content to be rendered instead of using an icon from
     * the fabric icon font. A common scenario would be rendering something like a
     * status icon in place of a font icon. We want to allow for scenarios that
     * expect iconProps to work, but still allow for custom components to be rendered.
     */
    render?: (className?: string) => JSX.Element;
    /**
     * Optional aria role
     */
    role?: string;
    /**
     * Select from a standard size; for custom scenarios, you'll need to use custom CSS
     * By default, icons will inherit their font size from their parent element; if you're using an Icon inline with text, don't set this
     */
    size?: IconSize;
    /**
     * Extra styles that should be added to the element, this supports dynamic
     * styles that couldn't be defined statically in CSS.
     */
    style?: React.CSSProperties;
    /**
     * Optional tabindex
     */
    tabIndex?: number;
    /**
     * Optional title
     */
    title?: string;
    /**
     * Optional tooltip to show when the icon is hovered.
     */
    tooltipProps?: ITooltipProps;
    /**
     * Class to apply to the wrapper element.  Wrapper elements are used when aria props are provided.
     */
    wrapperClass?: string;
}
