import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Sizer.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { Observer } from '../../Observer';
import { Portal } from '../../Portal';
import { css, KeyCode, Mouse } from '../../Util';
import { Orientation, Position } from "./Sizer.Props";
import { announce } from '../../Core/Util/Accessibility';
import * as Resources from '../../Resources.Widgets';
import { format } from '../../Core/Util/String';
var Sizer = /** @class */ (function (_super) {
    __extends(Sizer, _super);
    function Sizer(props) {
        var _this = _super.call(this, props) || this;
        _this.lastLocation = -1;
        _this.timerManagement = new TimerManagement();
        _this.state = { showPortal: false };
        _this.onDragStart = function (event) {
            // Prevent default to stop the ColumnDragDropBehavior from trying to handle this event.
            event.preventDefault();
        };
        _this.onMouseCapture = function (event) {
            // Recompute the size and update the lastLocation based on the amount changed.
            _this.lastLocation += _this.updateSize(event, _this.getMouseLocation(event) - _this.lastLocation);
            // Remove the portal now that we are no longer sizing.
            if (event.type === "mouseup") {
                _this.setState({ showPortal: false });
                // If the user wanted to know when the sizing was complete, we will notify
                // the now that sizing is complete.
                _this.onSizeEnd();
            }
        };
        _this.onKeyDown = function (event) {
            var _a;
            if (!event.defaultPrevented) {
                var orientation_1 = _this.props.orientation;
                var sizeChange = void 0;
                if (orientation_1 === Orientation.row) {
                    if (event.which === KeyCode.enter) {
                        var focuselt = _this.props.getFocusedElement(event);
                        (_a = focuselt === null || focuselt === void 0 ? void 0 : focuselt.current) === null || _a === void 0 ? void 0 : _a.focus();
                    }
                    if (event.which === KeyCode.leftArrow) {
                        sizeChange = _this.updateSize(event.nativeEvent, -1);
                    }
                    else if (event.which === KeyCode.rightArrow) {
                        sizeChange = _this.updateSize(event.nativeEvent, 1);
                    }
                }
                else {
                    if (event.which === KeyCode.upArrow) {
                        sizeChange = _this.updateSize(event.nativeEvent, -1);
                    }
                    else if (event.which === KeyCode.downArrow) {
                        sizeChange = _this.updateSize(event.nativeEvent, 1);
                    }
                }
                // If we changed the size, we will prevent the default and start a
                // timer to end the sizing operation. Since there is no gesture to
                // start and complete with the keyboard.
                if (sizeChange) {
                    event.preventDefault();
                    _this.debouncedEnd();
                }
            }
        };
        _this.onSizeEnd = function () {
            if (_this.props.onSizeEnd) {
                _this.props.onSizeEnd(_this.props.id);
            }
        };
        _this.onMouseDown = function (event) {
            if (!event.defaultPrevented) {
                _this.lastLocation = _this.getMouseLocation(event.nativeEvent);
                // Capture the mouse, this will let us size the column even when the mouse moves
                // outside our element.
                Mouse.setCapture(_this.onMouseCapture);
                // Show the portal that keeps our sizing actions for effecting the other elements.
                _this.setState({ showPortal: true });
                // Don't let the event set focus or start a mouse selection.
                event.preventDefault();
            }
        };
        _this.onFocus = function (event) {
            announce(format(Resources.SizerLabel, _this.props.size, _this.props.minSize, _this.props.maxSize), true);
        };
        _this.debouncedEnd = _this.timerManagement.debounce(_this.onSizeEnd, 500, { trailing: true });
        return _this;
    }
    Sizer.prototype.render = function () {
        var divider = this.props.divider;
        return (React.createElement("div", { "aria-label": this.props.ariaLabel, "aria-valuemin": this.props.minSize, "aria-valuemax": this.props.maxSize, "aria-valuenow": ObservableLike.getValue(this.props.size), className: css(this.props.className, "bolt-sizer", this.props.orientation === Orientation.row ? "bolt-sizer-row flex-row" : "bolt-sizer-column flex-column", divider && "divider"), id: this.props.id, onKeyDown: this.onKeyDown, onMouseDown: this.onMouseDown, onDragStart: this.onDragStart, role: "separator", tabIndex: this.props.tabIndex, onFocus: this.onFocus }, this.state.showPortal && (React.createElement(Portal, { className: css("bolt-sizer-portal", this.props.orientation === Orientation.row ? "bolt-sizer-portal-row" : "bolt-sizer-portal-column") },
            React.createElement("div", null)))));
    };
    Sizer.prototype.componentWillUnmount = function () {
        Mouse.releaseCapture(this.onMouseCapture);
        this.timerManagement.dispose();
    };
    Sizer.prototype.getMouseLocation = function (event) {
        return this.props.orientation === Orientation.row ? event.pageX : event.pageY;
    };
    Sizer.prototype.updateSize = function (event, sizeChange) {
        // Compute the udpated size of the Sized element.
        var currentSize = ObservableLike.getValue(this.props.size);
        var multiplier = this.props.position === Position.far ? -1 : 1;
        var updatedSize = Math.floor(Math.min(this.props.maxSize, Math.max(this.props.minSize, currentSize + sizeChange * multiplier)));
        // Notify the caller of the updated size.
        this.props.onSize(event, updatedSize, this.props.id);
        announce(format(Resources.SizerValueChanged, updatedSize), true);
        // console.log("currentSize = " + currentSize + " updateSize = " + updatedSize);
        return (updatedSize - currentSize) * multiplier;
    };
    Sizer.defaultProps = {
        divider: true,
        maxSize: 10000,
        minSize: 100
    };
    return Sizer;
}(React.Component));
export { Sizer };
/**
 * The Sized function is used to produce a div that has a fixed width or height
 * based on the orientation of the sized props. This is a basic component that
 * can be used with the Sizer to produce a basic splitter like UI.
 *
 * @param props properties to render the appropriate container element given the
 * props.
 */
export function Sized(props) {
    return (React.createElement(Observer, { height: props.height, width: props.width }, function (observedProps) {
        var style = {};
        // Add any specific height that has been defined.
        if (observedProps.height !== undefined) {
            style.height = observedProps.height + "px";
        }
        // Add any specific width that has been defined.
        if (observedProps.width !== undefined) {
            style.width = observedProps.width + "px";
        }
        return (React.createElement("div", { className: css(props.className, "flex-noshrink"), style: style }, props.children));
    }));
}
