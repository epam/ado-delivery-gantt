import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { Observer } from '../../Observer';
export function ConditionalChildren(props) {
    return (React.createElement(Observer, { renderChildren: props.renderChildren }, function (observedProps) {
        if (observedProps.renderChildren !== !!props.inverse) {
            if (props.children) {
                return props.children;
            }
        }
        return null;
    }));
}
