import "../../CommonImports";
import "../../Core/core.css";
import "./ButtonGroup.css";
import * as React from "react";
import { css } from '../../Util';
export var ButtonGroup = function (props) {
    return (React.createElement("div", { className: css(props.className, "bolt-button-group flex-row"), role: props.role }, props.children));
};
