import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { DialogInternal } from "./DialogInternal";
var Dialog = /** @class */ (function (_super) {
    __extends(Dialog, _super);
    function Dialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dialog.prototype.render = function () {
        return React.createElement(DialogInternal, __assign({}, this.props, { modal: true }));
    };
    return Dialog;
}(React.Component));
export { Dialog };
