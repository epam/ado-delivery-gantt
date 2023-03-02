import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ClipboardButton.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { Button } from '../../Button';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Clipboard';
import { css } from '../../Util';
import { copyToClipboard } from "../../Utils/ClipboardUtils";
var ClipboardButton = /** @class */ (function (_super) {
    __extends(ClipboardButton, _super);
    function ClipboardButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.copied = new ObservableValue(false);
        _this.onClick = function (event) {
            var _a = _this.props, getContent = _a.getContent, onCopy = _a.onCopy;
            if (!_this.copied.value) {
                _this.copied.value = true;
            }
            var content = getContent();
            copyToClipboard(content, onCopy);
            event.preventDefault();
            event.stopPropagation();
        };
        _this.onMouseLeave = function (event) {
            if (_this.copied.value) {
                _this.copied.value = false;
            }
            _this.props.onMouseLeave && _this.props.onMouseLeave(event);
        };
        return _this;
    }
    ClipboardButton.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, onBlur = _a.onBlur, onFocus = _a.onFocus, showCopiedTooltip = _a.showCopiedTooltip, subtle = _a.subtle, tooltipProps = _a.tooltipProps;
        var copiedTooltipText = typeof showCopiedTooltip === "string" ? showCopiedTooltip : Resources.CopiedToClipboard;
        return (React.createElement("div", { className: css("bolt-clipboard-button", this.props.className) },
            React.createElement(Observer, { copied: this.copied }, function (props) {
                return (React.createElement(Button, { ariaLabel: ariaLabel || Resources.CopyToClipboard, iconProps: { iconName: "Copy" }, onBlur: onBlur, onClick: _this.onClick, onFocus: onFocus, subtle: subtle, tooltipProps: showCopiedTooltip && props.copied ? __assign(__assign({}, tooltipProps), { text: copiedTooltipText }) : tooltipProps, onMouseLeave: _this.onMouseLeave }));
            })));
    };
    return ClipboardButton;
}(React.Component));
export { ClipboardButton };
