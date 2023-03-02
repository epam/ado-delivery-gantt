import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TextField.css";
import * as React from "react";
import { FocusWithin } from '../../FocusWithin';
import { FocusZoneContext } from '../../FocusZone';
import { FormItemContext } from '../../FormItem';
import { Icon, IconSize } from '../../Icon';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
import { TextFieldFocusTreatmentBehavior, TextFieldStyle, TextFieldWidth } from "./TextField.Props";
var inputId = 1;
var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField(props) {
        var _this = _super.call(this, props) || this;
        _this.select = function () {
            if (_this.inputElement.current) {
                _this.inputElement.current.select();
            }
        };
        _this.inputId = "textfield-input-" + inputId++;
        _this.inputElement = props.inputElement || React.createRef();
        return _this;
    }
    TextField.prototype.focus = function () {
        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }
    };
    Object.defineProperty(TextField.prototype, "selectionEnd", {
        get: function () {
            return this.inputElement.current ? this.inputElement.current.selectionEnd : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "selectionStart", {
        get: function () {
            return this.inputElement.current ? this.inputElement.current.selectionStart : null;
        },
        enumerable: false,
        configurable: true
    });
    TextField.prototype.setSelectionRange = function (start, end, direction) {
        if (this.inputElement.current) {
            this.inputElement.current.setSelectionRange(start, end, direction);
        }
    };
    TextField.prototype.render = function () {
        var _this = this;
        var _a = this.props, autoAdjustHeight = _a.autoAdjustHeight, className = _a.className, containerClassName = _a.containerClassName, disabled = _a.disabled, _b = _a.focusTreatment, focusTreatment = _b === void 0 ? TextFieldFocusTreatmentBehavior.all : _b, inputId = _a.inputId, label = _a.label, onBlur = _a.onBlur, onFocus = _a.onFocus, style = _a.style, value = _a.value, width = _a.width;
        var input = (React.createElement(FocusWithin, { onFocus: onFocus, onBlur: onBlur }, function (focusStatus) { return (React.createElement(FormItemContext.Consumer, null, function (formItemContext) {
            return (React.createElement("div", { className: css("flex-column", containerClassName, width !== TextFieldWidth.auto && width) },
                React.createElement("div", { className: css(!label && className, "bolt-textfield flex-row flex-center", disabled && "disabled", focusTreatment === TextFieldFocusTreatmentBehavior.all && "focus-treatment", focusTreatment === TextFieldFocusTreatmentBehavior.keyboardOnly && "focus-keyboard-only", focusStatus.hasFocus && "focused", style === TextFieldStyle.inline && "bolt-textfield-inline", formItemContext.error && "bolt-textfield-error") },
                    React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement(Observer, { value: value }, function (observedProps) {
                        return (React.createElement(TextFieldInnerValue, __assign({}, _this.props, { focus: function () { return _this.focus(); }, focusStatus: focusStatus, formItemContext: formItemContext, inputElement: _this.inputElement, inputId: _this.props.inputId || _this.inputId, value: observedProps.value, zoneContext: zoneContext })));
                    })); }))));
        })); }));
        if (label) {
            return (React.createElement("div", { className: css(className, "flex-column") },
                React.createElement("label", { htmlFor: getSafeId(inputId || this.inputId), className: "bolt-textfield-label" }, label),
                input));
        }
        else {
            return input;
        }
    };
    return TextField;
}(React.Component));
export { TextField };
var TextFieldInnerValue = /** @class */ (function (_super) {
    __extends(TextFieldInnerValue, _super);
    function TextFieldInnerValue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.adjustedHeight = -1;
        _this.adjustedHeightValue = "";
        _this.hiddenElement = React.createRef();
        return _this;
    }
    TextFieldInnerValue.prototype.render = function () {
        var _this = this;
        var _a = this.props, activatable = _a.activatable, ariaActiveDescendant = _a.ariaActiveDescendant, ariaAutoComplete = _a.ariaAutoComplete, ariaControls = _a.ariaControls, ariaExpanded = _a.ariaExpanded, ariaHasPopup = _a.ariaHasPopup, ariaInvalid = _a.ariaInvalid, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, ariaRoleDescription = _a.ariaRoleDescription, autoAdjustHeight = _a.autoAdjustHeight, autoComplete = _a.autoComplete, autoFocus = _a.autoFocus, autoSelect = _a.autoSelect, disabled = _a.disabled, excludeFocusZone = _a.excludeFocusZone, focus = _a.focus, focusStatus = _a.focusStatus, formItemContext = _a.formItemContext, inputClassName = _a.inputClassName, inputElement = _a.inputElement, inputId = _a.inputId, inputType = _a.inputType, maxLength = _a.maxLength, maxWidth = _a.maxWidth, multiline = _a.multiline, onClick = _a.onClick, onKeyDown = _a.onKeyDown, onKeyPress = _a.onKeyPress, onKeyUp = _a.onKeyUp, onPaste = _a.onPaste, placeholder = _a.placeholder, prefixIconProps = _a.prefixIconProps, readOnly = _a.readOnly, required = _a.required, resizable = _a.resizable, role = _a.role, rows = _a.rows, spellCheck = _a.spellCheck, tooltipProps = _a.tooltipProps, value = _a.value, zoneContext = _a.zoneContext;
        var _b = this.props, ariaDescribedBy = _b.ariaDescribedBy, suffixIconProps = _b.suffixIconProps;
        var TagName = multiline ? "textarea" : "input";
        var tagSpecificProps = multiline ? { rows: rows } : { type: inputType, autoComplete: autoComplete ? "on" : "off" };
        if (suffixIconProps === undefined && formItemContext.error) {
            suffixIconProps = {
                className: "bolt-textfield-message-error",
                iconName: "Error"
            };
        }
        if (ariaDescribedBy === undefined) {
            ariaDescribedBy = formItemContext.ariaDescribedById;
        }
        var className = css(inputClassName, "bolt-textfield-input flex-grow", autoAdjustHeight && "bolt-textfield-auto-adjust", resizable && "bolt-textfield-auto-unresizable", prefixIconProps && "bolt-textfield-input-with-prefix", suffixIconProps && "bolt-textfield-input-with-suffix", activatable && "activatable");
        var style = maxWidth !== undefined ? { maxWidth: maxWidth } : {};
        var element = (React.createElement(TagName, __assign({}, tagSpecificProps, { "aria-activedescendant": getSafeId(ariaActiveDescendant), "aria-autocomplete": ariaAutoComplete, "aria-controls": getSafeId(ariaControls), "aria-describedby": getSafeId(ariaDescribedBy), "aria-disabled": disabled, "aria-expanded": ariaExpanded, "aria-haspopup": ariaHasPopup, "aria-invalid": ariaInvalid, "aria-label": ariaLabel === undefined && placeholder ? placeholder : ariaLabel, "aria-labelledby": getSafeId(ariaLabelledBy) || getSafeId(formItemContext.ariaLabelledById), "aria-readonly": inputType && inputType !== "text" ? readOnly : undefined, "aria-required": required, "aria-roledescription": ariaRoleDescription, autoFocus: autoFocus, "data-focuszone": !disabled && !excludeFocusZone ? zoneContext.focuszoneId : undefined, disabled: disabled, className: className, id: getSafeId(inputId), maxLength: maxLength, onBlur: focusStatus.onBlur, onClick: onClick, onChange: function (e) {
                _this.props.onChange && _this.props.onChange(e, e.target.value);
                // Adjust height synchronously. If we wait until the React update effect, then
                // the text area has already been painted in a partially-scrolled state which
                // causes some ugly flickering.
                _this.adjustHeight();
            }, onFocus: function (event) {
                if (autoSelect && inputElement.current) {
                    inputElement.current.select();
                }
                focusStatus.onFocus && focusStatus.onFocus(event);
            }, onKeyDown: onKeyDown, onKeyPress: onKeyPress, onKeyUp: onKeyUp, onPaste: onPaste, placeholder: placeholder, readOnly: readOnly, required: required, ref: inputElement, role: role, style: style, spellCheck: spellCheck, tabIndex: getTabIndex(this.props), value: value || "" })));
        // We will use a hidden element behind the input to measure the height.
        // This prevents the page from performing re-layout when measuring.
        if (multiline && autoAdjustHeight) {
            element = (React.createElement("div", { className: "flex-row flex-grow relative" },
                React.createElement(TagName, { "aria-hidden": true, className: css("bolt-textfield-auto-adjust-hidden", className), ref: this.hiddenElement, role: "presentation" }),
                element));
        }
        return (React.createElement(React.Fragment, null,
            prefixIconProps &&
                Icon(__assign(__assign({ size: IconSize.medium }, prefixIconProps), { className: css(prefixIconProps.className, "prefix", !prefixIconProps.render && "bolt-textfield-icon", ((placeholder && !value) || prefixIconProps.render) && "bolt-textfield-no-text"), onClick: function (e) {
                        prefixIconProps && prefixIconProps.onClick && prefixIconProps.onClick(e);
                        focus();
                    } })),
            tooltipProps ? React.createElement(Tooltip, __assign({}, tooltipProps), element) : element,
            suffixIconProps &&
                Icon(__assign(__assign({ size: IconSize.medium }, suffixIconProps), { className: css(suffixIconProps.className, "suffix", !suffixIconProps.render && "bolt-textfield-icon", ((placeholder && !value) || suffixIconProps.render) && "bolt-textfield-no-text", suffixIconProps.onClick && "cursor-pointer"), onClick: function (e) {
                        suffixIconProps && suffixIconProps.onClick && suffixIconProps.onClick(e);
                        focus();
                    } }))));
    };
    TextFieldInnerValue.prototype.componentDidMount = function () {
        this.adjustHeight();
    };
    TextFieldInnerValue.prototype.componentDidUpdate = function () {
        this.adjustHeight();
    };
    TextFieldInnerValue.prototype.adjustHeight = function () {
        var hiddenElement = this.hiddenElement;
        var _a = this.props, autoAdjustHeight = _a.autoAdjustHeight, inputElement = _a.inputElement, multiline = _a.multiline, value = _a.value;
        // If this is a multi-line, auto-adjust text area, adjust the height based on the current content
        if (multiline && autoAdjustHeight && inputElement.current && hiddenElement.current && value !== this.adjustedHeightValue) {
            hiddenElement.current.value = inputElement.current.value;
            if (this.adjustedHeight !== hiddenElement.current.scrollHeight) {
                this.adjustedHeight = hiddenElement.current.scrollHeight;
                this.adjustedHeightValue = inputElement.current.value;
                inputElement.current.style.height = this.adjustedHeight + "px";
            }
        }
    };
    return TextFieldInnerValue;
}(React.Component));
