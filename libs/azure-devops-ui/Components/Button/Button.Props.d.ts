import * as React from "react";
import { IIconProps } from '../../Icon';
import { ITooltipProps } from '../../TooltipEx';
export interface IButton {
    /**
     * Sets focus to the Button.
     */
    focus(): void;
}
export interface IButtonProps {
    
    children?: React.ReactNode;

    /**
     * If true, the button is focused when mounted.
     * @default false
     */
    autoFocus?: boolean;
    /**
     * Adds aria-checked to the button element.
     */
    ariaChecked?: boolean;
    /**
     * Adds aria-controls to the button element.
     *
     * NOTE: Give the base Id in this case, NOT the getSafeId.
     */
    ariaControls?: string;
    /**
     * Adds aria-describedby to the button element.
     *
     * NOTE: Give the base Id in this case, NOT the getSafeId.
     */
    ariaDescribedBy?: string;
    /**
     * Adds aria-disabled to the button element.
     */
    ariaDisabled?: boolean;
    /**
     * Adds aria-expanded to the button element.
     */
    ariaExpanded?: boolean;
    /**
     * Adds aria-haspopup to the button element.
     */
    ariaHasPopup?: boolean;
    /**
     * Adds aria-disabled to the button element.
     */
    ariaHidden?: boolean;
    /**
     * Adds aria-label to the button element.
     */
    ariaLabel?: string;
    /**
     * Adds aria-labelledby to the button element.
     */
    ariaLabelledBy?: string;
    /**
     * Adds aria-posinset to the button element.
     */
    ariaPosInSet?: number;
    /**
     * Adds aria-roledescription to the button element.
     */
    ariaRoleDescription?: string;
    /**
     * Adds aria-pressed to the button element.
     */
    ariaPressed?: boolean;
    /**
     * Adds aria-selected to the button element.
     */
    ariaSelected?: boolean;
    /**
     * Adds aria-setsize to the button element.
     */
    ariaSetSize?: number;
    /**
     * Optional class name to add to the button element.
     */
    className?: string;
    /**
     * Set to true if this button should be styled with a danger color.
     */
    danger?: boolean;
    /**
     * An optional data attribute to add to the button element.
     */
    dataIndex?: number;
    /**
     * If true, the button cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * Set to true if you don't want the button's focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true if you don't want the button's to be tabbable.
     */
    excludeTabStop?: boolean;
    /**
     * Set the buttons focus zone to be different than the closest parent focus zone.
     */
    focusZoneId?: string;
    /**
     * Href to navigate to when the button is clicked.  Pass in if this is a link button.
     */
    href?: string;
    /**
     * Object specifying which icon to display within the button.
     */
    iconProps?: IIconProps;
    /**
     * A unique identifier for the button
     */
    id?: string;
    /**
     * Callback to handle blur events
     */
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    /**
     * Callback to handle button clicks.
     */
    onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    /**
     * Callback to handle button key down.
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    /**
     * Callback to handle mouse leave events.
     */
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Callback to handle mouse leave events.
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Callback to handle mouse over events.
     */
    onMouseOver?: (event: React.MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => void;
    /**
     * Callback to handle focus events
     */
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    /**
     * Set to true if this button should be styled with a primary color.
     */
    primary?: boolean;
    /**
     * Optional, relationship between current document and the linked document. Only required if href is set.
     */
    rel?: string;
    /**
     * Optional aria role.
     * @default button
     */
    role?: string;
    /**
     * Extra styles that should be added to the element, this supports dynamic
     * styles that couldn't be defined statically in CSS.
     */
    style?: React.CSSProperties;
    /**
     * Set to true to style this as a subtle button.
     */
    subtle?: boolean;
    /**
     * Sets the tabindex on the button element.
     */
    tabIndex?: number;
    /**
     * Optional,context in which the linked resource will open.
     */
    target?: string;
    /**
     * Optional, type of button.
     * @default "button" if href is not set, otherwise undefined
     */
    type?: "submit" | "reset" | "button";
    /**
     * Optional text to render inside the button.
     */
    text?: string;
    /**
     * Optional tooltip to show when the button is hovered.
     * For icon only buttons, the tooltip will default to the aria-label.
     */
    tooltipProps?: ITooltipProps;
}
