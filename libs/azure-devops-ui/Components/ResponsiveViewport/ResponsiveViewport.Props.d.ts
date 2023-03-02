import * as React from "react";
export interface IBreakPoint {
    /**
     * If set, the breakpoint is only active if the width of the element is greater than the given value
     **/
    minWidth?: number;
    /**
     * If set, the breakpoint is only active if the width of the element is less than or equal to the given value
     *
     * Note: this is different than standard CSS @media query behavior to deal with non-integer widths
     **/
    maxWidth?: number;
    /**
     * Name of class to apply if breakpoint is active
     **/
    className: string;
}
export interface IResponsiveViewportProps<T extends IBreakPoint = IBreakPoint> {
    /** Name of the tag used to create the wrapper element */
    tag?: string;
    /** Optional class name to apply to wrapper element */
    className?: string;
    /** List of breakpoints */
    breakPoints: ReadonlyArray<T>;
    /** Optional initialWidth to compute initial breakpoints */
    initialWidth?: number;
    /** Optional callback to get a reference to the viewport once mounted */
    componentRef?: (ref: IResponsiveViewport) => void;
    /** Optional callback to render the content, by default  */
    onRenderContent?: (activeBreakPoints: T[]) => React.ReactNode;
}
export interface IResponsiveViewport {
    /** Measure current size and update breakpoints accordingly */
    measure(): void;
}
