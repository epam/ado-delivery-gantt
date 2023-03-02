import { __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { EventManagement } from '../../Core/EventManagement';
import { TimerManagement } from '../../Core/TimerManagement';
import { css } from '../../Util';
var ResizeDelayMs = 100;
var ResponsiveViewport = /** @class */ (function (_super) {
    __extends(ResponsiveViewport, _super);
    function ResponsiveViewport(props) {
        var _this = _super.call(this, props) || this;
        _this._onAsyncResize = function () {
            _this._resize();
        };
        _this._resolveElement = function (element) {
            _this._element = element;
        };
        var initialWidth = props.initialWidth;
        _this.events = new EventManagement();
        _this.timers = new TimerManagement();
        _this.state = {
            activeBreakpoints: initialWidth == null ? [] : _this._getActiveBreakpoints(initialWidth)
        };
        _this._onAsyncResize = _this.timers.throttle(_this._onAsyncResize, ResizeDelayMs, {
            leading: false
        });
        return _this;
    }
    ResponsiveViewport.prototype.componentDidMount = function () {
        this.events.addEventListener(window, "resize", this._onAsyncResize);
        // React to initial width
        this._onAsyncResize();
    };
    ResponsiveViewport.prototype.componentWillUnmount = function () {
        this.events.removeAllListeners();
        this.timers.dispose();
    };
    ResponsiveViewport.prototype.shouldComponentUpdate = function (newProps, newState) {
        if (this.props !== newProps) {
            return true;
        }
        var newBreakPoints = newState.activeBreakpoints;
        var oldBreakPoints = this.state.activeBreakpoints;
        return newBreakPoints.length !== oldBreakPoints.length || newBreakPoints.some(function (b, idx) { return b !== oldBreakPoints[idx]; });
    };
    ResponsiveViewport.prototype.render = function () {
        var _a = this.props, _b = _a.tag, tag = _b === void 0 ? "div" : _b, className = _a.className, children = _a.children, onRenderContent = _a.onRenderContent;
        var activeBreakpoints = this.state.activeBreakpoints;
        var content = (onRenderContent && onRenderContent(activeBreakpoints)) || children;
        return React.createElement(tag, {
            className: css.apply(void 0, __spreadArrays([className], (activeBreakpoints && activeBreakpoints.map(function (x) { return x.className; })))),
            ref: this._resolveElement
        }, content);
    };
    ResponsiveViewport.prototype.measure = function () {
        this._resize();
    };
    ResponsiveViewport.prototype._resize = function () {
        var rect = this._element.getBoundingClientRect();
        var width = rect.width;
        this.setState({
            activeBreakpoints: this._getActiveBreakpoints(width)
        });
    };
    ResponsiveViewport.prototype._getActiveBreakpoints = function (width) {
        var breakPoints = this.props.breakPoints;
        return breakPoints.filter(function (bp) {
            if (bp.minWidth >= 0 && width < bp.minWidth) {
                return false;
            }
            if (bp.maxWidth >= 0 && width >= bp.maxWidth) {
                return false;
            }
            return true;
        });
    };
    return ResponsiveViewport;
}(React.Component));
export { ResponsiveViewport };
