import * as React from "react";
import { IIconProps } from '../../Icon';
/**
 * Defines options for displaying actions in ZeroData component.
 */
export declare enum ZeroDataActionType {
    ctaButton = 0,
    link = 2
}
/**
 * Describes an item displayed by the ZeroData component.
 */
export interface IZeroDataItem {
    /**
     * Path to the image to display.
     */
    imagePath?: string;
    /**
     * Props to pass to the icon to render in place of an image
     */
    iconProps?: IIconProps;
    /**
     * Alt text to set for the image
     */
    imageAltText: string;
    /**
     * Primary text to display
     */
    primaryText?: string;
    /**
     * Secondary text to display
     */
    secondaryText?: string | JSX.Element;
    /**
     * A function to render an action other than the standard button or link.
     * If specified, actionText, actionType, onActionClick, and actionHref will be ignored.
     */
    renderAction?: () => JSX.Element;
    /**
     * Text to put on the button. If not set, no button will be rendered.
     */
    actionText?: string;
    /**
     * The type of button to render. Default is link.
     */
    actionType?: ZeroDataActionType;
    /**
     * Callback called when the user clicks on the button
     */
    onActionClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IZeroDataItem) => void;
    /**
     * href used for link when actionType is link
     */
    actionHref?: string;
    /**
     * Additional props to pass to the button
     */
    actionButtonProps?: any;
}
/**
 * Properties for the ZeroData component.
 */
export interface IZeroDataProps extends IZeroDataItem {
    /**
     * Class name for the root component
     */
    className?: string;
}
/**
 * Properties for the ZeroDataMultiple component.
 */
export interface IZeroDataMultipleProps {
    /**
     * ZeroData items to display
     */
    items: IZeroDataItem[];
    /**
     * Class name for the root component
     */
    className?: string;
}
