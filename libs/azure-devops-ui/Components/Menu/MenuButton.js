import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { ExpandableButton } from '../../Button';
import { ContextualMenu } from "./Menu";
var buttonId = 1;
var MenuButton = /** @class */ (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(props) {
        var _this = _super.call(this, props) || this;
        _this.dropdownButton = React.createRef();
        _this.expand = function () {
            if (_this.dropdownButton.current) {
                _this.dropdownButton.current.expand();
            }
        };
        _this.collapse = function () {
            if (_this.dropdownButton.current) {
                _this.dropdownButton.current.collapse();
            }
        };
        _this.renderMenu = function (dropdown, dropdownId, anchorElement, anchorOffset, anchorOrigin, anchorPoint, dropdownOrigin) {
            var contextualMenuProps = typeof _this.props.contextualMenuProps === "function" ? _this.props.contextualMenuProps() : _this.props.contextualMenuProps;
            return (React.createElement(ContextualMenu, { anchorElement: anchorElement, anchorOffset: contextualMenuProps.anchorOffset || anchorOffset, anchorOrigin: contextualMenuProps.anchorOrigin || anchorOrigin, anchorPoint: contextualMenuProps.anchorPoint || anchorPoint, fixedLayout: contextualMenuProps.fixedLayout, menuOrigin: contextualMenuProps.menuOrigin || dropdownOrigin, menuProps: contextualMenuProps.menuProps, className: contextualMenuProps.className, onActivate: function (menuItem, event) {
                    if (contextualMenuProps.onActivate) {
                        contextualMenuProps.onActivate(menuItem, event);
                    }
                    dropdown.collapse();
                }, onDismiss: dropdown.collapse }));
        };
        _this.state = {
            id: _this.props.id || "menu-button-" + buttonId++
        };
        return _this;
    }
    MenuButton.prototype.render = function () {
        var _a = this.props, contextualMenuProps = _a.contextualMenuProps, hideDropdownIcon = _a.hideDropdownIcon;
        return (React.createElement(ExpandableButton, __assign({}, __assign(__assign({}, this.props), { menuProps: undefined }), { hideDropdownIcon: hideDropdownIcon, id: this.state.id, ref: this.dropdownButton, renderCallout: this.renderMenu }), this.props.children));
    };
    MenuButton.prototype.focus = function () {
        if (this.dropdownButton.current) {
            this.dropdownButton.current.focus();
        }
    };
    return MenuButton;
}(React.Component));
export { MenuButton };
