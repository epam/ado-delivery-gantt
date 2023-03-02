import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { Breakpoint } from '../../Breakpoint';
export function TableBreakpoint(props) {
    var breakpoints = [];
    var onBreakpoint = function (breakpointIndex, breakpoint) {
        var columnWidths = props.breakpoints[Math.max(0, breakpointIndex)].columnWidths;
        for (var index = 0; index < columnWidths.length; index++) {
            if (ObservableLike.isObservable(props.columnWidths[index])) {
                props.columnWidths[index].value = columnWidths[index];
            }
        }
        // Notify the owner if the responsive udpate property was supplied.
        if (props.onBreakpoint) {
            props.onBreakpoint(breakpointIndex, breakpoint);
        }
    };
    // Compute the breakpoints from the table definition.
    for (var index = 0; index < props.breakpoints.length; index++) {
        breakpoints.push(props.breakpoints[index].breakpoint);
    }
    // Compute the set of breakpoints needed for the responsive columns.
    return React.createElement(Breakpoint, { breakpoints: breakpoints, onBreakpoint: onBreakpoint });
}
