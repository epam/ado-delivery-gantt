import * as React from "react";
import { IOrigin } from '../../Utilities/Position';
import { IImageProps } from '../../Image';
import { IButtonProps } from '../../Button';
export interface ITeachingBubble {
    dismiss: () => void;
}
export interface ITeachingBubbleProps extends ICustomTeachingBubbleProps {
    /**
     * Optional image to render in the teaching bubble
     */
    imageProps?: IImageProps;
    /**
     * Optional button to render in the teaching bubble
     */
    primaryButtonProps?: IButtonProps;
    /**
     * Second optional button to render in the teaching bubble.
     */
    secondaryButtonProps?: IButtonProps;
    /**
     * Body to be rendered in the bubble
     */
    text: React.ReactNode;
    /**
     * A title to be rendered for the bubble
     */
    title?: string;
}
export interface ICustomTeachingBubbleProps {
    /**
     * The element the teaching bubble is positioned relative to.
     */
    anchorElement: HTMLElement;
    /**
     * When an anchorElement is supplied the anchorOrigin is used to describe the
     * relative location of the callout with respect to the anchorElement.
     */
    anchorOrigin: IOrigin;
    /**
     * aria-describedby for the teaching bubble
     */
    ariaDescribedBy?: string;
    /**
     * aria-label for the teaching bubble
     */
    ariaLabeledBy?: string;
    /**
     * How the bubble should be aligned if the anchor origin is a corner
     * @default vertical
     */
    cornerPlacement?: TeachingBubbleCornerPlacement;
    /**
     * When the teaching bubble is mounted, what will be the element inside that gets focus.
     */
    defaultActiveElement?: string | (() => string);
    /**
     * Callback for when the teaching bubble is dismissed. The owner should be responsible for hiding the teaching bubble.
     */
    onDismiss: () => void;
    /**
     * Callback when a teaching bubble changes postion upon changing the anchor element or anchor origin.
     */
    onLocationChange?: () => void;
    /**
     * Is the teachign bubble only text? This will cause the callout to have light dismiss behavior.
     */
    textOnly?: boolean;
}
export declare enum TeachingBubbleCornerPlacement {
    /**
     * If the anchor origin is a corner, the bubble will be positioned to the right/left of the element
     */
    horizontal = 0,
    /**
     * If the anchor origin is a corner, the bubble will be positioned above/below the element
     */
    vertical = 1
}
