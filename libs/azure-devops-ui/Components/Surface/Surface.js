import "../../CommonImports";
import "../../Core/core.css";
import "./Surface.css";
import * as React from "react";
import { SurfaceBackground } from "./Surface.Props";
export var SurfaceContext = React.createContext({
    background: SurfaceBackground.normal,
    horizontalClassName: undefined,
    spacing: undefined,
    verticalClassName: undefined
});
export var Surface = function (props) {
    return (React.createElement(SurfaceContext.Provider, { value: {
            background: props.background,
            horizontalClassName: getHorizontalSpacingClassName(props.spacing),
            spacing: props.spacing
        } }, props.children));
};
function getHorizontalSpacingClassName(spacing) {
    if (spacing !== undefined) {
        return horizontalSpacingClassNames[spacing];
    }
    return undefined;
}
var horizontalSpacingClassNames = [
    "bolt-condensed-horizontal-spacing",
    "bolt-default-horizontal-spacing",
    "bolt-relaxed-horizontal-spacing"
];
