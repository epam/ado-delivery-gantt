import * as React from "react";
export declare enum PillGroupOverflow {
    clip = 0,
    wrap = 1,
    fade = 2
}
export interface IPillGroupProps {
    /**
     * Optional class name to add to the pill group.
     */
    className?: string;
    /**
     * Optional mouse-enter handler
     */
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Optional mouse-leave handler
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Set the overflow behavior.
     *
     * @default PillGroupOverflow.clip
     */
    overflow?: PillGroupOverflow;
}
