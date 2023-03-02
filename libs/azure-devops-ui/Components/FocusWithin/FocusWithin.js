import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
var FocusWithinContext = React.createContext({});
var FocusWithin = /** @class */ (function (_super) {
    __extends(FocusWithin, _super);
    function FocusWithin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blurTimeout = -1;
        _this.focusCount = 0;
        _this.focus = false;
        /**
         * onBlur method that should be attached to the onBlur handler of the
         * continers root element.
         */
        _this.onBlur = function () {
            // Don't let the focus count go below 0.
            // We have seen cases where we get a blur event, even when we
            // do not have focus. One such example is the Office Fabric TrapZone,
            // which will lose focus, then regain focus and stop propagation on
            // the event.
            _this.focusCount = Math.max(0, _this.focusCount - 1);
            // Clear any previous timeout if we somehow got a second blur event before
            // ever processing the timeout from the first one.
            if (_this.blurTimeout !== -1) {
                window.clearTimeout(_this.blurTimeout);
            }
            // We must delay the blur processing for two basic reasons:
            // 1) If focus is transitioning to a child element we will fire a Blur
            //  followed quickly by a Focus even though focus never left the element.
            //  This causes problems for things like menus that close on loss of focus.
            // 2) IE 11 fires the blur before the focus (no other browser does this)
            //  and this causes the same issue above but also causes focusCount
            //  inconsistencies.
            _this.blurTimeout = window.setTimeout(function () {
                _this.blurTimeout = -1;
                if (!_this.focusCount) {
                    _this.focus = false;
                    // If we are tracking the focus state we will force a component update.
                    if (_this.props.updateStateOnFocusChange) {
                        _this.forceUpdate();
                    }
                    if (_this.props.onBlur) {
                        _this.props.onBlur();
                    }
                }
            }, 0);
        };
        /**
         * onFocus method that should be attached to the onFocus handler of the
         * continer's root element.
         */
        _this.onFocus = function (event) {
            _this.focusCount++;
            // If focus is just entering one of the child components and not just moving
            // one child to another we will call the onFocus delegate if supplied.
            if (!_this.focus) {
                _this.focus = true;
                // If we are tracking the focus state we will force a component update.
                if (_this.props.updateStateOnFocusChange) {
                    _this.forceUpdate();
                }
                if (_this.props.onFocus) {
                    _this.props.onFocus(event);
                }
            }
        };
        return _this;
    }
    FocusWithin.prototype.render = function () {
        var _this = this;
        return (React.createElement(FocusWithinContext.Consumer, null, function (focusWithinContext) {
            var children;
            var newProps = {
                onBlur: _this.onBlur,
                onFocus: _this.onFocus
            };
            // Save ou parent focus within for potential communication.
            _this.parentFocusWithin = focusWithinContext.focusWithin;
            if (typeof _this.props.children === "function") {
                var child = _this.props.children;
                // For functional components we pass the hasFocus attribute as well.
                newProps.hasFocus = _this.focus;
                children = child(newProps);
            }
            else {
                var child = React.Children.only(_this.props.children);
                children = React.cloneElement(child, __assign(__assign({}, child.props), newProps), child.props.children);
            }
            return React.createElement(FocusWithinContext.Provider, { value: { focusWithin: _this } }, children);
        }));
    };
    /**
     * componentWillUnmount is used to cleanup the component state.
     *
     * @NOTE: The main thing we need to deal with is when this component is unmounted
     * while it has focus. We need to get this FocusWithin and all of its parents state
     * updated since focus will move directly to the body without a blur event.
     */
    FocusWithin.prototype.componentWillUnmount = function () {
        if (this.blurTimeout !== -1) {
            window.clearTimeout(this.blurTimeout);
            this.blurTimeout = -1;
        }
        if (this.focusCount > 0) {
            this.unmountWithFocus(false);
        }
    };
    /**
     * hasFocus returns true if the focus is contained within the focus component
     * hierarchy. This includes portals, the element may or may not
     * be a direct descendant of the focus component in the DOM structure.
     */
    FocusWithin.prototype.hasFocus = function () {
        return this.focusCount > 0;
    };
    /**
     * When the focusWithin unmounts we need to determine if we currently have focus.
     * If we do, focus will be moved silently to the body. We need to cleanup the
     * focusWithin's that are affected by this silent change.
     */
    FocusWithin.prototype.unmountWithFocus = function (fromParent) {
        if (this.focusCount > 0) {
            this.focusCount--;
            if (this.focusCount > 0) {
                // If we are tracking the focus state we will force a component update.
                if (fromParent) {
                    this.focusCount = 0;
                    this.focus = false;
                    if (this.props.updateStateOnFocusChange) {
                        this.forceUpdate();
                    }
                    if (this.props.onBlur) {
                        this.props.onBlur();
                    }
                }
            }
            // Notify the parent focus within that the mounted focus component is unmounting.
            if (this.parentFocusWithin) {
                this.parentFocusWithin.unmountWithFocus(true);
            }
        }
    };
    FocusWithin.defaultProps = {
        updateStateOnFocusChange: true
    };
    return FocusWithin;
}(React.Component));
export { FocusWithin };
