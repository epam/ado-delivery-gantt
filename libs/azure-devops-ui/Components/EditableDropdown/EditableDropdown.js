import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./EditableDropdown.css";
import * as React from "react";
import { ObservableLike, ObservableValue } from '../../Core/Observable';
import { CustomEditableDropdown } from "./CustomEditableDropdown";
var EditableDropdown = /** @class */ (function (_super) {
    __extends(EditableDropdown, _super);
    function EditableDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.dropdown = React.createRef();
        _this.collapse = function () {
            if (_this.dropdown.current) {
                _this.dropdown.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.dropdown.current) {
                _this.dropdown.current.expand();
            }
        };
        _this.onExpand = function () {
            var _a = _this.props, allowTextSelection = _a.allowTextSelection, onExpand = _a.onExpand;
            if (onExpand) {
                onExpand();
            }
            if (allowTextSelection) {
                _this.text.value = _this.selectedText.value;
            }
        };
        _this.onTextChange = function (event, value) {
            if (_this.props.onTextChange) {
                _this.props.onTextChange(event, value);
            }
            _this.text.value = value;
        };
        _this.onValueChange = function (value) {
            if (_this.props.onValueChange) {
                _this.props.onValueChange(value);
            }
            _this.selectedText.value = (value && value.text) || "";
        };
        _this.text = ObservableLike.isObservable(props.text)
            ? props.text
            : new ObservableValue(props.text || "");
        _this.selectedText = ObservableLike.isObservable(props.selectedText)
            ? props.selectedText
            : new ObservableValue(props.selectedText);
        return _this;
    }
    EditableDropdown.prototype.focus = function () {
        if (this.dropdown.current) {
            this.dropdown.current.focus();
        }
    };
    EditableDropdown.prototype.render = function () {
        return (React.createElement(CustomEditableDropdown, __assign({}, this.props, { onExpand: this.onExpand, onTextChange: this.onTextChange, onValueChange: this.onValueChange, ref: this.dropdown, selectedText: this.selectedText, text: this.text })));
    };
    return EditableDropdown;
}(React.Component));
export { EditableDropdown };
