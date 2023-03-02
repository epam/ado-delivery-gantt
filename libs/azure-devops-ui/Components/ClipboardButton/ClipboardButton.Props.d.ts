/// <reference types="react" />
import { ITooltipProps } from '../../TooltipEx';
export interface IClipboardButtonProps {
    /**
     * Aria label to pass to button
     * @default "Copy to clipboard"
     */
    ariaLabel?: string;
    /**
     * Optional CSS class name to add to Clipboard Button
     */
    className?: string;
    /**
     * Callback provided when the button looses the focus.
     */
    onBlur?: () => void;
    /**
     * Callback provided after a copy is finished.
     */
    onCopy?: () => void;
    /**
     * Callback provided when the button gets the focus.
     */
    onFocus?: (e: React.FocusEvent) => void;
    /**
     * Function to retreive the text that will be copied to the clipboard.
     * This function can return either a plain text string, a new JSX.Element
     * with the HTML to copy, or an  HTMLexisting DOM Element.
     */
    getContent: () => string | JSX.Element | HTMLElement;
    /**
     * If set to true, the tooltip will be changed to "Copied to Clipboard" when
     * the button is clicked.
     * If a string is provided the tooltip will be changed to the string instead.
     */
    showCopiedTooltip?: boolean | string;
    /**
     * Set to true to style this as a subtle button.
     */
    subtle?: boolean;
    /**
     * Optional tooltip to show when the button is hovered.
     */
    tooltipProps?: ITooltipProps;
    /**
     * Callback to handle mouse leave events.
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}
