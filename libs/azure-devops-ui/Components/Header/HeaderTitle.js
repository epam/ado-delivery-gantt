import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { TitleSize } from "./Header.Props";
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId } from '../../Util';
export function HeaderTitle(props) {
    var _a = props.ariaLevel, ariaLevel = _a === void 0 ? 1 : _a, id = props.id;
    var titleSizeClass = undefined;
    switch (props.titleSize) {
        case TitleSize.Large:
            titleSizeClass = "title-m l";
            break;
        case TitleSize.Small:
            titleSizeClass = "title-xs s";
            break;
        case TitleSize.Medium:
        default:
            titleSizeClass = "body-xl m";
    }
    return (React.createElement(Tooltip, { overflowOnly: true },
        React.createElement("div", { "aria-level": ariaLevel, className: css(props.className, "bolt-header-title", titleSizeClass), id: getSafeId(id), role: "heading" }, props.children)));
}
