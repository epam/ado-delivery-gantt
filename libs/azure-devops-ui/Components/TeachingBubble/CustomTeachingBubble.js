import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingBubble.css";
import * as React from "react";
import { TeachingBubbleCornerPlacement } from "./TeachingBubble.Props";
import { Callout } from '../../Callout';
import { FocusZoneKeyStroke } from '../../FocusZone';
import { css, KeyCode } from '../../Util';
import { ScreenSize } from '../../Core/Util/Screen';
import { Location } from '../..//Utilities/Position';
import { ScreenSizeObserver } from '../../Utilities/ScreenSize';
var CustomTeachingBubble = /** @class */ (function (_super) {
    __extends(CustomTeachingBubble, _super);
    function CustomTeachingBubble(props) {
        var _this = _super.call(this, props) || this;
        _this.dismiss = function () {
            _this.setState({ fadingOut: true });
        };
        _this.onAnimationEnd = function () {
            if (_this.state.fadingOut) {
                _this.props.onDismiss && _this.props.onDismiss();
            }
            else if (_this.state.newPosition) {
                _this.setState({
                    anchorElement: _this.props.anchorElement,
                    anchorOrigin: _this.props.anchorOrigin,
                    children: _this.props.children,
                    cornerPlacement: _this.props.cornerPlacement,
                    newPosition: false
                }, _this.props.onLocationChange);
            }
        };
        _this.getCalloutOrigin = function (anchorOrigin, cornerPlacement) {
            if (anchorOrigin.horizontal === Location.center) {
                cornerPlacement = TeachingBubbleCornerPlacement.vertical;
            }
            else if (anchorOrigin.vertical === Location.center) {
                cornerPlacement = TeachingBubbleCornerPlacement.horizontal;
            }
            if (cornerPlacement === TeachingBubbleCornerPlacement.horizontal) {
                if (anchorOrigin.horizontal === Location.start) {
                    return { horizontal: Location.end, vertical: anchorOrigin.vertical };
                }
                else if (anchorOrigin.horizontal === Location.end) {
                    return { horizontal: Location.start, vertical: anchorOrigin.vertical };
                }
                else {
                    return { horizontal: Location.center, vertical: anchorOrigin.vertical };
                }
            }
            else {
                if (anchorOrigin.vertical === Location.start) {
                    return { horizontal: anchorOrigin.horizontal, vertical: Location.end };
                }
                else if (anchorOrigin.vertical === Location.end) {
                    return { horizontal: anchorOrigin.horizontal, vertical: Location.start };
                }
                else {
                    return { horizontal: anchorOrigin.horizontal, vertical: Location.center };
                }
            }
        };
        _this.getBeakClassName = function (anchorOrigin, calloutOrigin) {
            var classNameHorizontal, classNameVertical;
            if (calloutOrigin.horizontal === Location.start) {
                if (anchorOrigin.horizontal === Location.end) {
                    classNameHorizontal = "left-primary";
                }
                else {
                    classNameHorizontal = "left-secondary";
                }
            }
            else if (calloutOrigin.horizontal === Location.end) {
                if (anchorOrigin.horizontal === Location.start) {
                    classNameHorizontal = "right-primary";
                }
                else {
                    classNameHorizontal = "right-secondary";
                }
            }
            else {
                classNameHorizontal = "center-h";
            }
            if (calloutOrigin.vertical === Location.start) {
                if (anchorOrigin.vertical === Location.end) {
                    classNameVertical = "top-primary";
                }
                else {
                    classNameVertical = "top-secondary";
                }
            }
            else if (calloutOrigin.vertical === Location.end) {
                if (anchorOrigin.vertical === Location.start) {
                    classNameVertical = "bottom-primary";
                }
                else {
                    classNameVertical = "bottom-secondary";
                }
            }
            else {
                classNameVertical = "center-v";
            }
            return css(classNameHorizontal, classNameVertical);
        };
        _this.state = {
            anchorElement: props.anchorElement,
            anchorOrigin: props.anchorOrigin,
            children: props.children,
            cornerPlacement: _this.props.cornerPlacement
        };
        return _this;
    }
    CustomTeachingBubble.getDerivedStateFromProps = function (props, state) {
        if (state.anchorElement !== props.anchorElement ||
            state.anchorOrigin.horizontal !== props.anchorOrigin.horizontal ||
            state.anchorOrigin.vertical !== props.anchorOrigin.vertical) {
            return __assign(__assign({}, state), { newPosition: true });
        }
        else {
            return { children: props.children, cornerPlacement: props.cornerPlacement };
        }
    };
    CustomTeachingBubble.prototype.render = function () {
        var _this = this;
        var _a = this.state, anchorElement = _a.anchorElement, anchorOrigin = _a.anchorOrigin, children = _a.children, _b = _a.cornerPlacement, cornerPlacement = _b === void 0 ? TeachingBubbleCornerPlacement.vertical : _b, fadingOut = _a.fadingOut, newPosition = _a.newPosition;
        var calloutOrigin = this.getCalloutOrigin(anchorOrigin, cornerPlacement);
        return (React.createElement(ScreenSizeObserver, null, function (screenSizeProps) {
            var fullScreen = screenSizeProps.screenSize === ScreenSize.xsmall;
            var maxHeight;
            if (!fullScreen) {
                if (anchorOrigin.vertical === Location.end) {
                    maxHeight = window.innerHeight - anchorElement.getBoundingClientRect().bottom;
                }
                else if (anchorOrigin.vertical === Location.start) {
                    maxHeight = anchorElement.getBoundingClientRect().top;
                }
                else {
                    maxHeight = window.innerHeight;
                }
            }
            return (React.createElement(Callout, { anchorElement: fullScreen ? undefined : anchorElement, anchorPoint: fullScreen ? { x: 0, y: 0 } : undefined, anchorOrigin: anchorOrigin, ariaDescribedBy: _this.props.ariaDescribedBy, ariaLabelledBy: _this.props.ariaLabeledBy, blurDismiss: _this.props.textOnly, calloutOrigin: calloutOrigin, className: css(fullScreen && "absolute-fill"), contentClassName: css("bolt-bubble-callout", (fadingOut || newPosition) && "fade-out", _this.getBeakClassName(anchorOrigin, calloutOrigin), fullScreen ? "bolt-bubble-fullscreen absolute-fill flex-grow scroll-auto" : "relative"), contentShadow: true, escDismiss: true, fixedLayout: true, focuszoneProps: {
                    circularNavigation: true,
                    defaultActiveElement: _this.props.defaultActiveElement || ".bolt-bubble-focusable-element",
                    focusOnMount: true,
                    handleTabKey: true,
                    includeDefaults: true,
                    postprocessKeyStroke: function (event) {
                        // We want to prevent moving outside the bubble if there are no focusable elements in the bubble.
                        event.which === KeyCode.tab && event.preventDefault();
                        return FocusZoneKeyStroke.IgnoreParents;
                    }
                }, onAnimationEnd: _this.onAnimationEnd, onDismiss: _this.dismiss, updateLayout: true, viewportChangeDismiss: false },
                React.createElement("div", { "aria-live": "polite", "aria-relevant": "text", className: "bolt-bubble-container" },
                    !fullScreen && React.createElement("div", { className: "bolt-bubble-beak depth-8" }),
                    React.createElement("div", { className: "bolt-bubble-content relative scroll-auto", style: { maxHeight: maxHeight } },
                        React.createElement("div", { className: "bolt-bubble-focusable-element no-outline", tabIndex: -1 }),
                        children))));
        }));
    };
    return CustomTeachingBubble;
}(React.Component));
export { CustomTeachingBubble };
