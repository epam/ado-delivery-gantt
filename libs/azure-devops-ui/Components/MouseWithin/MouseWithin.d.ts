import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IMouseWithin, IMouseWithinProps } from "./MouseWithin.Props";
export declare class MouseWithin extends React.Component<IMouseWithinProps> implements IMouseWithin {
    static defaultProps: {
        updateStateOnMouseChange: boolean;
    };
    private enterTimeout;
    private delayTimeout;
    private mouse;
    render(): JSX.Element;
    componentWillUnmount(): void;
    /**
     * hasMouse returns true if the mouse is contained within the component
     * hierarchy. This includes portals, the element may or may not
     * be a direct descendant of the component in the DOM structure.
     */
    hasMouse(): boolean;
    private mouseEntered;
    private mouseLeft;
    /**
     * onMouseEnter method that should be attached to the onMouseEnter handler of the
     * continer's root element.
     */
    private onMouseEnter;
    /**
     * onMouseLeave method that should be attached to the onMouseLeave handler of the
     * container's root element.
     */
    private onMouseLeave;
}
