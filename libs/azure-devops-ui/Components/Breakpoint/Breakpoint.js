import "../../CommonImports";
import "../../Core/core.css";
import "./Breakpoint.css";
import * as React from "react";
import { Intersection } from '../../Intersection';
export function Breakpoint(props) {
    var observationElement = React.useState(function () { return React.createRef(); })[0];
    var lastBreakpointIndex = -2;
    var observationElementFunction = function () {
        return observationElement.current;
    };
    var observationDelegate = function () {
        var visibleWidth = observationElement.current.parentElement.clientWidth;
        var breakpoints = props.breakpoints, onBreakpoint = props.onBreakpoint;
        // Determine the longest visible breakpoint.
        var breakpointIndex = breakpoints.length - 1;
        for (; breakpointIndex >= 0; breakpointIndex--) {
            if (visibleWidth >= breakpoints[breakpointIndex]) {
                break;
            }
        }
        // Notify the caller about the change in the breakpoint.
        if (breakpointIndex !== lastBreakpointIndex) {
            lastBreakpointIndex = breakpointIndex;
            onBreakpoint(breakpointIndex, breakpoints[breakpointIndex]);
        }
    };
    // Compute the threshold we will use for the notification. This is the percentage
    // visibility of the observation element within the container.
    // NOTE: Due to rounding issues we need to know about all 3 pixels (1 before, at breakpoint, 1 after).
    var breakpoints = props.breakpoints;
    var observationWidth = breakpoints[breakpoints.length - 1] + 1;
    var threshold = [];
    for (var index = 0; index < breakpoints.length; index++) {
        threshold[index * 3] = (breakpoints[index] - 1) / observationWidth;
        threshold[index * 3 + 1] = breakpoints[index] / observationWidth;
        threshold[index * 3 + 2] = (breakpoints[index] + 1) / observationWidth;
    }
    return (React.createElement("div", { className: "bolt-breakpoint relative" },
        React.createElement(Intersection, { observationElement: observationElementFunction, onIntersect: observationDelegate, threshold: threshold },
            React.createElement("div", { className: "bolt-breakpoint-container absolute-fill scroll-hidden" },
                React.createElement("div", { className: "bolt-breakpoint-observation absolute", ref: observationElement, style: { width: observationWidth + "px" } })))));
}
