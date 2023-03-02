import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import * as Resources from '../../Resources.Widgets';
import { MenuButton } from "./MenuButton";
var MoreButton = /** @class */ (function (_super) {
    __extends(MoreButton, _super);
    function MoreButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.menuButton = React.createRef();
        _this.expand = function () {
            if (_this.menuButton.current) {
                _this.menuButton.current.expand();
            }
        };
        _this.collapse = function () {
            if (_this.menuButton.current) {
                _this.menuButton.current.collapse();
            }
        };
        return _this;
    }
    MoreButton.prototype.render = function () {
        return (React.createElement(MenuButton, __assign({ ariaLabel: Resources.MoreActions, hideDropdownIcon: true, iconProps: { iconName: "MoreVertical" }, ref: this.menuButton, subtle: true, tooltipProps: { text: Resources.MoreActions } }, this.props)));
    };
    MoreButton.prototype.focus = function () {
        if (this.menuButton.current) {
            this.menuButton.current.focus();
        }
    };
    return MoreButton;
}(React.Component));
export { MoreButton };
