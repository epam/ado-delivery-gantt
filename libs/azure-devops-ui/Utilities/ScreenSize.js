import * as React from "react";
import { ScreenContext } from '../Core/Util/Screen';
import { Observer } from '../Observer';
export var ScreenSizeObserver = function (props) {
    return React.createElement(ScreenContext.Consumer, null, function (screen) { return React.createElement(Observer, { screenSize: screen.size }, props.children); });
};
/**
 * Conditionally renders children based on screen size.
 */
export var ScreenSizeConditional = function (props) {
    return (React.createElement(ScreenSizeObserver, null, function (screenSizeProps) { return props.condition(screenSizeProps.screenSize) && props.children; }));
};
