import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./FabricIcons.css";
import * as React from "react";
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId } from '../../Util';
export function Icon(props) {
    if (props.render) {
        return props.render(props.className);
    }
    var iconWrapperProps = {
        id: getSafeId(props.id),
        onClick: props.onClick,
        onMouseDown: props.onMouseDown,
        onKeyDown: props.onKeyDown,
        role: props.role ? props.role : props.ariaLabel || props.ariaLabelledBy ? "img" : undefined,
        style: props.style,
        tabIndex: props.tabIndex,
        title: props.title
    };
    var iconClassName = css(props.className, "flex-noshrink", props.iconName && "fabric-icon", props.iconName && "ms-Icon--" + props.iconName, props.size);
    var ariaHidden = props.ariaHidden !== undefined ? props.ariaHidden : "true";
    var icon = props.ariaLabel || props.ariaLabelledBy || props.ariaExpanded !== undefined ? (React.createElement("span", __assign({ "aria-expanded": props.ariaExpanded, "aria-label": props.ariaLabel, "aria-labelledby": getSafeId(props.ariaLabelledBy), className: props.wrapperClass }, iconWrapperProps),
        React.createElement("span", { "aria-hidden": ariaHidden, className: iconClassName }))) : (React.createElement("span", __assign({ "aria-hidden": ariaHidden, className: iconClassName }, iconWrapperProps)));
    if (props.tooltipProps) {
        icon = React.createElement(Tooltip, __assign({}, props.tooltipProps), icon);
    }
    return icon;
}
