import "../../CommonImports";
import "../../Core/core.css";
import "./Card.css";
import * as React from "react";
import { SurfaceContext } from '../../Surface';
import { css } from '../../Util';
export var CardContent = function (props) {
    return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) {
        var _a = props.contentPadding, contentPadding = _a === void 0 ? true : _a;
        return (React.createElement("div", { className: css(props.className, "bolt-card-content flex-row flex-grow", contentPadding && surfaceContext.horizontalClassName) }, props.children));
    }));
};
