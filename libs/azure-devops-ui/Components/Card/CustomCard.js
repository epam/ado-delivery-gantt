import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Card.css";
import * as React from "react";
import { Spacing, Surface, SurfaceBackground, SurfaceContext } from '../../Surface';
import { css } from '../../Util';
export var CustomCard = function (props) {
    return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(Surface, __assign({}, surfaceContext, { spacing: Spacing.default }),
        React.createElement("div", { className: css(props.className, "bolt-card flex-column depth-8", surfaceContext.background === SurfaceBackground.neutral && "bolt-card-white") }, props.children))); }));
};
