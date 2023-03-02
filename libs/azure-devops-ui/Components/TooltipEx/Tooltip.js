import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tooltip.css";
import * as React from "react";
import { Callout } from '../../Callout';
import { FocusWithin } from '../../FocusWithin';
import { MouseWithin } from '../../MouseWithin';
import { css, getFocusVisible, getSafeId, KeyCode, Mouse } from '../../Util';
import { Location } from '../../Utilities/Position';
export var TooltipStatus;
(function (TooltipStatus) {
    TooltipStatus[TooltipStatus["hidden"] = 0] = "hidden";
    TooltipStatus[TooltipStatus["visible"] = 1] = "visible";
    TooltipStatus[TooltipStatus["fadingout"] = 2] = "fadingout";
})(TooltipStatus || (TooltipStatus = {}));
var tooltipId = 1;
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip(props) {
        var _this = _super.call(this, props) || this;
        _this.contentRef = React.createRef();
        _this.tooltipId = "tooltip-" + tooltipId++;
        _this.focus = false;
        _this.mouse = false;
        _this.showTooltip = function (event) {
            var anchorElement = event.currentTarget;
            if (_this.shouldShowTooltip(anchorElement)) {
                // If no anchorOrigin was specified use the Mouse.position when we show the toolip.
                var anchorPoint = void 0;
                if (!_this.props.anchorOrigin) {
                    anchorPoint = Mouse.position;
                }
                _this.mouse = true;
                document.addEventListener("keydown", _this.onKeyDown);
                _this.setState({
                    anchorElement: anchorElement,
                    anchorOffset: { horizontal: 8, vertical: 8 },
                    anchorOrigin: { horizontal: Location.center, vertical: Location.end },
                    anchorPoint: anchorPoint,
                    innerText: _this.props.overflowOnly && !_this.props.text ? anchorElement.innerText : undefined,
                    tooltipStatus: TooltipStatus.visible,
                    tooltipOrigin: { horizontal: Location.start, vertical: Location.start }
                });
            }
        };
        _this.closeTooltip = function () {
            if (!(_this.focus && getFocusVisible()) && _this.state.tooltipStatus === TooltipStatus.visible) {
                _this.mouse = false;
                document.removeEventListener("keydown", _this.onKeyDown);
                _this.setState({ tooltipStatus: _this.getDismissStatus() });
            }
        };
        _this.onKeyDown = function (event) {
            var _a;
            if (event.which === KeyCode.escape && _this.state.tooltipStatus === TooltipStatus.visible) {
                _this.closeTooltip();
            }
            if (event.which === KeyCode.ctrl && _this.state.tooltipStatus === TooltipStatus.visible) {
                var container = _this.contentRef.current;
                var selectionNode = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode;
                var hasSelectionInTooltip = container && selectionNode && container.contains(selectionNode);
                // Ctrl keystroke anywhere will dismiss the callout as per MAS 1.4.13,
                // except if user has selected something inside, in which case we allow Ctrl-C.
                if (!hasSelectionInTooltip) {
                    _this.closeTooltip();
                }
            }
        };
        _this.onAnimationEnd = function () {
            if (_this.state.tooltipStatus === TooltipStatus.fadingout) {
                _this.setState({
                    tooltipStatus: TooltipStatus.hidden
                });
            }
        };
        _this.getDismissStatus = function () {
            return _this.props.disabled ? TooltipStatus.hidden : TooltipStatus.fadingout;
        };
        _this.shouldShowTooltip = function (anchorElement) {
            if (_this.state.tooltipStatus !== TooltipStatus.hidden) {
                return false;
            }
            // If the tooltip only appears when the anchorElement overflows its parent then
            // we need to check on mouse enter.
            if (_this.props.overflowOnly && !_this.overflowDetected(anchorElement)) {
                return false;
            }
            // Dont show the tooltip if there is not content to show.
            if (!(_this.props.text || _this.props.renderContent || (anchorElement.innerText && _this.props.overflowOnly))) {
                return false;
            }
            return !_this.props.disabled;
        };
        _this.overflowDetected = props.overflowDetected || overflowDetected;
        _this.state = {
            tooltipStatus: TooltipStatus.hidden
        };
        return _this;
    }
    Tooltip.prototype.render = function () {
        var _this = this;
        return (React.createElement(MouseWithin, { leaveDelay: 50, enterDelay: this.props.delayMs, onMouseLeave: this.closeTooltip, onMouseEnter: this.showTooltip }, function (mouseWithinEvents) {
            var child = React.Children.only(_this.props.children);
            var id = _this.props.id || _this.tooltipId;
            var showTooltip = _this.state.tooltipStatus !== TooltipStatus.hidden && !_this.props.disabled && _this.state.anchorElement;
            // Save the existing events we will potentially proxy.
            var existingMouseEnter = child.props.onMouseEnter;
            var existingMouseLeave = child.props.onMouseLeave;
            var existingKeyDown = child.props.onKeyDown;
            var existingBlur;
            var existingFocus;
            var onMouseEnter = function (event) {
                if (mouseWithinEvents.onMouseEnter) {
                    mouseWithinEvents.onMouseEnter(event);
                }
                if (existingMouseEnter) {
                    existingMouseEnter(event);
                }
            };
            var onMouseLeave = function (event) {
                if (mouseWithinEvents.onMouseLeave) {
                    mouseWithinEvents.onMouseLeave(event);
                }
                if (existingMouseLeave) {
                    existingMouseLeave(event);
                }
            };
            var onKeyDown = function (event) {
                if (event.which === KeyCode.escape && showTooltip) {
                    _this.setState({ tooltipStatus: TooltipStatus.hidden });
                }
                if (existingKeyDown) {
                    existingKeyDown(event);
                }
            };
            // to not let consumers have to care about an implementation detail, wrap
            // the tooltip id in getSafeId and use that as the aria-describedBy property
            // on the child.
            var ariaDescribedById = _this.props.addAriaDescribedBy && _this.state.tooltipStatus !== TooltipStatus.hidden ? getSafeId(id) : undefined;
            var childProps = __assign(__assign({}, child.props), { onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onKeyDown: onKeyDown });
            if (childProps["aria-describedby"] === undefined) {
                childProps["aria-describedby"] = ariaDescribedById;
            }
            var clonedChild = React.cloneElement(child, childProps, child.props.children);
            // If this tooltip should become visible when focus is within the component add the focus tracking.
            if (_this.props.showOnFocus && (_this.props.text || _this.props.renderContent || _this.props.overflowOnly)) {
                existingBlur = child.props.onBlur;
                existingFocus = child.props.onFocus;
                var onBlur = function () {
                    _this.focus = false;
                    if (!_this.mouse) {
                        _this.closeTooltip();
                    }
                    if (existingBlur) {
                        existingBlur();
                    }
                };
                var onFocus = function (event) {
                    var anchorElement = event.currentTarget;
                    if (_this.shouldShowTooltip(anchorElement)) {
                        _this.focus = true;
                        getFocusVisible() &&
                            _this.setState({
                                anchorElement: event.target,
                                anchorOffset: { horizontal: 0, vertical: 8 },
                                anchorOrigin: { horizontal: Location.center, vertical: Location.end },
                                anchorPoint: undefined,
                                innerText: _this.props.overflowOnly && !_this.props.text ? anchorElement.innerText : undefined,
                                tooltipStatus: TooltipStatus.visible,
                                tooltipOrigin: { horizontal: Location.center, vertical: Location.start }
                            });
                    }
                    if (existingFocus) {
                        existingFocus(event);
                    }
                };
                clonedChild = (React.createElement(FocusWithin, { onBlur: onBlur, onFocus: onFocus, updateStateOnFocusChange: false }, clonedChild));
            }
            return (React.createElement(React.Fragment, null,
                clonedChild,
                showTooltip ? (React.createElement(Callout, { anchorElement: _this.state.anchorElement, anchorOffset: _this.props.anchorOffset || _this.state.anchorOffset, anchorOrigin: _this.props.anchorOrigin || _this.state.anchorOrigin, anchorPoint: _this.state.anchorPoint, calloutOrigin: _this.props.tooltipOrigin || _this.state.tooltipOrigin, className: css(_this.props.className, "bolt-tooltip", _this.state.tooltipStatus === TooltipStatus.fadingout && "bolt-tooltip-fade-out"), fixedLayout: _this.props.fixedLayout, id: id, key: id, onAnimationEnd: _this.onAnimationEnd, onMouseEnter: mouseWithinEvents.onMouseEnter, onMouseLeave: mouseWithinEvents.onMouseLeave, portalProps: { className: "bolt-tooltip-portal" }, contentRef: _this.contentRef, role: "tooltip" },
                    React.createElement("div", { className: "bolt-tooltip-content body-m" }, (_this.props.renderContent && _this.props.renderContent()) || _this.props.text || _this.state.innerText))) : null));
        }));
    };
    Tooltip.prototype.componentWillUnmount = function () {
        document.removeEventListener("keydown", this.onKeyDown);
    };
    Tooltip.defaultProps = {
        delayMs: 250,
        showOnFocus: true
    };
    return Tooltip;
}(React.Component));
export { Tooltip };
function overflowDetected(anchorElement) {
    return anchorElement.scrollWidth > Math.ceil(anchorElement.offsetWidth);
}
