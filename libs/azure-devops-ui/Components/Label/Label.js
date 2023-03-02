import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Label.css";
import * as React from "react";
import { css, getSafeId } from '../../Util';
import { Tooltip } from '../../TooltipEx';
import { getColorString, isDark } from '../../Utilities/Color';
import { FocusWithin } from '../../FocusWithin';
import { FocusZoneContext } from '../../FocusZone';
import { Observer } from '../../Observer';
import { getTabIndex } from '../../Utilities/Focus';
import { FocusGroupContext } from '../../FocusGroup';
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(props) {
        var _this = _super.call(this, props) || this;
        _this.rootRef = React.createRef();
        _this.onBlur = function () {
            _this.props.onBlur && _this.props.onBlur();
        };
        _this.onFocus = function (event) {
            _this.props.onFocus && _this.props.onFocus(event);
            _this.context && _this.props.id && _this.context.onFocus(_this.props.id);
        };
        _this.onHoverStart = function () {
            _this.setState({
                isHovered: true
            });
        };
        _this.onHoverEnd = function () {
            _this.setState({
                isHovered: false
            });
        };
        _this.state = {
            isHovered: false
        };
        return _this;
    }
    Label.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, content = _a.content, color = _a.color, _b = _a.enableHover, enableHover = _b === void 0 ? false : _b, excludeFocusZone = _a.excludeFocusZone, id = _a.id, selected = _a.selected, onClick = _a.onClick, onKeyDown = _a.onKeyDown, onMouseDown = _a.onMouseDown;
        var isHovered = this.state.isHovered;
        var renderColor = color && isHovered && enableHover ? createHoverColor(color) : color;
        var labelObject = (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement(FocusWithin, { onBlur: _this.onBlur, onFocus: _this.onFocus }, function (focusStatus) {
            return (React.createElement(Observer, { selected: selected }, function (observerProps) { return (React.createElement("div", { className: css(className, "bolt-label", observerProps.selected && "selected", color && (_this.isDark(color, observerProps.selected) ? "dark" : "light")), "data-focuszone": !excludeFocusZone && zoneContext.focuszoneId, id: getSafeId(id), onBlur: _this.onBlur, onClick: onClick, onFocus: _this.onFocus, onKeyDown: onKeyDown, onMouseDown: onMouseDown, onMouseEnter: _this.onHoverStart, onMouseLeave: _this.onHoverEnd, ref: _this.rootRef, style: _this.getStyle(renderColor, observerProps.selected, focusStatus.hasFocus), tabIndex: getTabIndex(_this.props, _this.context) },
                React.createElement(Tooltip, { overflowOnly: true },
                    React.createElement("div", { className: "bolt-label-content text-ellipsis" }, content)))); }));
        })); }));
        return labelObject;
    };
    Label.prototype.focus = function () {
        this.rootRef.current && this.rootRef.current.focus();
    };
    Label.prototype.getStyle = function (color, isSelected, hasFocus) {
        if (isSelected || hasFocus || !color) {
            return undefined;
        }
        return { backgroundColor: getColorString(color) };
    };
    Label.prototype.isDark = function (color, isSelected) {
        if (isSelected || !color) {
            return false;
        }
        return isDark(color);
    };
    Label.DEFAULT_COLOR = { red: 240, blue: 240, green: 240 };
    Label.contextType = FocusGroupContext;
    return Label;
}(React.Component));
export { Label };
function createHoverColor(baseColor) {
    var darkenFactor = 0.06;
    var darkenMultiplier = 1 - darkenFactor;
    return {
        red: baseColor.red * darkenMultiplier,
        green: baseColor.green * darkenMultiplier,
        blue: baseColor.blue * darkenMultiplier
    };
}
