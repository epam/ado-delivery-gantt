import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { css } from '../../Util';
var HeaderTitleArea = /** @class */ (function (_super) {
    __extends(HeaderTitleArea, _super);
    function HeaderTitleArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderTitleArea.prototype.render = function () {
        return React.createElement("div", { className: css(this.props.className, "bolt-header-title-area flex-column flex-grow scroll-hidden") }, this.props.children);
    };
    return HeaderTitleArea;
}(React.Component));
export { HeaderTitleArea };
