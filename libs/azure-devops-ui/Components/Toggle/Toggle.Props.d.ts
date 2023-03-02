import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { ITooltipProps } from '../../TooltipEx';
export interface IToggleProps {
    /**
     * Aria Label for the Toggle for screen reader users.
     */
    ariaLabel?: string;
    /**
     * Aria label when checked is true.
     */
    onAriaLabel?: string;
    /**
     * Aria label when checked is false.
     */
    offAriaLabel?: string;
    /**
     * The checked state of the toggle.
     * @default false
     */
    checked?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * Optional class name to add to the toggle element.
     */
    className?: string;
    /**
     * If true, the toggle cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * Set to true if you don't want the toggle's focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true to omit setting the tab index to 0.
     */
    excludeTabStop?: boolean;
    /**
     * Optional id to add to the toggle element.
     */
    id?: string;
    /**
     * Text to display when the toggle is unchecked.
     */
    offText?: string;
    /**
     * Text to display when toggle is checked.
     */
    onText?: string;
    /**
     * Aria role of the toggle element.
     * @default switch
     */
    role?: string;
    /**
     * Text to display next to the toggle regardless of checked state.
     */
    text?: string;
    /**
     * Optional tooltip to show when the radio button is hovered.
     */
    tooltipProps?: ITooltipProps;
    /**
     * An optional callback to handle click and keyboard events.
     */
    onChange?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, checked: boolean) => void;
}
