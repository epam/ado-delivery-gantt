import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { TitleSize } from "./Header.Props";
import { Icon } from '../../Icon';
import { css } from '../../Util';
var HeaderIcon = /** @class */ (function (_super) {
    __extends(HeaderIcon, _super);
    function HeaderIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderIcon.prototype.render = function () {
        var titleSizeClass = undefined;
        switch (this.props.titleSize) {
            case TitleSize.Large:
                titleSizeClass = "l";
                break;
            case TitleSize.Small:
                titleSizeClass = "s";
                break;
            case TitleSize.Medium:
            default:
                titleSizeClass = "m";
        }
        return React.createElement("div", { className: css(this.props.className, "bolt-header-icon", titleSizeClass) }, Icon(this.props.iconProps));
    };
    return HeaderIcon;
}(React.Component));
export { HeaderIcon };
