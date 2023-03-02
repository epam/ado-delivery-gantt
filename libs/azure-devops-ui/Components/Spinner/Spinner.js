import "../../CommonImports";
import "../../Core/core.css";
import "./Spinner.css";
import * as React from "react";
import { announce } from '../../Core/Util/Accessibility';
import { css, getSafeId } from '../../Util';
import { SpinnerOrientation, SpinnerSize } from "./Spinner.Props";
export var Spinner = function (props) {
    var ariaLabel = props.ariaLabel, ariaLive = props.ariaLive, className = props.className, id = props.id, label = props.label, _a = props.orientation, orientation = _a === void 0 ? SpinnerOrientation.column : _a, _b = props.size, size = _b === void 0 ? SpinnerSize.medium : _b;
    // Only do this on mount; the aria-live region will handle any updates to props
    React.useEffect(function () {
        if (ariaLive === "assertive" || ariaLive === "polite") {
            announce(ariaLabel || label, ariaLive === "assertive");
        }
    }, []);
    return (React.createElement("div", { "aria-label": ariaLabel, "aria-live": ariaLive, className: css(className, "bolt-spinner", orientation === SpinnerOrientation.column ? "flex-column text-center rhythm-vertical-8" : "flex-row flex-center rhythm-horizontal-8"), id: getSafeId(id) },
        React.createElement("div", { className: css("bolt-spinner-circle", size) }),
        label && React.createElement("div", { className: "bolt-spinner-label" }, label)));
};
// TODO: Remove if we fix Jest issue
Spinner.displayName = "Spinner";
