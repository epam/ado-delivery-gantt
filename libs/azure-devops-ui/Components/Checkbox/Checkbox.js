import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Checkbox.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { Icon, IconSize } from '../../Icon';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, KeyCode } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
var checkboxId = 1;
var TriStateCheckbox = /** @class */ (function (_super) {
    __extends(TriStateCheckbox, _super);
    function TriStateCheckbox(props) {
        var _this = _super.call(this, props) || this;
        _this.checkboxElement = React.createRef();
        _this.animationClassName = "";
        _this.onClick = function (event) {
            _this.focus();
            _this.onChange(event);
        };
        _this.onFocus = function () {
            var id = _this.props.id;
            if (id) {
                _this.context.onFocus(id);
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented && !_this.props.disabled) {
                if (event.which === KeyCode.space) {
                    _this.onChange(event);
                    event.preventDefault();
                }
            }
        };
        _this.onChange = function (event) {
            if (_this.props.onChange) {
                var checked = ObservableLike.getValue(_this.props.checked);
                // Unchecked transitions to Checked.
                // Checked transitions to TriState or Unchecked.
                // Indeterminate transitions to Unchecked.
                if (checked === false) {
                    checked = true;
                }
                else if (checked === true) {
                    if (_this.props.triState) {
                        checked = undefined;
                    }
                    else {
                        checked = false;
                    }
                }
                else {
                    checked = false;
                }
                _this.props.onChange(event, checked);
            }
        };
        _this.labelId = "checkbox-" + checkboxId++ + "-label";
        return _this;
    }
    TriStateCheckbox.prototype.render = function () {
        var _this = this;
        var _a = this.props, disabled = _a.disabled, label = _a.label, labelId = _a.labelId, tooltipProps = _a.tooltipProps;
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement(Observer, { checked: _this.props.checked }, function (props) {
            var ariaChecked;
            if (_this.props.role !== "presentation") {
                ariaChecked = props.checked === undefined ? "mixed" : props.checked ? "true" : "false";
            }
            var checkbox = (React.createElement("div", { "aria-checked": ariaChecked, "aria-describedby": getSafeId(_this.props.ariaDescribedBy), "aria-disabled": _this.props.disabled, "aria-label": _this.props.ariaLabel, "aria-labelledby": !_this.props.ariaLabel ? getSafeId(_this.props.ariaLabelledBy) : undefined, className: css(_this.props.className, "bolt-checkbox cursor-pointer", props.checked !== false && "checked", disabled ? "disabled" : "enabled", "bolt-focus-treatment", label && "labelled"), "data-focuszone": !disabled && css(_this.props.focuszoneId, !_this.props.excludeFocusZone ? zoneContext.focuszoneId : undefined), id: getSafeId(_this.props.id), onClick: !disabled ? _this.onClick : undefined, onFocus: _this.onFocus, onKeyDown: _this.onKeyDown, ref: _this.checkboxElement, role: _this.props.role || "checkbox", tabIndex: getTabIndex(_this.props, _this.context) },
                React.createElement("div", { className: "bolt-checkmark justify-center flex-row flex-noshrink scroll-hidden" }, Icon({
                    className: _this.animationClassName,
                    iconName: props.checked === undefined ? "SkypeMinus" : "CheckMark",
                    size: IconSize.small
                })),
                label && (React.createElement("div", { className: "bolt-checkbox-label", id: getSafeId(labelId || _this.labelId) }, label)),
                _this.props.children));
            if (tooltipProps) {
                checkbox = (React.createElement(Tooltip, __assign({ addAriaDescribedBy: true }, tooltipProps), checkbox));
            }
            return checkbox;
        })); }));
    };
    TriStateCheckbox.prototype.componentDidMount = function () {
        this.animationClassName = "animation-ready";
    };
    TriStateCheckbox.prototype.focus = function () {
        if (this.checkboxElement.current) {
            this.checkboxElement.current.focus();
        }
    };
    TriStateCheckbox.contextType = FocusGroupContext;
    return TriStateCheckbox;
}(React.Component));
export { TriStateCheckbox };
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Checkbox.defaultProps = {
        checked: false
    };
    return Checkbox;
}(TriStateCheckbox));
export { Checkbox };
