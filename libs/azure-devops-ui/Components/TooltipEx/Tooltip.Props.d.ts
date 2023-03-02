import * as React from "react";
import { IOffset, IOrigin } from '../../Utilities/Position';
export interface ITooltipProps {
    /**
     * When true, will add the aria-describedby attribute to the child using the
     * getSafeId value of the tooltip id.
     */
    addAriaDescribedBy?: boolean;
    /**
     * anchorOffset is used to shift the location of the callout from the defined
     * location by a fixed amount. An example might be the tooltip callout defaults
     * to an anchorOffset of { x: 8 y: 8 } from the mouse position.
     */
    anchorOffset?: IOffset;
    /**
     * When an anchorElement is supplied the anchorOrigin is used to describe the
     * relative location of the callout with respect to the anchorElement.
     */
    anchorOrigin?: IOrigin;
    /**
     * CSS className to add to the tooltip.
     */
    className?: string;
    /**
     * When the tooltip shows up it is delayed by delayMs. This prevents the tooltip
     * from blinking when the mouse goes over an element but doesnt hover for long
     * enough. The default is 250ms.
     *
     * @default 250
     */
    delayMs?: number;
    /**
     * If the tooltip is marked disabled it wont be shown on its normal show condition
     * like hover or focus.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * fixedLayout is used to determine whether or not the callout should be moved
     * based on visibility. if fixedLayout is set to true the callout wont be moved.
     *
     * @default false
     */
    fixedLayout?: boolean;
    /**
     * Optional id for the tooltip container element.
     */
    id?: string;
    /**
     * Pass to use a custom function to check for overflow.  By default, the anchorElement's
     * scroll width is compared to the its offset width.
     */
    overflowDetected?: (anchorElement: HTMLElement) => boolean;
    /**
     * Only show the tooltip if the contained element is larger than the element it
     * is housed in. This is designed to help with showing the full text when an
     * ellipsis it used to clip the text.
     *
     * @default false
     */
    overflowOnly?: boolean;
    /**
     * Show the tooltip when the tooltip's children get focus. The component MUST be
     * given content to show and not use the innerText that comes from overflowOnly.
     *
     * @default true
     */
    showOnFocus?: boolean;
    /**
     * Text to show when the tooltip is shown.
     */
    text?: string;
    /**
     * tooltipOrigin works in conjunction with the other position styles;
     * anchorElement, anchorOffset, anchorOrigin. After determining the location
     * based on the anchor properties the position of the tooltip is applied.
     */
    tooltipOrigin?: IOrigin;
    /**
     * renderContent can be used to render custom HTML inside the tooltip.
     *
     * NOTE: This shouldn't be used to create a custom Callout, use the Callout
     * component, this should be used for helping users understand the details
     * about a component on the page.
     */
    renderContent?: () => React.ReactNode;
}
