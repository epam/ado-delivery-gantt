import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Splitter.css";
import * as React from "react";
import { EventManagement } from '../../Core/EventManagement';
import { ObservableLike, ObservableValue } from '../../Core/Observable';
import { announce } from '../../Core/Util/Accessibility';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Splitter';
import { css, getSafeId, KeyCode } from '../../Util';
import { SplitterDirection, SplitterElementPosition } from "../../Components/Splitter/Splitter.Props";
var DIVIDER_MOVE_INCREMENT = 20;
var DIVIDER_WIDTH = 4;
var COLLAPSED_PANE_SIZE = 38;
var idCount = 0;
var Splitter = /** @class */ (function (_super) {
    __extends(Splitter, _super);
    function Splitter(props, context) {
        var _this = _super.call(this, props, context) || this;
        // Cached children
        _this._cachedNearElement = null;
        _this._cachedFarElement = null;
        _this.events = new EventManagement();
        // Fixed size value used when in uncontrolled mode (when props.fixedSize is undefined)
        _this.uncontrolledFixedSize = new ObservableValue(undefined);
        _this.placeholderPosition = new ObservableValue(undefined);
        _this.collapse = function () {
            if (!_this.isCollapsed()) {
                _this.props.onCollapsedChanged && _this.props.onCollapsedChanged(true);
                announce(Resources.SplitterCollapsed);
            }
        };
        _this.expand = function () {
            if (_this.isCollapsed()) {
                _this.props.onCollapsedChanged && _this.props.onCollapsedChanged(false);
                announce(Resources.SplitterExpanded);
            }
        };
        /**
         *  Keyboard handler for the divider
         */
        _this._onDividerKeyDown = function (event) {
            var _a = _this.props, disabled = _a.disabled, splitterDirection = _a.splitterDirection;
            if (!disabled && !_this._isDragging()) {
                switch (event.keyCode) {
                    case KeyCode.leftArrow:
                        if (splitterDirection === SplitterDirection.Vertical) {
                            _this._moveDivider(-DIVIDER_MOVE_INCREMENT);
                        }
                        break;
                    case KeyCode.rightArrow:
                        if (splitterDirection === SplitterDirection.Vertical) {
                            _this._moveDivider(DIVIDER_MOVE_INCREMENT);
                        }
                        break;
                    case KeyCode.upArrow:
                        if (splitterDirection === SplitterDirection.Horizontal) {
                            _this._moveDivider(-DIVIDER_MOVE_INCREMENT);
                        }
                        break;
                    case KeyCode.downArrow:
                        if (splitterDirection === SplitterDirection.Horizontal) {
                            _this._moveDivider(DIVIDER_MOVE_INCREMENT);
                        }
                        break;
                    default:
                        return;
                }
                event.preventDefault();
                event.stopPropagation();
            }
        };
        /**
         * Fired when the user mouses down on the divider
         * If there is a fixed pane, records its initial size, and attaches mouse move and mouse up events to the window
         */
        _this._onDividerMouseDown = function (event) {
            _this._onDividerDown(event, event.clientX, event.clientY);
            _this._attachMouseWindowEvents();
        };
        /**
         * Fired when the user touches down on the divider
         * If there is a fixed pane, records its initial size, and attaches mouse move and mouse up events to the window
         */
        _this._onDividerTouchDown = function (event) {
            if (event.touches.length === 1) {
                _this._onDividerDown(event, event.touches[0].clientX, event.touches[0].clientY);
                _this._attachTouchWindowEvents();
            }
        };
        _this._onDividerDown = function (event, xPos, yPos) {
            if (_this._fixedRef && !_this.props.disabled) {
                event.preventDefault();
                event.stopPropagation();
                _this._dragAnchorPos = _this._getEventBoundedClientPos(xPos, yPos);
                _this._previousFixedSize = _this._getElementSize(_this._fixedRef);
                if (_this.placeholderPosition.value !== undefined) {
                    _this.placeholderPosition.value = undefined;
                }
                _this._handleDragEvent(event, xPos, yPos);
            }
        };
        /**
         * Fired when the user moves their mouse, after having moused down on the divider
         * Computes the new location of the placeholder
         * @param event
         */
        _this._onDividerMouseMove = function (event) {
            _this._handleDragEvent(event, event.clientX, event.clientY);
        };
        /**
         * Fired when the user moves their mouse, after having moused down on the divider
         * Computes the new location of the placeholder
         * @param event
         */
        _this._onDividerTouchMove = function (event) {
            if (event.touches.length === 1) {
                _this._handleDragEvent(event, event.touches[0].clientX, event.touches[0].clientY);
            }
        };
        /**
         * Fired when the user releases their mouse, after having moused down on the divider
         * Updates the size of the fixed pane, and stops the drag
         * Removes window events
         */
        _this._onDividerMouseUp = function (event) {
            _this._detachMouseWindowEvents();
            _this._onDividerEnd(event.clientX, event.clientY);
        };
        /**
         * Fired when the user releases their touch, after having touched down on the divider
         * Updates the size of the fixed pane, and stops the drag
         * Removes window events
         */
        _this._onDividerTouchEnd = function (event) {
            _this._detachTouchWindowEvents();
            _this._onDividerEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        };
        _this._onDividerEnd = function (xPos, yPos) {
            var boundedClientPos = _this._getEventBoundedClientPos(xPos, yPos);
            var newSize = _this._getNewFixedSize(_this._previousFixedSize, boundedClientPos - _this._dragAnchorPos);
            _this.placeholderPosition.value = undefined;
            _this._setFixedSize(newSize);
            _this._fireWindowResize();
        };
        _this.uncontrolledFixedSize.value = props.initialFixedSize;
        _this.fixedPaneId = "splitter-fixed-pane" + idCount++;
        return _this;
    }
    Splitter.prototype.componentDidMount = function () {
        this._fireWindowResize();
    };
    Splitter.prototype.componentWillUnmount = function () {
        this.events.removeAllListeners();
    };
    Splitter.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, collapsed = _a.collapsed, fixedElement = _a.fixedElement, maxFixedSize = _a.maxFixedSize, minFixedSize = _a.minFixedSize, onRenderFarElement = _a.onRenderFarElement, onRenderNearElement = _a.onRenderNearElement, splitterDirection = _a.splitterDirection;
        var showDivider = fixedElement === SplitterElementPosition.Near ? !!onRenderNearElement : !!onRenderFarElement;
        return (React.createElement(Observer, { collapsed: collapsed, fixedSize: this.props.fixedSize === undefined ? this.uncontrolledFixedSize : this.props.fixedSize, placeholderPosition: this.placeholderPosition }, function (props) {
            var fixedSize;
            if (props.collapsed) {
                fixedSize = COLLAPSED_PANE_SIZE;
            }
            else if (props.fixedSize) {
                fixedSize = Math.max(props.fixedSize, minFixedSize || 0);
                var max = maxFixedSize;
                if (!max && _this._splitterContainer) {
                    max = _this._getElementSize(_this._splitterContainer);
                }
                if (max && fixedSize > max) {
                    fixedSize = max;
                }
            }
            else {
                if (minFixedSize !== undefined) {
                    fixedSize = minFixedSize;
                }
                else if (maxFixedSize !== undefined) {
                    fixedSize = maxFixedSize;
                }
            }
            return (React.createElement("div", { className: css(className, "vss-Splitter--container", splitterDirection === SplitterDirection.Vertical && "vss-Splitter--container-row", splitterDirection === SplitterDirection.Horizontal && "vss-Splitter--container-column", _this._isDragging() && "vss-Splitter--container-dragging"), ref: function (splitterContainer) { return (_this._splitterContainer = splitterContainer); } },
                _this._renderNearElement(fixedSize),
                showDivider ? _this._renderDivider(fixedSize) : null,
                _this._renderDragPlaceHolder(),
                _this._renderFarElement(fixedSize)));
        }));
    };
    /**
     *  Renders the first child
     */
    Splitter.prototype._renderNearElement = function (fixedSize) {
        var _a = this.props, fixedElement = _a.fixedElement, onRenderNearElement = _a.onRenderNearElement, nearElementClassName = _a.nearElementClassName;
        if (!this._isDragging() || !this._cachedNearElement) {
            if (onRenderNearElement) {
                var content = onRenderNearElement();
                this._cachedNearElement =
                    fixedElement === SplitterElementPosition.Near
                        ? this._renderFixedPane(content, nearElementClassName, fixedSize)
                        : this._renderFlexiblePane(content, nearElementClassName);
            }
            else {
                this._cachedNearElement = null;
            }
        }
        return this._cachedNearElement;
    };
    /**
     *  Renders the last child. If there are 0-1 children, will render a flexible pane
     */
    Splitter.prototype._renderFarElement = function (fixedSize) {
        var _a = this.props, fixedElement = _a.fixedElement, onRenderFarElement = _a.onRenderFarElement, farElementClassName = _a.farElementClassName;
        if (!this._isDragging() || !this._cachedFarElement) {
            if (onRenderFarElement) {
                var content = onRenderFarElement();
                this._cachedFarElement =
                    fixedElement === SplitterElementPosition.Far
                        ? this._renderFixedPane(content, farElementClassName, fixedSize)
                        : this._renderFlexiblePane(content, farElementClassName);
            }
            else {
                this._cachedFarElement = null;
            }
        }
        return this._cachedFarElement;
    };
    /**
     *  Render the fixed pane, with size determined by state
     */
    Splitter.prototype._renderFixedPane = function (content, className, fixedSize) {
        var _a;
        var _this = this;
        var _b = this.props, expandTooltip = _b.expandTooltip, splitterDirection = _b.splitterDirection;
        var collapsed = this.isCollapsed();
        var styleName = splitterDirection === SplitterDirection.Vertical ? "width" : "height";
        var dividerStyle = (_a = {},
            _a[styleName] = fixedSize === undefined ? "50%" : fixedSize,
            _a);
        return content ? (React.createElement("div", { className: css("vss-Splitter--pane-fixed", collapsed ? "flex-column collapsed" : className), id: getSafeId(this.fixedPaneId), style: dividerStyle, ref: function (fixedRef) { return (_this._fixedRef = fixedRef); } }, collapsed ? (React.createElement(Button, { className: "vss-splitter-expand-button", iconProps: { iconName: this.getCollapsedButtonIconName() }, onClick: this.expand, subtle: true, tooltipProps: { text: expandTooltip || Resources.ExpandTooltip } })) : (content))) : null;
    };
    Splitter.prototype.getCollapsedButtonIconName = function () {
        var farSideFixed = this.props.fixedElement === SplitterElementPosition.Far;
        if (this.props.splitterDirection === SplitterDirection.Vertical) {
            return farSideFixed ? "DoubleChevronLeft" : "DoubleChevronRight";
        }
        else {
            return farSideFixed ? "DoubleChevronUp" : "DoubleChevronDown";
        }
    };
    /**
     *  Render the flexible pane
     */
    Splitter.prototype._renderFlexiblePane = function (content, className) {
        return React.createElement("div", { className: css("vss-Splitter--pane-flexible", className) }, content);
    };
    /**
     *  Render the divider
     */
    Splitter.prototype._renderDivider = function (fixedSize) {
        var _a = this._getSplitterBoundaries(), startBound = _a.startBound, endBound = _a.endBound;
        return (React.createElement("div", { "aria-valuemin": startBound, "aria-valuemax": endBound, "aria-label": this.props.ariaLabel, "aria-labelledby": this.props.ariaLabel ? undefined : this.props.ariaLabelledBy ? this.props.ariaLabelledBy : getSafeId(this.fixedPaneId), "aria-orientation": this.props.splitterDirection === SplitterDirection.Horizontal ? "horizontal" : "vertical", "aria-valuenow": fixedSize, "aria-valuetext": fixedSize ? format(Resources.SplitterValueText, fixedSize) : undefined, role: "separator", tabIndex: 0, className: css("vss-Splitter--divider", this._isDragging() && "vss-Splitter--divider-dragging"), onKeyDown: this._onDividerKeyDown, onMouseDown: this._onDividerMouseDown, onTouchStart: this._onDividerTouchDown }));
    };
    /**
     *  Render the placeholder if the user is dragging
     */
    Splitter.prototype._renderDragPlaceHolder = function () {
        var _a;
        if (this._isDragging()) {
            var styleName = this.props.splitterDirection === SplitterDirection.Vertical ? "left" : "top";
            var placeholderStyle = (_a = {},
                _a[styleName] = this.placeholderPosition.value,
                _a);
            return React.createElement("div", { className: "vss-Splitter--drag-placeholder", style: placeholderStyle });
        }
        else {
            return null;
        }
    };
    /**
     * Computes the new location of the placeholder based on the mouse event.
     * @param event
     */
    Splitter.prototype._handleDragEvent = function (event, xPos, yPos) {
        var fixedElement = this.props.fixedElement;
        event.preventDefault();
        event.stopPropagation();
        var boundedClientPos = this._getEventBoundedClientPos(xPos, yPos);
        var newFixedSize = this._getNewFixedSize(this._previousFixedSize, boundedClientPos - this._dragAnchorPos);
        var newSize = newFixedSize.collapsed ? 0 : newFixedSize.fixedSize;
        var newPlaceholderValue = fixedElement === SplitterElementPosition.Near ? newSize : this._getElementSize(this._splitterContainer) - newSize - DIVIDER_WIDTH;
        if (newPlaceholderValue !== this.placeholderPosition.value) {
            this.placeholderPosition.value = newPlaceholderValue;
        }
    };
    Splitter.prototype._setFixedSize = function (newFixedSize) {
        var onFixedSizeChanged = this.props.onFixedSizeChanged;
        if (newFixedSize.collapsed) {
            this.collapse();
            return;
        }
        var fixedSize = newFixedSize.fixedSize;
        this.uncontrolledFixedSize.value = fixedSize;
        if (onFixedSizeChanged) {
            onFixedSizeChanged(fixedSize);
        }
        if (this.isCollapsed()) {
            this.expand();
        }
    };
    /**
     * Move the divider in a near or far direction
     * @param direction The Direction
     */
    Splitter.prototype._moveDivider = function (delta) {
        var currentSize = this._getElementSize(this._fixedRef);
        var newSize = this._getNewFixedSize(currentSize, delta);
        this._setFixedSize(newSize);
        this._fireWindowResize();
    };
    /** Attaches mouse events to the window */
    Splitter.prototype._attachMouseWindowEvents = function () {
        this.events.addEventListener(window, "mousemove", this._onDividerMouseMove);
        this.events.addEventListener(window, "mouseup", this._onDividerMouseUp);
    };
    /** Detaches mouse events to the window */
    Splitter.prototype._detachMouseWindowEvents = function () {
        this.events.removeEventListener(window, "mousemove", this._onDividerMouseMove);
        this.events.removeEventListener(window, "mouseup", this._onDividerMouseUp);
    };
    /** Attaches touch events to the window */
    Splitter.prototype._attachTouchWindowEvents = function () {
        this.events.addEventListener(window, "touchmove", this._onDividerTouchMove);
        this.events.addEventListener(window, "touchend", this._onDividerTouchEnd);
    };
    /** Detaches touch events to the window */
    Splitter.prototype._detachTouchWindowEvents = function () {
        this.events.removeEventListener(window, "touchmove", this._onDividerTouchMove);
        this.events.removeEventListener(window, "touchend", this._onDividerTouchEnd);
    };
    /**
     * Get a X/Y position of a mouse event, relative to the splitter container and depending on the splitter direction
     * The position will be bounded within the splitter container and the min/max widths of the fixed panel
     * @param event
     */
    Splitter.prototype._getEventBoundedClientPos = function (xPos, yPos) {
        var splitterDirection = this.props.splitterDirection;
        var clientPos;
        switch (splitterDirection) {
            case SplitterDirection.Vertical:
                clientPos = xPos;
                break;
            case SplitterDirection.Horizontal:
                clientPos = yPos;
                break;
            default:
                clientPos = 0;
        }
        return this._getBoundedClientPos(clientPos);
    };
    /**
     * Given a position relative to the window, get a position relative to the splitter container and depending on the splitter direction
     * The position will be bounded within the splitter container and the min/max widths of the fixed panel
     * @param clientPos The position relative to the window
     * @param props The props to use
     */
    Splitter.prototype._getBoundedClientPos = function (clientPos) {
        var _a = this._getSplitterBoundaries(!!this.props.onCollapsedChanged), startBound = _a.startBound, endBound = _a.endBound;
        var boundedClientPos = Math.max(
        // Smallest allowed client pos start
        startBound, 
        // Largest allowed client pos end
        Math.min(clientPos, endBound));
        // Adjust relative to the container
        return boundedClientPos - this._getElementStartPos(this._splitterContainer);
    };
    /**
     * Compute the allowable pixel value bounds for the splitter
     * @param props The props to use
     */
    Splitter.prototype._getSplitterBoundaries = function (ignoreMinFixedSize) {
        if (ignoreMinFixedSize === void 0) { ignoreMinFixedSize = false; }
        var _a = this.props, fixedElement = _a.fixedElement, minFixedSize = _a.minFixedSize, maxFixedSize = _a.maxFixedSize;
        if (!this._splitterContainer) {
            return { startBound: 0, endBound: 0 };
        }
        if (ignoreMinFixedSize) {
            minFixedSize = 0;
        }
        var startPos = this._getElementStartPos(this._splitterContainer);
        var size = this._getElementSize(this._splitterContainer);
        var endPos = startPos + size;
        var startBound = fixedElement === SplitterElementPosition.Near
            ? minFixedSize
                ? startPos + minFixedSize
                : startPos
            : maxFixedSize
                ? endPos - maxFixedSize
                : startPos;
        var endBound = fixedElement === SplitterElementPosition.Near
            ? maxFixedSize
                ? startPos + maxFixedSize
                : endPos
            : minFixedSize
                ? endPos - minFixedSize
                : endPos;
        return { startBound: startBound, endBound: endBound };
    };
    /**
     * Gets a new width from the initial size, a delta, and splitter props
     *
     * @param initialSize The initial width
     * @param delta The new position minus the drag anchor
     * @param props The splitter props to use
     */
    Splitter.prototype._getNewFixedSize = function (initialSize, delta) {
        var _a = this.props, fixedElement = _a.fixedElement, maxFixedSize = _a.maxFixedSize, _b = _a.minFixedSize, minFixedSize = _b === void 0 ? 0 : _b, onCollapsedChanged = _a.onCollapsedChanged;
        if (maxFixedSize === undefined) {
            maxFixedSize = this._getElementSize(this._splitterContainer);
        }
        var posDiff = delta;
        if (fixedElement === SplitterElementPosition.Far) {
            posDiff *= -1;
        }
        var fixedSize = initialSize + posDiff;
        if (fixedSize > maxFixedSize) {
            fixedSize = maxFixedSize;
        }
        var collapsed = this.isCollapsed();
        if (onCollapsedChanged) {
            collapsed = fixedSize < COLLAPSED_PANE_SIZE || (!this.isCollapsed() && fixedSize < minFixedSize);
        }
        if (fixedSize < minFixedSize) {
            fixedSize = minFixedSize;
        }
        return { fixedSize: fixedSize, collapsed: collapsed };
    };
    Splitter.prototype.isCollapsed = function () {
        return !!ObservableLike.getValue(this.props.collapsed);
    };
    /**
     * Indicates if a drag operation is in process
     */
    Splitter.prototype._isDragging = function () {
        return this.placeholderPosition.value !== undefined;
    };
    /**
     * Get the size (width or height) of an element, based on the splitter direction
     * @param element The element
     */
    Splitter.prototype._getElementSize = function (element) {
        return this.props.splitterDirection === SplitterDirection.Vertical ? element.clientWidth : element.clientHeight;
    };
    /**
     * Get the start position (left or top) of an element, based on the splitter direction
     * @param element The element
     */
    Splitter.prototype._getElementStartPos = function (element) {
        var boundingRect = element.getBoundingClientRect();
        return this.props.splitterDirection === SplitterDirection.Vertical ? boundingRect.left : boundingRect.top;
    };
    Splitter.prototype._fireWindowResize = function () {
        var event = document.createEvent("Event");
        event.initEvent("resize", false, true);
        window.dispatchEvent(event);
    };
    Splitter.defaultProps = {
        fixedElement: SplitterElementPosition.Far,
        splitterDirection: SplitterDirection.Vertical
    };
    return Splitter;
}(React.Component));
export { Splitter };
