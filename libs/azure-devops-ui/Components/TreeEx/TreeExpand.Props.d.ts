import * as React from "react";
import { IIconProps } from '../../Icon';
/**
 * The expander is used to render a tree element that shows the expand/collapse
 * state of the given element.
 */
export interface ITreeExpandProps {
    /**
     * Optional CSS className to apply to the item.
     */
    className?: string;
    /**
     * The depth determines how much space appears to the left of the expander.
     * The space is defined as depth * indentationSize.
     */
    depth: number;
    /**
     * Defines whether or not the item is currently expanded or not.
     */
    expanded?: boolean;
    /**
     * The iconName for the collapsed state.
     *
     * @default "ChevronRight"
     */
    iconCollapsedProps?: IIconProps;
    /**
     * The iconName for the expanded state.
     *
     * @default "ChevronDown"
     */
    iconExpandedProps?: IIconProps;
    /**
     * Number of pixels the indentation will apply for each depth.
     *
     * @default 16
     */
    indentationSize?: number;
    /**
     * When the user clicks on the tree expand. This allows the override the
     * click behavior without requiring another element.
     */
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Method that will be called when the expander is toggled. If no toggle
     * mehod is supplied the expander will be drawn but will be invisible.
     */
    onToggle?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}
