import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
export var PanelOverlay = function (props) {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "absolute-fill bolt-panel-overlay sub-layer" }),
        React.createElement("div", { className: "absolute-fill flex-column flex-center justify-center sub-layer" }, props.overlayContent)));
};
