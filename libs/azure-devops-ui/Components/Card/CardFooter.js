import "../../CommonImports";
import "../../Core/core.css";
import "./Card.css";
import * as React from "react";
import { SurfaceContext } from '../../Surface';
import { css } from '../../Util';
export var CardFooter = function (props) {
    return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement("div", { className: css(props.className, "bolt-card-footer flex-row flex-noshrink", surfaceContext.horizontalClassName) }, props.children)); }));
};
