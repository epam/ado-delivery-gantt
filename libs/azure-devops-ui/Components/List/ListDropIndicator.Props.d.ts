/**
 * Represents where within the containing element to draw the drop indicator
 */
export declare enum ListDropIndicatorPosition {
    bottom = "bottom",
    top = "top",
    left = "left",
    right = "right"
}
export interface IListDropIndicatorProps {
    /**
     * Whether the indicator is appearing at the top, or the bottom, or sides of its containing element.
     * @default bottom
     */
    position?: ListDropIndicatorPosition;
    /**
     * How much to offset where the circle is rendered on the horizontal axis
     * @default 0
     */
    xOffset?: number;
    /**
     * How much to offset the line horizontally when it is vertical
     * @default 0
     */
    lineOffset?: number;
}
