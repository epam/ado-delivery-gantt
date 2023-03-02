import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Toast.css";
import * as React from "react";
import { makeCancelable } from '../../Core/Util/Promise';
import { Button } from '../../Button';
import { Callout, ContentJustification, ContentLocation } from '../../Callout';
import { Measure } from '../../Measure';
import { css, getSafeId, KeyCode } from '../../Util';
var Toast = /** @class */ (function (_super) {
    __extends(Toast, _super);
    function Toast(props) {
        var _this = _super.call(this, props) || this;
        _this.callToActionRef = React.createRef();
        _this.onCallToActionClick = function (event) {
            if (_this.props.onCallToActionClick) {
                _this.props.onCallToActionClick(event);
            }
        };
        _this.onKeyboardShortcut = function (event) {
            if (_this.callToActionRef.current && !_this.state.fadingOut && event.ctrlKey && event.altKey && event.which === KeyCode.t) {
                _this.callToActionRef.current.focus();
            }
        };
        // Be careful to avoid layout thrashing here; the call to action must NOT change width on re-render
        _this.onMeasureCallToAction = function (newWidth, newHeight) {
            _this.setState({ callToActionWidth: newWidth });
        };
        _this.state = { fadingOut: false };
        return _this;
    }
    Toast.prototype.fadeOut = function () {
        var _this = this;
        this.fadeOutPromise && this.fadeOutPromise.cancel();
        var basePromise = new Promise(function (resolve) {
            _this.setState({ fadingOut: true });
            setTimeout(function () {
                resolve();
            }, 500);
        });
        this.fadeOutPromise = makeCancelable(basePromise);
        return this.fadeOutPromise;
    };
    Toast.prototype.render = function () {
        var _a = this.props, message = _a.message, callToAction = _a.callToAction, className = _a.className;
        var _b = this.state, callToActionWidth = _b.callToActionWidth, fadingOut = _b.fadingOut;
        // Set up class names based on layout
        var renderAsSingleLine = !callToAction || !callToActionWidth || callToActionWidth <= 120;
        var flexLayoutClass = renderAsSingleLine ? "one-line flex-row" : "multi-line flex-column";
        var messageClass = renderAsSingleLine ? "flex-grow" : undefined;
        var fadeOutClass = fadingOut ? "fade-out" : undefined;
        return (React.createElement(Callout, { className: css(className, "bolt-toast no-events"), contentClassName: css("bolt-toast-content", flexLayoutClass, fadeOutClass), contentJustification: ContentJustification.Center, contentLocation: ContentLocation.End },
            React.createElement("span", { className: css("bolt-toast-message flex-shrink", messageClass), id: getSafeId("toast-message"), role: "alert" }, message),
            callToAction && (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "bolt-toast-separator flex-noshrink" }),
                React.createElement(Measure, { onMeasure: this.onMeasureCallToAction },
                    React.createElement("div", { className: "bolt-toast-call-to-action-container" },
                        React.createElement(Button, { ariaDescribedBy: "toast-message", className: "bolt-toast-call-to-action flex-noshrink", ref: this.callToActionRef, subtle: true, onClick: this.onCallToActionClick }, callToAction)))))));
    };
    Toast.prototype.componentDidMount = function () {
        document.addEventListener("keydown", this.onKeyboardShortcut);
    };
    Toast.prototype.componentWillUnmount = function () {
        this.fadeOutPromise && this.fadeOutPromise.cancel();
        document.removeEventListener("keydown", this.onKeyboardShortcut);
    };
    return Toast;
}(React.Component));
export { Toast };
