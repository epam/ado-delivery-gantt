import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { Icon } from '../../Icon';
import { css } from '../../Util';
export var ListDragImage = function (props) {
    return (React.createElement(React.Fragment, null,
        props.iconProps && React.createElement(Icon, __assign({}, props.iconProps, { className: css(props.iconProps.className, "flex-noshrink icon-margin") })),
        React.createElement("span", { className: "text-ellipsis" }, props.text)));
};
