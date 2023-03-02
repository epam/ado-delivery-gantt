import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { Button } from '../../Button';
import { FilterBarItem } from '../../FilterBarItem';
import * as Resources from '../../Resources.Input';
import { TextField, TextFieldFocusTreatmentBehavior } from '../../TextField';
import { css, KeyCode } from '../../Util';
var DEFAULT_MAX_TEXT_LENGTH = 200;
var DEFAULT_THROTTLE_WAIT = 200;
var TextFilterBarItem = /** @class */ (function (_super) {
    __extends(TextFilterBarItem, _super);
    function TextFilterBarItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textField = React.createRef();
        _this.onClickClearButton = function (event) {
            _this.setFilterValue({ value: "" });
            if (_this.textField.current) {
                _this.textField.current.focus();
            }
        };
        _this.onTextChanged = function (ev, text) {
            _this.setFilterValue({ value: text });
        };
        _this.onKeyDown = function (ev) {
            if (_this.props.filter) {
                switch (ev.which) {
                    case KeyCode.enter:
                        _this.props.filter.setFilterItemState(_this.props.filterItemKey, { value: _this.state.value });
                        _this.props.filter.applyChanges();
                        break;
                    case KeyCode.escape:
                        _this.setFilterValue({ value: "" });
                        _this.setState({
                            value: ""
                        });
                        _this.props.filter.applyChanges();
                        break;
                    default:
                        return;
                }
                // We only get here if the keypress has been handled.
                ev.preventDefault();
                ev.stopPropagation();
            }
        };
        return _this;
    }
    TextFilterBarItem.prototype.focus = function () {
        if (this.textField.current) {
            return this.textField.current.focus();
        }
    };
    TextFilterBarItem.prototype.render = function () {
        var _this = this;
        var value = this.state.value;
        var _a = this.props, className = _a.className, clearable = _a.clearable, placeholder = _a.placeholder, maxTextLength = _a.maxTextLength, inputClassName = _a.inputClassName, style = _a.style, width = _a.width;
        var tooltipProps = {
            text: value || placeholder,
            overflowOnly: true,
            overflowDetected: this.overflowDetected
        };
        var clearButtonIconProps = undefined;
        if (clearable && value) {
            clearButtonIconProps = {
                render: function (className) {
                    return (React.createElement(Button, { ariaLabel: Resources.ClearFilter, className: css(className, "bolt-text-filterbaritem-clear"), iconProps: { iconName: "Cancel" }, onClick: _this.onClickClearButton }));
                }
            };
        }
        return (React.createElement(TextField, __assign({ ariaLabel: placeholder, className: css(className, "bolt-text-filterbaritem flex-grow"), containerClassName: "flex-grow", inputClassName: css(inputClassName, "bolt-text-filterbaritem-input"), inputType: "text", focusTreatment: TextFieldFocusTreatmentBehavior.keyboardOnly, maxLength: maxTextLength || DEFAULT_MAX_TEXT_LENGTH, onChange: this.onTextChanged, onKeyDown: this.onKeyDown, placeholder: placeholder, ref: this.textField, style: style, suffixIconProps: clearButtonIconProps, value: value || "", width: width, tooltipProps: tooltipProps }, this.getExtraTextFieldProps())));
    };
    TextFilterBarItem.prototype.overflowDetected = function (anchorElement) {
        var isOverflowed = true;
        if (anchorElement.value && anchorElement.value.length > 0) {
            isOverflowed = anchorElement.scrollWidth > anchorElement.clientWidth;
        }
        else {
            var placeholderText = anchorElement.getAttribute("placeholder");
            anchorElement.value = placeholderText ? placeholderText : "";
            isOverflowed = anchorElement.scrollWidth > anchorElement.clientWidth;
            anchorElement.value = "";
        }
        return isOverflowed;
    };
    TextFilterBarItem.prototype.getExtraTextFieldProps = function () {
        return null;
    };
    TextFilterBarItem.prototype.getThrottleWait = function () {
        var throttleWait = this.props.throttleWait;
        return throttleWait === undefined ? DEFAULT_THROTTLE_WAIT : throttleWait;
    };
    TextFilterBarItem.defaultProps = {
        isTextItem: true
    };
    return TextFilterBarItem;
}(FilterBarItem));
export { TextFilterBarItem };
