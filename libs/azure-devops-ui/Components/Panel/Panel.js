import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { CustomPanel } from "./CustomPanel";
import { PanelContent } from "./PanelContent";
import { PanelFooter } from "./PanelFooter";
import { PanelHeader } from "./PanelHeader";
import { PanelOverlay } from "./PanelOverlay";
var panelId = 1;
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.customPanelRef = React.createRef();
        _this.panelId = "panel-" + panelId++;
        return _this;
    }
    Panel.prototype.render = function () {
        var props = this.props;
        var backButtonProps = props.backButtonProps, description = props.description, footerButtonProps = props.footerButtonProps, onDismiss = props.onDismiss, overlayContent = props.overlayContent, showSeparator = props.showSeparator, _a = props.titleProps, titleProps = _a === void 0 ? {} : _a;
        var id = props.id || this.panelId;
        var titleId = titleProps.id ? titleProps.id : titleProps.text ? id + "-title" : undefined;
        return (React.createElement(CustomPanel, __assign({ ariaLabelledBy: titleId }, props, { id: id, lightDismiss: overlayContent ? false : props.lightDismiss, ref: this.customPanelRef }),
            React.createElement(PanelHeader, { backButtonProps: backButtonProps, description: description, onDismiss: onDismiss, showSeparator: showSeparator, titleProps: __assign({ id: titleId }, titleProps) }),
            React.createElement(PanelContent, { className: props.contentClassName }, props.children),
            footerButtonProps && React.createElement(PanelFooter, { showSeparator: showSeparator, buttonProps: footerButtonProps }),
            overlayContent && React.createElement(PanelOverlay, { overlayContent: overlayContent })));
    };
    Panel.prototype.animateOut = function () {
        return this.customPanelRef.current ? this.customPanelRef.current.animateOut() : Promise.resolve();
    };
    return Panel;
}(React.Component));
export { Panel };
