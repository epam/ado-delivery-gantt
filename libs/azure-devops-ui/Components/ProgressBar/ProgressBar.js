import "../../CommonImports";
import "../../Core/core.css";
import "./ProgressBar.css";
import * as React from "react";
import { Observer } from '../../Observer';
import { css } from '../../Util';
export var ProgressBar = function (props) {
    return (React.createElement(Observer, { currentValue: props.currentValue }, function (barProps) {
        var _a = props.transitionDuration, transitionDuration = _a === void 0 ? 150 : _a;
        return (React.createElement("span", { className: css(props.className, "bolt-progress-bar-container flex-row flex-noshrink flex-grow scroll-hidden") },
            React.createElement("span", { "aria-label": props.ariaLabel, "aria-valuemin": 0, "aria-valuemax": props.maxValue, "aria-valuenow": barProps.currentValue, className: css(props.progressBarClassName, "bolt-progress-bar-bar"), role: "progressbar", style: {
                    transitionDuration: transitionDuration + "ms",
                    transform: "scaleX(" + barProps.currentValue / props.maxValue + ")"
                } })));
    }));
};
