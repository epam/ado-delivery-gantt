export interface IBreakpointProps {
    /**
     * Set of breakpoint sizes the caller is interested in. As the elements size either
     * shrinks or grows beyond one of these values the onBreakpoint delegate will be
     * called with the breakpoint index with the smaller but closest value to the current
     * size of the element.
     *
     * These numbers should be sorted from smallest to largest.
     */
    breakpoints: number[];
    /**
     * Delegate that is called when the breakpoint changes.
     */
    onBreakpoint: (breakpointIndex: number, breakpoint: number) => void;
}
