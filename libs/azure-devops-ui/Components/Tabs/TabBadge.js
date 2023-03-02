import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { Pill, PillSize } from '../../Pill';
import { Tooltip } from '../../TooltipEx';
import { css } from '../../Util';
export var TabBadge = function (props) {
    var children = props.children, className = props.className, _a = props.containsCount, containsCount = _a === void 0 ? true : _a, tooltipProps = props.tooltipProps;
    var badge = (React.createElement(Pill, { className: css(className, "bolt-tab-badge"), containsCount: containsCount, size: PillSize.compact, contentClassName: "text-ellipsis", excludeFocusZone: true, excludeTabStop: true }, children));
    if (tooltipProps) {
        badge = React.createElement(Tooltip, __assign({}, tooltipProps), badge);
    }
    return badge;
};
