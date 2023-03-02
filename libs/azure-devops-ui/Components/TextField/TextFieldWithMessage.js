import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TextField.css";
import * as React from "react";
import { Observer } from '../../Observer';
import { css, getSafeId } from '../../Util';
import { TextField } from "./TextField";
var messageId = 1;
var TextFieldWithMessage = /** @class */ (function (_super) {
    __extends(TextFieldWithMessage, _super);
    function TextFieldWithMessage(props) {
        var _this = _super.call(this, props) || this;
        _this.innerTextField = React.createRef();
        _this.select = function () {
            if (_this.innerTextField.current) {
                _this.innerTextField.current.select();
            }
        };
        _this.setSelectionRange = function (start, length) {
            if (_this.innerTextField.current) {
                _this.innerTextField.current.setSelectionRange(start, length);
            }
        };
        _this.descriptionId = "textfield-message-" + messageId++;
        return _this;
    }
    TextFieldWithMessage.prototype.focus = function () {
        if (this.innerTextField.current) {
            this.innerTextField.current.focus();
        }
    };
    Object.defineProperty(TextFieldWithMessage.prototype, "selectionEnd", {
        get: function () {
            return this.innerTextField.current ? this.innerTextField.current.selectionEnd : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextFieldWithMessage.prototype, "selectionStart", {
        get: function () {
            return this.innerTextField.current ? this.innerTextField.current.selectionStart : null;
        },
        enumerable: false,
        configurable: true
    });
    TextFieldWithMessage.prototype.render = function () {
        var _this = this;
        var _a = this.props, message = _a.message, error = _a.error;
        return (React.createElement(Observer, { error: error, message: message }, function (observerProps) {
            var textFieldProps = __assign({}, _this.props.textFieldProps);
            var messageClassName = _this.props.messageClassName;
            if (observerProps.error) {
                textFieldProps.className = css(textFieldProps.className, "bolt-textfield-error");
                messageClassName = css(messageClassName, "bolt-textfield-message-error");
                textFieldProps.suffixIconProps = textFieldProps.suffixIconProps || {
                    className: "bolt-textfield-message-error",
                    iconName: "Error"
                };
            }
            return (React.createElement("div", { className: css(_this.props.className, "flex-column") },
                React.createElement(TextField, __assign({ ariaDescribedBy: observerProps.message && _this.descriptionId, ref: _this.innerTextField }, textFieldProps)),
                observerProps.message && (React.createElement("span", { role: error ? "alert" : undefined, id: getSafeId(_this.descriptionId), className: css(messageClassName, "bolt-textfield-message") }, observerProps.message))));
        }));
    };
    return TextFieldWithMessage;
}(React.Component));
export { TextFieldWithMessage };
