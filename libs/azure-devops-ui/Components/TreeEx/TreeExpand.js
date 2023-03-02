import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tree.css";
import "./TreeExpand.css";
import * as React from "react";
import { Icon, IconSize } from '../../Icon';
import { css } from '../../Util';
var defaultCollapsedProps = { iconName: "ChevronRightMed" };
var defaultExpandedProps = { iconName: "ChevronDownMed" };
var TreeExpand = /** @class */ (function (_super) {
    __extends(TreeExpand, _super);
    function TreeExpand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClick = function (event) {
            var _a, _b;
            if (!event.defaultPrevented) {
                // Only toggle on a lone left button, not when mixed with others.
                // IPhone doesnt pass buttons so we will take 0 as a click.
                if (event.buttons === 1 || event.buttons === 0) {
                    if (_this.props.onToggle) {
                        _this.props.onToggle(event);
                        event.preventDefault();
                    }
                }
            }
            (_b = (_a = _this.props).onClick) === null || _b === void 0 ? void 0 : _b.call(_a, event);
        };
        return _this;
    }
    TreeExpand.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, depth = _a.depth, expanded = _a.expanded, _b = _a.iconCollapsedProps, iconCollapsedProps = _b === void 0 ? defaultCollapsedProps : _b, _c = _a.iconExpandedProps, iconExpandedProps = _c === void 0 ? defaultExpandedProps : _c, _d = _a.indentationSize, indentationSize = _d === void 0 ? 16 : _d;
        var iconProps = expanded ? iconExpandedProps : iconCollapsedProps;
        return (React.createElement(React.Fragment, null,
            React.createElement(Icon, __assign({}, iconProps, { className: css(className, "bolt-tree-expand-button font-size cursor-pointer", !this.props.onToggle && "invisible"), onClick: this.onClick, role: "presentation", size: IconSize.small, style: { marginLeft: depth > 0 ? depth * indentationSize + "px" : undefined } })),
            children));
    };
    return TreeExpand;
}(React.Component));
export { TreeExpand };
