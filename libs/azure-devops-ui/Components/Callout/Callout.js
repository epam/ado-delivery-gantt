import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Callout.css";
import * as React from "react";
import { FocusWithin } from '../../FocusWithin';
import { FocusZone } from '../../FocusZone';
import { Portal } from '../../Portal';
import { css, getSafeId, KeyCode } from '../../Util';
import { Location, position, updateLayout } from '../../Utilities/Position';
import { TimerManagement } from '../../Core/TimerManagement';
import { SurfaceBackground, SurfaceContext } from '../../Surface';
import { ContentJustification, ContentLocation, ContentOrientation, ContentSize } from "./Callout.Props";
var Callout = /** @class */ (function (_super) {
    __extends(Callout, _super);
    function Callout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.calloutContent = React.createRef();
        return _this;
    }
    Callout.prototype.render = function () {
        var portalProps = this.props.portalProps;
        return (React.createElement(Portal, __assign({}, portalProps, { className: css(portalProps && portalProps.className, this.props.anchorElement && "bolt-layout-relative") }),
            React.createElement(CalloutContent, __assign({ ref: this.calloutContent }, this.props))));
    };
    Callout.prototype.componentWillUnmount = function () {
        // We need to let the content handle the WillUnmount before the Portal, this
        // will ensure the the callout can deal with unmounting content that still has
        // focus. Otherwise the root will be detached from the document and focus will
        // have moved to the body.
        if (this.calloutContent.current) {
            this.calloutContent.current.portalWillUnmount();
        }
    };
    Callout.prototype.updateLayout = function () {
        if (this.calloutContent.current) {
            this.calloutContent.current.updateLayout();
        }
    };
    Callout.defaultProps = {
        blurDismiss: false,
        viewportChangeDismiss: true
    };
    return Callout;
}(React.Component));
export { Callout };
var CalloutContent = /** @class */ (function (_super) {
    __extends(CalloutContent, _super);
    function CalloutContent(props) {
        var _this = _super.call(this, props) || this;
        _this.calloutElement = React.createRef();
        _this.relayoutTimer = new TimerManagement();
        _this.scrollListen = false;
        _this.scrollEvent = null;
        _this.initialScreenWidth = window.innerWidth;
        _this.onBlur = function () {
            _this.props.onDismiss && _this.props.onDismiss();
        };
        _this.onClick = function (event) {
            // If we click on the light dismiss div we will dismiss it.
            if (_this.props.lightDismiss && !event.defaultPrevented) {
                if (_this.props.onDismiss) {
                    _this.props.onDismiss();
                }
                event.preventDefault();
            }
        };
        _this.onKeyDown = function (event) {
            var _a, _b;
            // If we press escape from within the callout this will dismiss it.
            if (_this.props.escDismiss && event.which === KeyCode.escape && !event.defaultPrevented) {
                if (_this.props.onDismiss) {
                    _this.props.onDismiss();
                }
                event.preventDefault();
            }
            (_b = (_a = _this.props).onKeyDown) === null || _b === void 0 ? void 0 : _b.call(_a, event);
        };
        _this.onResize = function () {
            // Fix for issue where the soft keyboard on android closes callouts.
            if (_this.props.viewportChangeDismiss === true &&
                (_this.initialScreenWidth !== window.innerWidth ||
                    !document.activeElement ||
                    (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA"))) {
                _this.props.onDismiss && _this.props.onDismiss();
            }
            else if (_this.props.updateLayout) {
                _this.relayoutTimer.clearAllTimers();
                _this.relayoutTimer.setTimeout(function () {
                    _this.updateLayout();
                }, 200);
            }
        };
        _this.onScroll = function (event) {
            if (_this.scrollListen) {
                _this.scrollEvent = event.nativeEvent;
            }
        };
        _this.onScrollDocument = function (event) {
            if (_this.scrollListen) {
                if (event === _this.scrollEvent) {
                    _this.scrollEvent = null;
                }
                else {
                    if (_this.props.viewportChangeDismiss === true) {
                        var anchorElement = _this.props.anchorElement;
                        // If the element containing the anchor is scrolled dismiss the callout.
                        if (event.target && anchorElement && event.target.contains(anchorElement)) {
                            _this.props.onDismiss && _this.props.onDismiss();
                        }
                    }
                    else if (_this.props.updateLayout) {
                        _this.relayoutTimer.setTimeout(function () {
                            _this.updateLayout();
                        }, 50);
                    }
                }
            }
        };
        // Track the element that had focus when we mounted.
        _this.focusElement = document.activeElement;
        _this.contentElement = props.contentRef || React.createRef();
        return _this;
    }
    CalloutContent.prototype.render = function () {
        var _this = this;
        var _a = this.props, blurDismiss = _a.blurDismiss, contentJustification = _a.contentJustification, contentLocation = _a.contentLocation, contentOrientation = _a.contentOrientation, focuszoneProps = _a.focuszoneProps, lightDismiss = _a.lightDismiss, modal = _a.modal, onAnimationEnd = _a.onAnimationEnd, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, anchorElement = _a.anchorElement;
        var content;
        // If we have both a FocusWithin and a FocusZone we need to use the functional version
        // of the FocusWithin to allow the FocusZone to contain the content directly.
        if (blurDismiss && focuszoneProps) {
            content = (React.createElement(FocusWithin, { onBlur: this.onBlur, updateStateOnFocusChange: false }, function (props) { return React.createElement(FocusZone, __assign({}, focuszoneProps), _this.renderContent(props.onFocus, props.onBlur)); }));
        }
        else {
            content = this.renderContent();
            // Add the focus tracker to dismiss the callout if we are dismissing on blur.
            if (blurDismiss) {
                content = (React.createElement(FocusWithin, { onBlur: this.onBlur, updateStateOnFocusChange: false }, content));
            }
            // Add focus zone if focuszoneProperties are specified
            if (focuszoneProps) {
                content = React.createElement(FocusZone, __assign({}, focuszoneProps), content);
            }
        }
        var lightDismissDiv = lightDismiss ? (React.createElement("div", { className: css("absolute-fill bolt-light-dismiss", modal && "bolt-callout-modal"), onClick: this.onClick })) : null;
        // The callout is wrapped in a floating element in the portal.
        // If lightDismiss is enabled we will create an absolute-fill div to capture onClick events.
        return (React.createElement(SurfaceContext.Provider, { value: { background: SurfaceBackground.callout } },
            React.createElement("div", { className: "flex-row flex-grow" },
                React.createElement("div", { className: css(this.props.className, "bolt-callout absolute", contentLocation !== undefined && "absolute-fill", contentJustification === ContentJustification.Start && "justify-start", contentJustification === ContentJustification.Center && "justify-center", contentJustification === ContentJustification.End && "justify-end", contentLocation === ContentLocation.Start && "flex-start", contentLocation === ContentLocation.Center && "flex-center", contentLocation === ContentLocation.End && "flex-end", contentOrientation === ContentOrientation.Column && "flex-column", contentOrientation !== ContentOrientation.Column && "flex-row", modal && !lightDismiss && "bolt-callout-modal"), id: getSafeId(this.props.id), onAnimationEnd: onAnimationEnd, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onKeyDown: this.onKeyDown, ref: this.calloutElement, role: this.props.role, tabIndex: -1 },
                    !anchorElement && lightDismissDiv,
                    content),
                !!anchorElement && lightDismissDiv)));
    };
    CalloutContent.prototype.componentDidMount = function () {
        this.updateLayout();
        // If this is an element relative layout we need to listen for scroll events
        // on the document and dismiss the callout if the scroll event didnt pass
        // through the callout.
        if (this.props.anchorElement) {
            window.addEventListener("resize", this.onResize);
            document.addEventListener("scroll", this.onScrollDocument, true);
            this.scrollListen = true;
        }
    };
    CalloutContent.prototype.componentDidUpdate = function () {
        if (this.props.updateLayout) {
            this.updateLayout();
        }
    };
    CalloutContent.prototype.componentWillUnmount = function () {
        if (this.scrollListen) {
            document.removeEventListener("scroll", this.onScrollDocument, true);
            window.removeEventListener("resize", this.onResize);
        }
        if (this.relayoutTimer) {
            this.relayoutTimer.clearAllTimers();
        }
    };
    CalloutContent.prototype.portalWillUnmount = function () {
        var contentElement = this.contentElement.current;
        var focusElement = this.focusElement;
        // If the callout has focus when unmounted we need to set focus back to the last element with focus.
        // Need to wait for next tick otherwise focus/blur events are not fired.
        if (focusElement && contentElement && contentElement.contains(document.activeElement)) {
            window.setTimeout(function () {
                // We need to make sure the active element is portal after the timeout.
                // It may have moved through other means before the timeout expires.
                // Set focus to the focusElement if our element contains focus, or if the focus has gone back to the document body
                if (contentElement.contains(document.activeElement) || document.activeElement === document.body || document.activeElement === null) {
                    focusElement.focus();
                }
            }, 0);
        }
    };
    CalloutContent.prototype.updateLayout = function () {
        if (this.props.contentLocation === undefined) {
            if (this.calloutElement.current) {
                // Position the element based on the initial layout parameters.
                position(this.calloutElement.current, this.props.calloutOrigin || { horizontal: Location.start, vertical: Location.start }, this.props.anchorOffset, this.props.anchorElement, this.props.anchorOrigin, this.props.anchorPoint, this.props.anchorElement ? 5000 : 0);
                // Now that the component is placed at the requested location, update
                // the layout if the caller didnt request a fixed layout.
                if (!this.props.fixedLayout) {
                    updateLayout(this.calloutElement.current, this.props.calloutOrigin || { horizontal: Location.start, vertical: Location.start }, this.props.anchorOffset, this.props.anchorElement, this.props.anchorOrigin, this.props.anchorPoint, this.props.anchorElement ? 5000 : 0);
                }
            }
        }
    };
    CalloutContent.prototype.renderContent = function (onFocus, onBlur) {
        var _a = this.props, contentJustification = _a.contentJustification, contentOrientation = _a.contentOrientation, contentSize = _a.contentSize, height = _a.height, width = _a.width;
        return (React.createElement("div", { "aria-describedby": getSafeId(this.props.ariaDescribedBy), "aria-label": this.props.ariaLabel, "aria-labelledby": getSafeId(this.props.ariaLabelledBy), "aria-modal": this.props.modal, className: css(this.props.contentClassName, "bolt-callout-content", this.props.contentShadow && "bolt-callout-shadow", contentJustification === ContentJustification.Stretch && "flex-grow", contentOrientation === ContentOrientation.Column && "flex-column", contentOrientation === ContentOrientation.Row && "flex-row", contentSize === ContentSize.Small && "bolt-callout-small", contentSize === ContentSize.Medium && "bolt-callout-medium", contentSize === ContentSize.Large && "bolt-callout-large", contentSize === ContentSize.ExtraLarge && "bolt-callout-extra-large", contentSize === ContentSize.Auto && "bolt-callout-auto"), onBlur: onBlur, onFocus: onFocus, onScroll: this.onScroll, ref: this.contentElement, role: this.props.role || "dialog", style: { height: height, width: width } }, this.props.children));
    };
    return CalloutContent;
}(React.Component));
