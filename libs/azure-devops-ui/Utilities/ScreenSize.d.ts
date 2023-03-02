import * as React from "react";
import { ScreenSize } from '../Core/Util/Screen';
export interface IScreenSizeConditionalProps {
    condition: (screenSize: ScreenSize) => boolean;
}
export declare const ScreenSizeObserver: (props: any) => JSX.Element;
/**
 * Conditionally renders children based on screen size.
 */
export declare const ScreenSizeConditional: React.FunctionComponent<IScreenSizeConditionalProps>;
