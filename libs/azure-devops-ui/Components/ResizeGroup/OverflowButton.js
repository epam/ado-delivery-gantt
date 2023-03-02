import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { MoreButton } from "../Menu/MoreButton";
import { Observer } from '../../Observer';
import { ResizeGroupContext } from "./ResizeGroup";
var OverflowButton = /** @class */ (function (_super) {
    __extends(OverflowButton, _super);
    function OverflowButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.moreButton = React.createRef();
        return _this;
    }
    OverflowButton.prototype.render = function () {
        var _this = this;
        return (React.createElement(ResizeGroupContext.Consumer, null, function (resizeGroupContext) {
            return (React.createElement(Observer, { menuItems: resizeGroupContext.overflowItems }, function (props) {
                return props.menuItems && props.menuItems.length > 0 ? (React.createElement(MoreButton, __assign({ contextualMenuProps: {
                        menuProps: { id: "overflow-menu", items: props.menuItems }
                    }, ref: _this.moreButton }, _this.props))) : (React.createElement("div", null));
            }));
        }));
    };
    OverflowButton.prototype.focus = function () {
        if (this.moreButton.current) {
            this.moreButton.current.focus();
        }
    };
    return OverflowButton;
}(React.Component));
export { OverflowButton };
