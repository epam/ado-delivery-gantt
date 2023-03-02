import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { css } from '../../Util';
var HeaderTitleRow = /** @class */ (function (_super) {
    __extends(HeaderTitleRow, _super);
    function HeaderTitleRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderTitleRow.prototype.render = function () {
        return React.createElement("div", { className: css(this.props.className, "bolt-header-title-row flex-row flex-baseline") }, this.props.children);
    };
    return HeaderTitleRow;
}(React.Component));
export { HeaderTitleRow };
