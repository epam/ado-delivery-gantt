import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { DialogInternal } from "./DialogInternal";
import { ContentJustification, ContentLocation } from '../../Callout';
import { css } from '../../Util';
var CornerDialog = /** @class */ (function (_super) {
    __extends(CornerDialog, _super);
    function CornerDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CornerDialog.prototype.render = function () {
        return (React.createElement(DialogInternal, __assign({}, this.props, { calloutContentClassName: css(this.props.calloutContentClassName, "bolt-lower-right-corner-dialog-content"), calloutClassName: css(this.props.calloutClassName, "no-events"), contentJustification: ContentJustification.End, contentLocation: ContentLocation.End, lightDismiss: false, modal: false, escDismiss: false, showCloseButton: true })));
    };
    return CornerDialog;
}(React.Component));
export { CornerDialog };
