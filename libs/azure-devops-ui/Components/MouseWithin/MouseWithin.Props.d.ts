import * as React from "react";
export interface IMouseWithin {
    hasMouse: () => boolean;
}
export interface IMouseWithinEvents {
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}
export interface IMouseWithinProps extends IMouseWithinEvents {
    /**
     * An enterDelay can be specified to control how long the mouse must be over
     * the component before the onMouseEnter delegate is called.
     */
    enterDelay?: number;
    /**
     * A leaveDelay can be specified to control how long the mouse must be out of
     * the component before the onMouseLeave delegate is called.
     */
    leaveDelay?: number;
    /**
     * If updateStateOnMouseChange is set to true, the MouseWithin component will update
     * the state of the component and cause a re-render of the sub-tree when the mouse enters
     * of leaves the component.
     */
    updateStateOnMouseChange?: boolean;
}
/**
 * The IMouseWithinStatus is passed to the children when the MouseWithin is rendered.
 */
export interface IMouseWithinStatus extends IMouseWithinEvents {
    hasMouse: boolean;
}
