import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Toggle.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, KeyCode } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
var toggleId = 1;
var Toggle = /** @class */ (function (_super) {
    __extends(Toggle, _super);
    function Toggle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggleElement = React.createRef();
        _this.labelId = "toggle-" + toggleId++ + "-label";
        _this.onClick = function (event) {
            if (_this.props.onChange && !_this.props.disabled) {
                _this.props.onChange(event, _this.props.checked === undefined ? false : !ObservableLike.getValue(_this.props.checked));
            }
        };
        _this.onFocus = function () {
            if (_this.props.id) {
                _this.context.onFocus(_this.props.id);
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.space) {
                    _this.onClick(event);
                    event.preventDefault();
                }
            }
        };
        return _this;
    }
    Toggle.prototype.render = function () {
        var _this = this;
        var _a = this.props, onAriaLabel = _a.onAriaLabel, offAriaLabel = _a.offAriaLabel, className = _a.className, disabled = _a.disabled, excludeFocusZone = _a.excludeFocusZone, id = _a.id, offText = _a.offText, onText = _a.onText, role = _a.role, text = _a.text, tooltipProps = _a.tooltipProps;
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement(Observer, { checked: _this.props.checked }, function (props) {
            var ariaLabel = props.checked ? onAriaLabel || _this.props.ariaLabel : offAriaLabel || _this.props.ariaLabel;
            var labelId = getSafeId(_this.labelId);
            var toggle = (React.createElement("div", { className: css(className, "bolt-toggle-button cursor-pointer", props.checked && "checked", disabled ? "disabled" : "enabled"), onClick: _this.onClick, onFocus: _this.onFocus, onKeyDown: _this.onKeyDown },
                React.createElement("div", { "aria-checked": props.checked, "aria-disabled": disabled, "aria-label": ariaLabel, "aria-labelledby": !ariaLabel ? labelId : undefined, className: "bolt-toggle-button-pill bolt-focus-treatment flex-noshrink", "data-focuszone": !disabled && !excludeFocusZone ? zoneContext.focuszoneId : undefined, "data-is-focusable": true, id: getSafeId(id), ref: _this.toggleElement, role: role || "switch", tabIndex: getTabIndex(_this.props, _this.context) },
                    React.createElement("div", { className: "bolt-toggle-button-icon" })),
                React.createElement("div", { className: "bolt-toggle-button-text body-m", id: labelId }, props.checked ? onText || text : offText || text)));
            if (tooltipProps) {
                toggle = React.createElement(Tooltip, __assign({}, tooltipProps), toggle);
            }
            return toggle;
        })); }));
    };
    Toggle.prototype.focus = function () {
        if (this.toggleElement.current) {
            this.toggleElement.current.focus();
        }
    };
    Toggle.contextType = FocusGroupContext;
    return Toggle;
}(React.Component));
export { Toggle };
