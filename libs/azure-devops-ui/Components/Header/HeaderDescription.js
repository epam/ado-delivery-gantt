import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { css, getSafeId } from '../../Util';
var HeaderDescription = /** @class */ (function (_super) {
    __extends(HeaderDescription, _super);
    function HeaderDescription() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderDescription.prototype.render = function () {
        return (React.createElement("div", { className: css(this.props.className, "bolt-header-description body-m secondary-text"), id: getSafeId(this.props.id) }, this.props.children));
    };
    return HeaderDescription;
}(React.Component));
export { HeaderDescription };
