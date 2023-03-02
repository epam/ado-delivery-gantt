import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { SurfaceContext } from '../../Surface';
import { css } from '../../Util';
export var PanelContent = function (props) {
    return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement("div", { className: css(props.className, "bolt-panel-content flex-row flex-grow scroll-auto", surfaceContext.horizontalClassName) }, props.children)); }));
};
