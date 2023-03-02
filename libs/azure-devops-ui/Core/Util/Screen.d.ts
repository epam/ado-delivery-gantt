import * as React from "react";
import { IObservableValue } from '../Observable';
export declare enum ScreenBreakpoints {
    /**
     * Smallest breakpoint used to react which usually corresponds to a mobile screen < 600px.
     */
    xsmall = 1,
    /**
     * Medium breakpoint used to react when the screen size >= 600px and less than
     * the next breakpoint if exists.
     */
    small = 600,
    /**
     * Medium breakpoint used to react when the screen size >= 1024px and less than
     * the next breakpoint if exists.
     */
    medium = 1024,
    /**
     * Large breakpoint used to react when the screen size >= 1366px and less than
     * the next breakpoint if exists.
     */
    large = 1366,
    /**
     * Largest breakpoint used to react when the screen size >= 1920px and less than
     * the next breakpoint if exists.
     */
    xlarge = 1920
}
export declare enum ScreenSize {
    xsmall = 0,
    small = 1,
    medium = 2,
    large = 3,
    xlarge = 4
}
export interface IScreenContext {
    /**
     * Specifies the size of the current window
     */
    size: IObservableValue<ScreenSize>;
}
export declare const ScreenContext: React.Context<IScreenContext>;
