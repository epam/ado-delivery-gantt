import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { css } from '../../Util';
export function ListDropIndicator(props) {
    var position = props.position, xOffset = props.xOffset, lineOffset = props.lineOffset;
    var circleLeft = (xOffset || 0) + "px";
    var lineLeft = (lineOffset || 0) + "px";
    var positionClassName = position;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: css("bolt-list-drop-indicator-line flex-grow absolute", positionClassName), style: { left: lineLeft } }),
        React.createElement("div", { className: css("bolt-list-drop-indicator-circle absolute", positionClassName), style: { left: circleLeft } })));
}
