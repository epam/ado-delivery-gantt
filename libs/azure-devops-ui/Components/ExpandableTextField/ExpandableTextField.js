import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ExpandableTextField.css";
import * as React from "react";
import { Expandable } from '../../Expandable';
import { FocusWithin } from '../../FocusWithin';
import { IconSize } from '../../Icon';
import { TextField } from '../../TextField';
import { css, KeyCode } from '../../Util';
import { Location } from '../../Utilities/Position';
var textFieldId = 1;
var ExpandableTextField = /** @class */ (function (_super) {
    __extends(ExpandableTextField, _super);
    function ExpandableTextField(props) {
        var _this = _super.call(this, props) || this;
        _this.textFieldElement = React.createRef();
        _this.expandable = React.createRef();
        _this.collapse = function () {
            if (_this.expandable.current) {
                _this.expandable.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.expandable.current) {
                _this.expandable.current.expand();
            }
        };
        _this.renderCallout = function () {
            return _this.props.renderCallout(_this, _this.dropdownId, _this.props.anchorElement
                ? _this.props.anchorElement
                : !_this.props.anchorPoint
                    ? _this.containerElement.current
                        ? _this.containerElement.current
                        : undefined
                    : undefined, _this.props.anchorOffset || { horizontal: 0, vertical: 0 }, _this.props.anchorOrigin || { horizontal: Location.end, vertical: Location.end }, _this.props.anchorPoint, _this.props.dropdownOrigin || { horizontal: Location.end, vertical: Location.start });
        };
        _this.dropdownId = props.dropdownId || "dropdown-" + textFieldId++;
        _this.containerElement = props.containerRef || React.createRef();
        return _this;
    }
    ExpandableTextField.prototype.render = function () {
        var _this = this;
        return (React.createElement(Expandable, { disabled: this.props.disabled, expandKey: this.props.expandKey, onCollapse: this.props.onCollapse, onExpand: this.props.onExpand, renderCallout: this.renderCallout, ref: this.expandable }, function (expandableProps) {
            return (React.createElement(FocusWithin, { onFocus: _this.props.onFocus, onBlur: _this.props.onBlur }, function (focusStatus) { return (React.createElement("div", { className: css(_this.props.className, "bolt-expandable-textfield"), onBlur: function () {
                    if (_this.props.blurDismiss) {
                        _this.collapse();
                    }
                    focusStatus.onBlur && focusStatus.onBlur();
                }, onFocus: function (event) {
                    focusStatus.onFocus && focusStatus.onFocus(event);
                    // If the top-level component recieves focus, set focus to the text field.
                    if (event.target === _this.containerElement.current) {
                        _this.focus();
                    }
                }, onMouseDown: expandableProps.onMouseDown, onKeyDown: expandableProps.onKeyDown, ref: _this.containerElement, tabIndex: -1 },
                React.createElement(TextField, __assign({ ariaHasPopup: "dialog" }, _this.props, { ariaActiveDescendant: expandableProps.expanded ? _this.props.ariaActiveDescendant : undefined, role: _this.props.editable ? "combobox" : undefined, ariaExpanded: expandableProps.expanded, ariaControls: expandableProps.expanded ? _this.dropdownId : undefined, className: "", onClick: expandableProps.onClick, ref: _this.textFieldElement, suffixIconProps: !_this.props.hideDropdownIcon
                        ? {
                            key: "dropdown-icon",
                            className: css("bolt-expandable-textfield-icon icon-right", _this.props.disabled && "disabled"),
                            iconName: "ChevronDownMed",
                            onClick: expandableProps.onClick,
                            size: IconSize.small
                        }
                        : undefined })))); }));
        }));
    };
    ExpandableTextField.prototype.focus = function () {
        if (this.textFieldElement.current) {
            this.textFieldElement.current.focus();
        }
    };
    ExpandableTextField.prototype.select = function () {
        if (this.textFieldElement.current) {
            this.textFieldElement.current.select();
        }
    };
    ExpandableTextField.defaultProps = {
        expandKey: [KeyCode.downArrow, KeyCode.enter]
    };
    return ExpandableTextField;
}(React.Component));
export { ExpandableTextField };
