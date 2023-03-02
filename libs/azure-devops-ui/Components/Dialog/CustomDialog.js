import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { EventManagement } from '../../Core/EventManagement';
import { announce } from '../../Core/Util/Accessibility';
import { ScreenContext, ScreenSize } from '../../Core/Util/Screen';
import { format } from '../../Core/Util/String';
import { Callout, ContentJustification, ContentLocation, ContentOrientation, ContentSize } from '../../Callout';
import { FocusZoneKeyStroke } from '../../FocusZone';
import { Icon } from '../../Icon';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Layer';
import { Spinner, SpinnerSize } from '../../Spinner';
import { Spacing, Surface, SurfaceContext } from '../../Surface';
import { css, KeyCode } from '../../Util';
var MIN_DIALOG_Size = 320;
var DIALOG_RESIZE_INCREMENT = 2;
var CustomDialog = /** @class */ (function (_super) {
    __extends(CustomDialog, _super);
    function CustomDialog(props) {
        var _this = _super.call(this, props) || this;
        _this.events = new EventManagement();
        _this.contentRef = React.createRef();
        _this.onGripperKeyDown = function (event) {
            if (_this.contentRef.current) {
                var rect = _this.contentRef.current.getBoundingClientRect();
                _this.currentHeight = rect.height;
                _this.currentWidth = rect.width;
                switch (event.keyCode) {
                    case KeyCode.leftArrow:
                        _this.setState({ width: Math.max(_this.currentWidth - DIALOG_RESIZE_INCREMENT, MIN_DIALOG_Size) });
                        break;
                    case KeyCode.rightArrow:
                        _this.setState({ width: _this.currentWidth + DIALOG_RESIZE_INCREMENT });
                        break;
                    case KeyCode.upArrow:
                        _this.setState({ height: Math.max(_this.currentHeight - DIALOG_RESIZE_INCREMENT, MIN_DIALOG_Size) });
                        break;
                    case KeyCode.downArrow:
                        _this.setState({ height: _this.currentHeight + DIALOG_RESIZE_INCREMENT });
                        break;
                    default:
                        return;
                }
                event.preventDefault();
                event.stopPropagation();
                announce(format(Resources.SizeFormat, _this.state.height || _this.currentHeight, _this.state.width || _this.currentWidth));
            }
        };
        _this.onGripperMouseDown = function (event) {
            _this.onGripperDown(event, event.clientX, event.clientY);
            _this.attachMouseWindowEvents();
        };
        _this.onGripperDown = function (event, xPos, yPos) {
            if (_this.contentRef) {
                event.preventDefault();
                event.stopPropagation();
                _this.anchorX = xPos;
                _this.anchorY = yPos;
                if (_this.contentRef.current) {
                    var rect = _this.contentRef.current.getBoundingClientRect();
                    _this.currentHeight = rect.height;
                    _this.currentWidth = rect.width;
                }
            }
        };
        _this.onGripperMouseMove = function (event) {
            _this.handleDragEvent(event, event.clientX, event.clientY);
        };
        _this.onGripperMouseUp = function (event) {
            _this.detachMouseWindowEvents();
            announce(format(Resources.SizeFormat, _this.state.height, _this.state.width));
        };
        _this.onKeyDown = function (event) {
            var _a;
            var _b = _this.props, enterPrimary = _b.enterPrimary, primaryButtonProps = _b.primaryButtonProps;
            if (enterPrimary && primaryButtonProps && event.which === KeyCode.enter && !event.defaultPrevented) {
                (_a = primaryButtonProps.onClick) === null || _a === void 0 ? void 0 : _a.call(primaryButtonProps, event);
                event.preventDefault();
            }
        };
        _this.state = {};
        return _this;
    }
    CustomDialog.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaDescribedBy = _a.ariaDescribedBy, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, blurDismiss = _a.blurDismiss, calloutClassName = _a.calloutClassName, className = _a.className, calloutContentClassName = _a.calloutContentClassName, contentJustification = _a.contentJustification, contentLocation = _a.contentLocation, defaultActiveElement = _a.defaultActiveElement, defaultFocusableElementAriaLabel = _a.defaultFocusableElementAriaLabel, escDismiss = _a.escDismiss, id = _a.id, lightDismiss = _a.lightDismiss, onDismiss = _a.onDismiss, overlay = _a.overlay, modal = _a.modal, resizable = _a.resizable, role = _a.role, _b = _a.contentSize, contentSize = _b === void 0 ? ContentSize.Medium : _b;
        return (React.createElement(Observer, { size: this.context.size }, function (props) {
            var mobile = props.size === ScreenSize.xsmall;
            return (React.createElement(Callout, { ariaDescribedBy: ariaDescribedBy, ariaLabel: ariaLabel, ariaLabelledBy: ariaLabelledBy, blurDismiss: blurDismiss, className: css(calloutClassName, "bolt-dialog-callout"), contentClassName: css(calloutContentClassName, "bolt-dialog-callout-content relative scroll-auto", mobile && "bolt-dialog-mobile flex-grow"), contentJustification: contentJustification, contentLocation: contentLocation, contentOrientation: ContentOrientation.Column, contentRef: _this.contentRef, contentShadow: true, contentSize: mobile ? undefined : contentSize, escDismiss: escDismiss, focuszoneProps: {
                    circularNavigation: true,
                    defaultActiveElement: defaultActiveElement || ".bolt-dialog-focus-element",
                    focusOnMount: true,
                    handleTabKey: true,
                    includeDefaults: true,
                    selectInputTextOnFocus: _this.props.selectInputTextOnFocus,
                    postprocessKeyStroke: function (event) {
                        // We want to prevent moving outside the dialog if there are no focusable elements in the dialog.
                        event.which === KeyCode.tab && event.preventDefault();
                        return FocusZoneKeyStroke.IgnoreParents;
                    }
                }, id: id, lightDismiss: lightDismiss, modal: modal, onDismiss: onDismiss, role: role, height: _this.state.height, width: _this.state.width, onKeyDown: _this.onKeyDown },
                React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(Surface, __assign({}, surfaceContext, { spacing: Spacing.default }),
                    React.createElement("div", { className: css(className, "bolt-dialog-root flex-column flex-grow scroll-hidden") },
                        React.createElement("div", { "aria-label": defaultFocusableElementAriaLabel, className: "bolt-dialog-focus-element no-outline", tabIndex: -1 }),
                        _this.props.children,
                        !mobile && resizable && (React.createElement(Icon, { ariaLabel: Resources.Resize, iconName: "GripperResize", onMouseDown: _this.onGripperMouseDown, onKeyDown: _this.onGripperKeyDown, tabIndex: 0, wrapperClass: "bolt-dialog-resize-icon" })),
                        overlay && (React.createElement("div", { className: "absolute-fill bolt-dialog-overlay flex-column justify-center" },
                            React.createElement(Spinner, { size: SpinnerSize.large, ariaLabel: overlay.spinnerAriaLabel, ariaLive: "assertive", label: overlay.spinnerLabel })))))); })));
        }));
    };
    CustomDialog.prototype.handleDragEvent = function (event, xPos, yPos) {
        var newWidth = Math.max((this.currentWidth || 0) + (xPos - this.anchorX) * 2, MIN_DIALOG_Size);
        var newHeight = Math.max((this.currentHeight || 0) + (yPos - this.anchorY) * 2, MIN_DIALOG_Size);
        this.setState({ width: newWidth, height: newHeight });
    };
    CustomDialog.prototype.attachMouseWindowEvents = function () {
        this.events.addEventListener(window, "mousemove", this.onGripperMouseMove);
        this.events.addEventListener(window, "mouseup", this.onGripperMouseUp);
    };
    CustomDialog.prototype.detachMouseWindowEvents = function () {
        this.events.removeEventListener(window, "mousemove", this.onGripperMouseMove);
        this.events.removeEventListener(window, "mouseup", this.onGripperMouseUp);
    };
    CustomDialog.defaultProps = {
        contentJustification: ContentJustification.Center,
        contentLocation: ContentLocation.Center,
        escDismiss: true,
        lightDismiss: true,
        enterPrimary: true
    };
    CustomDialog.contextType = ScreenContext;
    return CustomDialog;
}(React.Component));
export { CustomDialog };
