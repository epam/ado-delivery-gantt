import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./RadioButton.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZone, FocusZoneContext, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { FormItem, FormItemContext } from '../../FormItem';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, isArrowKey, noop } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
import { RadioButtonGroupDirection } from "./RadioButton.Props";
export var RadioButtonGroupContext = React.createContext({
    onSelect: noop,
    registerId: noop
});
var RadioButtonGroup = /** @class */ (function (_super) {
    __extends(RadioButtonGroup, _super);
    function RadioButtonGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.focusGroupContext = React.createRef();
        _this.idMap = {};
        _this.onChange = function (buttonId) {
            if (_this.props.onSelect) {
                _this.props.onSelect(buttonId);
            }
        };
        _this.getFirstButtonId = function () {
            var children = React.Children.toArray(_this.props.children);
            if (children.length) {
                var firstChild = children[0];
                return firstChild.props.id;
            }
            return undefined;
        };
        _this.postProcessKeystroke = function (event) {
            if (document.activeElement && isArrowKey(event)) {
                var id = _this.idMap[document.activeElement.id];
                if (id && id !== ObservableLike.getValue(_this.props.selectedButtonId || "") && _this.props.onSelect) {
                    _this.props.onSelect(id);
                }
            }
            return FocusZoneKeyStroke.IgnoreNone;
        };
        _this.registerId = function (safeId, id) {
            _this.idMap[safeId] = id;
        };
        return _this;
    }
    RadioButtonGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, defaultButtonId = _a.defaultButtonId, direction = _a.direction, excludeFocusZone = _a.excludeFocusZone, id = _a.id, selectedButtonId = _a.selectedButtonId, text = _a.text;
        var groupClassName = css("bolt-radio-button-group", direction === RadioButtonGroupDirection.Vertical ? "flex-column" : "flex-row", this.props.groupClassName);
        return (React.createElement(Observer, { selectedButtonId: selectedButtonId }, function (props) { return (React.createElement(RadioButtonGroupContext.Provider, { value: {
                onSelect: _this.onChange,
                registerId: _this.registerId,
                selectedButtonId: props.selectedButtonId || _this.getFirstButtonId()
            } },
            React.createElement(FormItem, { className: css(className, "bolt-radio-button-group-container", excludeFocusZone && groupClassName), label: text }, excludeFocusZone ? (_this.props.children) : (React.createElement(FormItemContext.Consumer, null, function (formItemContext) { return (React.createElement(FocusZone, { direction: direction === RadioButtonGroupDirection.Vertical
                    ? FocusZoneDirection.Vertical
                    : FocusZoneDirection.Horizontal, circularNavigation: true, focusGroupProps: {
                    defaultElementId: defaultButtonId || props.selectedButtonId || _this.getFirstButtonId(),
                    ref: _this.focusGroupContext
                }, postprocessKeyStroke: _this.postProcessKeystroke },
                React.createElement("div", { "aria-labelledby": getSafeId(formItemContext.ariaLabelledById), className: groupClassName, role: "radiogroup", id: getSafeId(id) }, _this.props.children))); }))))); }));
    };
    RadioButtonGroup.prototype.focus = function () {
        if (this.focusGroupContext.current) {
            this.focusGroupContext.current.focus();
        }
    };
    RadioButtonGroup.defaultProps = {
        direction: RadioButtonGroupDirection.Vertical
    };
    return RadioButtonGroup;
}(React.Component));
export { RadioButtonGroup };
var RadioButton = /** @class */ (function (_super) {
    __extends(RadioButton, _super);
    function RadioButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radioButtonInternal = React.createRef();
        return _this;
    }
    RadioButton.prototype.render = function () {
        var _this = this;
        return (React.createElement(RadioButtonGroupContext.Consumer, null, function (groupContext) { return (React.createElement(FocusGroupContext.Consumer, null, function (focusGroupContext) { return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
            return (React.createElement(RadioButtonInternal, __assign({}, _this.props, { focusGroupContext: focusGroupContext, focuszoneId: zoneContext.focuszoneId, onFocus: focusGroupContext.onFocus, onSelect: groupContext.onSelect, registerId: groupContext.registerId, selectedButton: groupContext.selectedButtonId === _this.props.id, ref: _this.radioButtonInternal })));
        })); })); }));
    };
    RadioButton.prototype.focus = function () {
        if (this.radioButtonInternal.current) {
            this.radioButtonInternal.current.focus();
        }
    };
    return RadioButton;
}(React.Component));
export { RadioButton };
var RadioButtonInternal = /** @class */ (function (_super) {
    __extends(RadioButtonInternal, _super);
    function RadioButtonInternal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radioButton = React.createRef();
        _this.onClick = function (event) {
            if (!event.defaultPrevented) {
                if (!_this.props.disabled) {
                    _this.props.onSelect(_this.props.id);
                    event.preventDefault();
                }
            }
        };
        _this.onFocus = function (event) {
            _this.props.onFocus(_this.props.id);
        };
        return _this;
    }
    RadioButtonInternal.prototype.render = function () {
        var tabIndex = getTabIndex(this.props, this.props.focusGroupContext);
        var labelId = this.props.text && "rb-label-" + this.props.id;
        var radio = (React.createElement("div", { "aria-checked": this.props.selectedButton, "aria-disabled": this.props.disabled, "aria-labelledby": getSafeId(this.props.ariaLabelledBy || labelId), "aria-describedby": getSafeId(this.props.ariaDescribedBy), className: css(this.props.className, "bolt-radio-button cursor-pointer", this.props.disabled ? "disabled" : "enabled", this.props.selectedButton && "checked", (this.props.text || React.Children.count(this.props.children) > 0) && "labelled", "bolt-focus-treatment"), "data-focuszone": !this.props.disabled && !this.props.excludeFocusZone ? this.props.focuszoneId : undefined, "data-is-focusable": !this.props.disabled ? "true" : "false", id: getSafeId(this.props.id), key: this.props.id, onClick: this.onClick, onFocus: this.onFocus, ref: this.radioButton, role: this.props.role || "radio", tabIndex: tabIndex },
            React.createElement("div", { className: "bolt-radio-button-icon" },
                React.createElement("div", { className: "bolt-radio-button-bullet" })),
            this.props.text && (React.createElement("div", { className: "bolt-radio-button-label", id: getSafeId(labelId) }, this.props.text)),
            this.props.children));
        if (this.props.tooltipProps) {
            radio = React.createElement(Tooltip, __assign({}, this.props.tooltipProps), radio);
        }
        return radio;
    };
    RadioButtonInternal.prototype.componentDidMount = function () {
        var _a = this.props, id = _a.id, registerId = _a.registerId;
        registerId(getSafeId(id), id);
    };
    RadioButtonInternal.prototype.focus = function () {
        if (this.radioButton.current) {
            this.radioButton.current.focus();
        }
    };
    return RadioButtonInternal;
}(React.Component));
