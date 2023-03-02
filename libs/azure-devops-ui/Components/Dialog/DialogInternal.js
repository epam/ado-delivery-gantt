import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { PanelCloseButtonSize } from '../../Components/Panel/Panel.Props';
import { TitleSize } from '../../Header';
import { PanelFooter, PanelHeader } from '../../Panel';
import { SurfaceContext } from '../../Surface';
import { css } from '../../Util';
import { CustomDialog } from "./CustomDialog";
var dialogId = 1;
var DialogInternal = /** @class */ (function (_super) {
    __extends(DialogInternal, _super);
    function DialogInternal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dialogId = "dialog-" + dialogId++;
        return _this;
    }
    DialogInternal.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaDescribedBy = _a.ariaDescribedBy, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, blurDismiss = _a.blurDismiss, calloutClassName = _a.calloutClassName, calloutContentClassName = _a.calloutContentClassName, className = _a.className, contentJustification = _a.contentJustification, contentLocation = _a.contentLocation, contentSize = _a.contentSize, defaultActiveElement = _a.defaultActiveElement, escDismiss = _a.escDismiss, enterPrimary = _a.enterPrimary, footerButtonProps = _a.footerButtonProps, lightDismiss = _a.lightDismiss, modal = _a.modal, onDismiss = _a.onDismiss, overlay = _a.overlay, resizable = _a.resizable, showCloseButton = _a.showCloseButton;
        var titleProps = __assign({}, this.props.titleProps);
        var id = this.props.id || this.dialogId;
        var titleId = titleProps.id ? titleProps.id : titleProps.text ? id + "-title" : undefined;
        titleProps.id = titleId;
        if (titleProps.size === undefined) {
            titleProps.size = TitleSize.Small;
        }
        return (React.createElement(CustomDialog, { ariaDescribedBy: ariaDescribedBy, ariaLabel: ariaLabel, ariaLabelledBy: ariaLabelledBy || titleId, blurDismiss: blurDismiss, calloutClassName: calloutClassName, calloutContentClassName: calloutContentClassName, contentLocation: contentLocation, contentJustification: contentJustification, className: css("bolt-dialog", className), defaultActiveElement: defaultActiveElement, escDismiss: escDismiss, id: id, lightDismiss: lightDismiss, modal: modal, onDismiss: onDismiss, overlay: overlay, contentSize: contentSize, resizable: resizable, enterPrimary: enterPrimary, primaryButtonProps: footerButtonProps === null || footerButtonProps === void 0 ? void 0 : footerButtonProps.find(function (button) { return button.primary; }) },
            React.createElement(PanelHeader, { onDismiss: onDismiss, closeButtonSize: PanelCloseButtonSize.small, showCloseButton: showCloseButton, showSeparator: false, titleProps: titleProps }),
            React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement("div", { className: css("bolt-dialog-content flex-column flex-grow", !footerButtonProps && "bolt-dialog-content-bottom-padding", surfaceContext.horizontalClassName) }, _this.props.children)); }),
            footerButtonProps && (React.createElement(PanelFooter, { className: css(resizable && "bolt-dialog-resizable-footer"), showSeparator: false, buttonProps: footerButtonProps }))));
    };
    DialogInternal.defaultProps = {
        showCloseButton: false
    };
    return DialogInternal;
}(React.Component));
export { DialogInternal };
