import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { isFunctionalChildren } from '../../Util';
var MouseWithin = /** @class */ (function (_super) {
    __extends(MouseWithin, _super);
    function MouseWithin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enterTimeout = 0;
        _this.delayTimeout = 0;
        _this.mouse = false;
        /**
         * onMouseEnter method that should be attached to the onMouseEnter handler of the
         * continer's root element.
         */
        _this.onMouseEnter = function (event) {
            // If the mouse is just entering one of the child components and not just moving
            // from one child to another we will call the onMouseEnter delegate if supplied.
            if (!_this.mouse) {
                _this.mouse = true;
                // Clear any pending leave if we have left and re-entered the component during
                // the leaveTimeout.
                if (_this.delayTimeout) {
                    window.clearTimeout(_this.delayTimeout);
                    _this.delayTimeout = 0;
                }
                if (_this.props.enterDelay) {
                    event.persist();
                    // persist does not preserve the currentTarget so we do that manually
                    var currentTarget_1 = event.currentTarget;
                    _this.enterTimeout = window.setTimeout(function () {
                        _this.enterTimeout = 0;
                        var newCurrentTarget = event.currentTarget;
                        event.currentTarget = currentTarget_1;
                        _this.mouseEntered(event);
                        event.currentTarget = newCurrentTarget;
                    }, _this.props.enterDelay);
                }
                else {
                    _this.mouseEntered(event);
                }
            }
        };
        /**
         * onMouseLeave method that should be attached to the onMouseLeave handler of the
         * container's root element.
         */
        _this.onMouseLeave = function (event) {
            if (_this.mouse) {
                _this.mouse = false;
                // Clear any pending enterTimeout if we didnt stay over the element long enough.
                if (_this.enterTimeout) {
                    window.clearTimeout(_this.enterTimeout);
                    _this.enterTimeout = 0;
                }
                if (_this.props.leaveDelay) {
                    event.persist();
                    _this.delayTimeout = window.setTimeout(function () {
                        _this.delayTimeout = 0;
                        _this.mouseLeft(event);
                    }, _this.props.leaveDelay);
                }
                else {
                    _this.mouseLeft(event);
                }
            }
        };
        return _this;
    }
    MouseWithin.prototype.render = function () {
        var newProps = {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
        };
        if (isFunctionalChildren(this.props.children)) {
            var child = this.props.children;
            // For functional components we pass the hasMouse attribute as well.
            newProps.hasMouse = this.mouse;
            return child(newProps);
        }
        else {
            var child = React.Children.only(this.props.children);
            return React.cloneElement(child, __assign(__assign({}, child.props), newProps), child.props.children);
        }
    };
    MouseWithin.prototype.componentWillUnmount = function () {
        if (this.enterTimeout) {
            window.clearTimeout(this.enterTimeout);
        }
        if (this.delayTimeout) {
            window.clearTimeout(this.delayTimeout);
        }
    };
    /**
     * hasMouse returns true if the mouse is contained within the component
     * hierarchy. This includes portals, the element may or may not
     * be a direct descendant of the component in the DOM structure.
     */
    MouseWithin.prototype.hasMouse = function () {
        return this.mouse;
    };
    MouseWithin.prototype.mouseEntered = function (event) {
        // If we are tracking the mouse state we will force a component update.
        if (this.props.updateStateOnMouseChange) {
            this.forceUpdate();
        }
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(event);
        }
    };
    MouseWithin.prototype.mouseLeft = function (event) {
        // If we are tracking the mouse state we will force a component update.
        if (this.props.updateStateOnMouseChange) {
            this.forceUpdate();
        }
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(event);
        }
    };
    MouseWithin.defaultProps = {
        updateStateOnMouseChange: true
    };
    return MouseWithin;
}(React.Component));
export { MouseWithin };
