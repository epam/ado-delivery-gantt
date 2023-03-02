import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingBubble.css";
import * as React from "react";
import { CustomTeachingBubble } from "./CustomTeachingBubble";
import { Image } from '../../Image';
import { Header, TitleSize } from '../../Header';
import { PanelCloseButton, PanelFooter } from '../../Panel';
import { Spacing, Surface, SurfaceBackground } from '../../Surface';
import { css } from '../../Util';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
var bubbleId = 1;
var TeachingBubble = /** @class */ (function (_super) {
    __extends(TeachingBubble, _super);
    function TeachingBubble() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.customBubble = React.createRef();
        _this.bubbleId = "bubble-" + bubbleId++;
        _this.getContent = function () {
            var _a = _this.props, children = _a.children, imageProps = _a.imageProps, primaryButtonProps = _a.primaryButtonProps, text = _a.text, textOnly = _a.textOnly, title = _a.title;
            if (textOnly) {
                return React.createElement("div", { className: "bolt-bubble-text-only body-m" }, text);
            }
            return (React.createElement(Surface, { background: SurfaceBackground.callout, spacing: Spacing.condensed },
                React.createElement("div", { className: "flex-row justify-center" }, imageProps && React.createElement(Image, __assign({}, imageProps))),
                React.createElement(PanelCloseButton, { className: "bolt-bubble-close", onDismiss: _this.dismiss }),
                React.createElement(Header, { className: css("bolt-bubble-text", !primaryButtonProps && "no-buttons"), description: text, descriptionClassName: "bolt-bubble-description", descriptionId: _this.bubbleId + "-description", title: title, titleSize: TitleSize.Small, titleId: _this.bubbleId + "-title" }),
                children,
                primaryButtonProps && (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
                    React.createElement("div", { className: "bolt-bubble-buttons" },
                        React.createElement(PanelFooter, { buttonProps: _this.getButtons() }))))));
        };
        _this.getButtons = function () {
            var _a = _this.props, primaryButtonProps = _a.primaryButtonProps, secondaryButtonProps = _a.secondaryButtonProps;
            var buttons = [__assign(__assign({}, primaryButtonProps), { className: css("bolt-bubble-primary-button", primaryButtonProps.className) })];
            secondaryButtonProps && buttons.push(secondaryButtonProps);
            return buttons;
        };
        _this.setFocus = function () {
            var _a = _this.props, onLocationChange = _a.onLocationChange, primaryButtonProps = _a.primaryButtonProps, secondaryButtonProps = _a.secondaryButtonProps;
            if (primaryButtonProps && !secondaryButtonProps) {
                var primaryButton = document.getElementsByClassName("bolt-bubble-primary-button")[0];
                if (primaryButton) {
                    primaryButton.focus();
                }
            }
            else if (!primaryButtonProps) {
                var closeButton = document.getElementsByClassName("bolt-bubble-close")[0];
                if (closeButton) {
                    closeButton.focus();
                }
            }
            onLocationChange && onLocationChange();
        };
        _this.dismiss = function () {
            _this.customBubble.current && _this.customBubble.current.dismiss();
        };
        return _this;
    }
    TeachingBubble.prototype.render = function () {
        var defaultActiveElement = this.props.defaultActiveElement;
        if (!defaultActiveElement && !this.props.textOnly) {
            if (this.props.primaryButtonProps) {
                defaultActiveElement = ".bolt-bubble-primary-button";
            }
            else {
                defaultActiveElement = ".bolt-bubble-close";
            }
        }
        return (React.createElement(CustomTeachingBubble, __assign({}, this.props, { ariaDescribedBy: this.props.ariaDescribedBy || this.bubbleId + "-description", ariaLabeledBy: this.props.ariaLabeledBy || this.bubbleId + "-title", defaultActiveElement: defaultActiveElement, onLocationChange: this.setFocus, ref: this.customBubble }), this.getContent()));
    };
    return TeachingBubble;
}(React.Component));
export { TeachingBubble };
