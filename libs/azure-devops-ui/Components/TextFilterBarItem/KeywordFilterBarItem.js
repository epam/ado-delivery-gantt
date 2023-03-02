import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import * as Resources from '../../Resources.Input';
import { TextFieldStyle, TextFieldWidth } from '../../TextField';
import { TextFilterBarItem } from "./TextFilterBarItem";
var KeywordFilterBarItem = /** @class */ (function (_super) {
    __extends(KeywordFilterBarItem, _super);
    function KeywordFilterBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeywordFilterBarItem.prototype.getExtraTextFieldProps = function () {
        var placeholder = this.props.placeholder || Resources.KeywordFilterBarItemPlaceholderText;
        return {
            prefixIconProps: { className: "keyword-filter-icon", iconName: "Filter" },
            placeholder: placeholder,
            ariaLabel: placeholder,
            role: "searchbox"
        };
    };
    return KeywordFilterBarItem;
}(TextFilterBarItem));
export { KeywordFilterBarItem };
export var InlineKeywordFilterBarItem = function (props) {
    return (React.createElement("div", { className: "flex-noshrink flex-row bolt-inline-keyword-filter-bar" },
        React.createElement(KeywordFilterBarItem, __assign({ clearable: true }, props, { style: TextFieldStyle.inline, width: TextFieldWidth.tabBar }))));
};
