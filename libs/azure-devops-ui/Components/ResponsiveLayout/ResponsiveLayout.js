import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { shimRef } from '../../Util';
import { ResponsiveOrientation } from "./ResponsiveLayout.Props";
/**
 * The ResponsiveLayout component is used to create a container that responds to
 * its size. Children of the layout container element will be shown or hidden
 * based on the amount of space available. The client creates the ResponsiveLayout
 * around the element that should be managed.
 *
 * The children of the layout container MUST map one element per child. This allows
 * the ResponsiveLayout to map visibility of the component to its relative DOM
 * element. The child MAY be a component and is not required to be a direct DOM
 * element. The child component MUST result in one root DOM element.
 */
var ResponsiveLayout = /** @class */ (function (_super) {
    __extends(ResponsiveLayout, _super);
    function ResponsiveLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Details about each of the children in the responsive layout.
         */
        _this.childDetails = [];
        /**
         * All components within the responsiveLayout MUST specific a unique key. The
         * key should follow the same rules as a standard React key. If the component
         * fundamentally changes the key should change along with it.
         */
        _this.childKeys = [];
        /**
         * ref to the container element used by the responsive layout. The direct children
         * are the elements that are responsive.
         */
        _this.containerRef = React.createRef();
        /**
         * Number of hidden components in the layout.
         */
        _this.hiddenCount = 0;
        /**
         * Timeout used to notify callers about changes to the visible elements.
         */
        _this.layoutTimeout = 0;
        _this.updateLayout = function () {
            var componentElement = _this.containerRef.current;
            if (componentElement && componentElement.children.length) {
                var hiddenCount = _this.hiddenCount;
                var componentClientRect = componentElement.getBoundingClientRect();
                var renderedSize = 0;
                var ignoredSize = 0;
                var initialPass = false;
                // If we dont have the child details computed, or the children have changed we need
                // to populate the child details.s
                // @NOTE: We need to be able to detect changes to children without the length changing.
                if (!_this.childDetails || componentElement.children.length !== _this.childDetails.length) {
                    _this.childDetails = [];
                    initialPass = true;
                }
                // We need to go through and compute the sizes of the child components.
                for (var componentIndex = 0; componentIndex < componentElement.children.length; componentIndex++) {
                    var clientRect = componentElement.children[componentIndex].getBoundingClientRect();
                    // If this is the initial pass we will create new adjust entries for this components
                    // otherwise we will just update the current state.
                    if (initialPass) {
                        _this.childDetails.push({ appliedSize: 0, clientRect: clientRect });
                    }
                    else {
                        _this.childDetails[componentIndex].clientRect = clientRect;
                    }
                    // Track ignored component sizes independently, this will help with rounding issues.
                    if (_this.props.ignoredChildren && _this.props.ignoredChildren.indexOf(componentIndex) >= 0) {
                        ignoredSize += _this.props.orientation === ResponsiveOrientation.Vertical ? clientRect.height : clientRect.width;
                    }
                }
                // The renderedSize is equal to the size from the end of the last component to the
                // start of the first component minus any ignored space.
                if (_this.props.orientation === ResponsiveOrientation.Vertical) {
                    renderedSize = Math.floor(_this.childDetails[_this.childDetails.length - 1].clientRect.bottom - _this.childDetails[0].clientRect.top);
                }
                else {
                    renderedSize = Math.floor(_this.childDetails[_this.childDetails.length - 1].clientRect.right - _this.childDetails[0].clientRect.left);
                }
                renderedSize -= Math.floor(ignoredSize);
                // If there is not enough space we will try to adjust items smaller first.
                var componentClientSize = Math.floor(_this.props.orientation === ResponsiveOrientation.Vertical ? componentClientRect.height : componentClientRect.width);
                if (componentClientSize <= renderedSize) {
                    var availableSpace = componentClientSize - renderedSize;
                    while (availableSpace < 0 && _this.hiddenCount < _this.props.responsiveChildren.length) {
                        var childIndex = _this.props.responsiveChildren[_this.hiddenCount];
                        var childDetail = _this.childDetails[childIndex];
                        // Determine how much space we will recoupe from this component.
                        var appliedSize = _this.props.orientation === ResponsiveOrientation.Vertical ? childDetail.clientRect.height : childDetail.clientRect.width;
                        // Apply the next adjustment to the child components.
                        availableSpace += appliedSize;
                        // Mark the child hidden and track how space we recouped from component.
                        childDetail.hidden = true;
                        childDetail.appliedSize = appliedSize;
                        // Move on to the next component if we need more space.
                        _this.hiddenCount++;
                        // console.log("Adjust (shrink), applied " + appliedSize + " from child " + childIndex);
                    }
                }
                // If we have availableSpace and there are adjusted items we should see if we can give
                // some back to items.
                else if (componentClientSize > renderedSize) {
                    var availableSpace = componentClientSize - renderedSize;
                    while (_this.hiddenCount > 0) {
                        var childIndex = _this.props.responsiveChildren[_this.hiddenCount - 1];
                        var childDetail = _this.childDetails[childIndex];
                        // Check if there is enough space for this component.  Use a buffer to prevent flickering.
                        var buffer = 8;
                        if (_this.childDetails[childIndex].appliedSize + buffer >= availableSpace) {
                            break;
                        }
                        // Apply the next adjustment to the child components.
                        availableSpace -= childDetail.appliedSize;
                        childDetail.hidden = false;
                        // Now that this component is visible we will decrement its count.
                        _this.hiddenCount--;
                        // console.log("Adjust (grow), applied " + childDetail.appliedSize + " from child " + childIndex);
                    }
                }
                // If adjustments were applied we need to notify the owner on the change and re-layout.
                if (hiddenCount != _this.hiddenCount) {
                    _this.layoutTimeout = window.setTimeout(function () {
                        _this.layoutTimeout = 0;
                        if (_this.props.onLayoutChange) {
                            _this.props.onLayoutChange(_this.hiddenCount);
                        }
                        // Force updates to the components and we will see if we have gained enough space.
                        _this.forceUpdate();
                    }, 0);
                }
            }
        };
        return _this;
    }
    ResponsiveLayout.prototype.render = function () {
        var _this = this;
        var childKeys = [];
        var container = React.Children.only(this.props.children);
        // Get the to the container for us to use during sizing calculations.
        this.containerRef = shimRef(container);
        // Clone the container and insert the placeholders for hidden children.
        var children = React.cloneElement(container, __assign(__assign({}, container.props), { ref: this.containerRef }), React.Children.map(container.props.children, function (child, index) {
            if (false) {
                if (typeof child === "function") {
                    throw Error("Functional components aren't allowed as the direct child of a ResponsiveLayout container");
                }
                if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
                    throw Error("Raw values aren't allowed as the direct child of a ResponsiveLayout container, wrap it in a span and ensure it has a key.");
                }
            }
            // ALL children MUST have unique keys.
            if (!child.key) {
                console.warn("All children MUST have a unique key");
                child.key = index;
            }
            childKeys[index] = child.key;
            // If the component has been hidden by an layout, we will render a placeholder, that takes 0 size.
            if (_this.childDetails && _this.childDetails[index] && _this.childDetails[index].hidden) {
                return React.createElement("div", { key: "PH" + index, className: "responsive-placeholder" });
            }
            return child;
        }));
        // If the children have changed we will reset the layout and start over.
        if (this.childKeys) {
            if (this.childKeys.length !== childKeys.length) {
                this.resetLayout();
            }
            else {
                for (var keyIndex = 0; keyIndex < childKeys.length; keyIndex++) {
                    if (this.childKeys[keyIndex] !== childKeys[keyIndex]) {
                        this.resetLayout();
                        break;
                    }
                }
            }
        }
        this.childKeys = childKeys;
        return children;
    };
    ResponsiveLayout.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.updateLayout);
        this.updateLayout();
    };
    ResponsiveLayout.prototype.componentDidUpdate = function () {
        this.updateLayout();
    };
    ResponsiveLayout.prototype.componentWillUnmount = function () {
        if (this.layoutTimeout) {
            window.clearTimeout(this.layoutTimeout);
            this.layoutTimeout = 0;
        }
        window.removeEventListener("resize", this.updateLayout);
    };
    ResponsiveLayout.prototype.resetLayout = function () {
        this.childDetails = undefined;
        this.hiddenCount = 0;
    };
    return ResponsiveLayout;
}(React.Component));
export { ResponsiveLayout };
