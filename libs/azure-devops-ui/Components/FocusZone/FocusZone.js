import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { FocusGroup } from '../../FocusGroup';
import { ElementRelationship, getRelationship, KeyCode, shimRef } from '../../Util';
import { FocusZoneDirection, FocusZoneKeyStroke } from "./FocusZone.Props";
// The FocusZoneContext carries the identifier for the current FocusZone.
export var FocusZoneContext = React.createContext({ direction: undefined, focuszoneId: undefined });
// As an event propagates through the hierarchy of focus zones it may
// be marked as ignored. This allows a child focus zone to mark an event
// as "pass-through" for all of its parents.
var ignoreEvent = false;
// An internal identifier used to created unique focuszoneId's.
var focuszoneId = 1;
var FocusZone = /** @class */ (function (_super) {
    __extends(FocusZone, _super);
    function FocusZone(props) {
        var _this = _super.call(this, props) || this;
        _this.rootElements = [];
        _this.state = {
            focuszoneId: "focuszone-" + focuszoneId++
        };
        return _this;
    }
    FocusZone.prototype.render = function () {
        var _this = this;
        // We need to shim the KeyDown event on each of the children. This allows us to capture
        // the event and process it for focus changes.
        var content = (React.createElement(FocusZoneContext.Consumer, null, function (parentContext) { return (React.createElement(FocusZoneContext.Provider, { value: { direction: _this.props.direction, focuszoneId: _this.state.focuszoneId } }, React.Children.map(_this.props.children, function (child, index) {
            if (child === null || typeof child === "string" || typeof child === "number") {
                return child;
            }
            // All direct children MUST be DOM elements.
            if (typeof child.type !== "string") {
                throw Error("Children of a focus zone MUST be DOM elements");
            }
            // Save the supplied keydown event handler so we can forward the event to it.
            var existingOnKeyDown = child.props.onKeyDown;
            var existingOnFocus = child.props.onFocus;
            // Save the component reference for this element, either the one from the original
            // component or the one we added.
            _this.rootElements[index] = shimRef(child);
            return React.cloneElement(child, __assign(__assign({ key: index }, child.props), { ref: _this.rootElements[index], onFocus: function (event) {
                    var _a;
                    if (existingOnFocus) {
                        existingOnFocus(event);
                    }
                    var focusCurrent = document.activeElement;
                    for (var index_1 = 0; index_1 < _this.rootElements.length; index_1++) {
                        var rootElement = (_a = _this.rootElements[index_1]) === null || _a === void 0 ? void 0 : _a.current;
                        if (rootElement && (rootElement.contains(focusCurrent) || rootElement === focusCurrent)) {
                            _this.lastFocusElement = event.target;
                        }
                    }
                }, onKeyDown: function (event) {
                    var ignoreKeystroke = FocusZoneKeyStroke.IgnoreNone;
                    if (existingOnKeyDown) {
                        existingOnKeyDown(event);
                    }
                    // Determine whether or not this focuszone wants to preprocess this keystroke
                    // and mark the current propagation as ignored.
                    if (!ignoreEvent && _this.props.preprocessKeyStroke) {
                        ignoreKeystroke = _this.props.preprocessKeyStroke(event);
                        if (ignoreKeystroke === FocusZoneKeyStroke.IgnoreAll) {
                            ignoreEvent = true;
                        }
                    }
                    if (!ignoreEvent) {
                        if (!event.defaultPrevented && !_this.props.disabled) {
                            var nodeName = event.target.nodeName;
                            var offset = void 0;
                            // Logic to handle input / text area tags
                            var inputPosition = void 0;
                            var inputLength = void 0;
                            if (nodeName === "INPUT" || nodeName === "TEXTAREA") {
                                var input = event.target;
                                try {
                                    inputPosition = typeof input.selectionStart === "number" ? input.selectionStart : undefined;
                                }
                                catch (_a) {
                                    // Microsoft Edge throws InvalidStateError when calling 'input.selectionStart' on non-supported input element types
                                    // according to https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
                                    // Ignore this error
                                }
                                inputLength = input.value.length;
                            }
                            var allowLeftArrow = inputPosition === undefined || (inputPosition === 0 && _this.props.allowArrowOutOfInputs);
                            var allowRightArrow = inputPosition === undefined ||
                                inputLength === undefined ||
                                (inputPosition === inputLength && _this.props.allowArrowOutOfInputs);
                            switch (event.which) {
                                case KeyCode.upArrow:
                                    if (nodeName !== "TEXTAREA") {
                                        if (_this.props.direction === FocusZoneDirection.Vertical) {
                                            offset = -1;
                                        }
                                    }
                                    break;
                                case KeyCode.downArrow:
                                    if (nodeName !== "TEXTAREA") {
                                        if (_this.props.direction === FocusZoneDirection.Vertical) {
                                            offset = 1;
                                        }
                                    }
                                    break;
                                case KeyCode.rightArrow:
                                    if (allowRightArrow) {
                                        if (_this.props.direction === FocusZoneDirection.Horizontal) {
                                            offset = 1;
                                        }
                                    }
                                    break;
                                case KeyCode.leftArrow:
                                    if (allowLeftArrow) {
                                        if (_this.props.direction === FocusZoneDirection.Horizontal) {
                                            offset = -1;
                                        }
                                    }
                                    break;
                                case KeyCode.tab:
                                    if (_this.props.handleTabKey) {
                                        offset = event.shiftKey ? -1 : 1;
                                    }
                                    break;
                                case KeyCode.enter:
                                    if (_this.props.activateOnEnter) {
                                        event.target.click();
                                    }
                            }
                            if (offset) {
                                if (_this.focusNextElement(event, offset)) {
                                    event.preventDefault();
                                }
                            }
                        }
                    }
                    if (ignoreKeystroke === FocusZoneKeyStroke.IgnoreParents) {
                        ignoreEvent = true;
                    }
                    // Perform any supplied event post processing.
                    if (!ignoreEvent && _this.props.postprocessKeyStroke) {
                        if (_this.props.postprocessKeyStroke(event) === FocusZoneKeyStroke.IgnoreParents) {
                            ignoreEvent = true;
                        }
                    }
                    // Once we reach the root focuszone we need to clear the ignoredEvent.
                    if (!parentContext.focuszoneId) {
                        ignoreEvent = false;
                    }
                } }));
        }))); }));
        if (this.props.focusGroupProps) {
            content = React.createElement(FocusGroup, __assign({}, this.props.focusGroupProps), content);
        }
        return content;
    };
    FocusZone.prototype.componentDidMount = function () {
        var focusElement;
        // If a defaultActiveElement is supplied we will focus it. It is not required to
        // be member of the focus zone, it can be any element.
        if (this.props.focusOnMount) {
            var defaultActiveElement = this.props.defaultActiveElement;
            var focusElements = this.getFocusElements(typeof defaultActiveElement === "function" ? defaultActiveElement() : defaultActiveElement);
            if (focusElements.length > 0) {
                focusElement = focusElements[0];
            }
        }
        if (focusElement) {
            focusElement.focus({
                preventScroll: this.props.preventScrollOnFocus
            });
        }
    };
    FocusZone.prototype.focusNextElement = function (event, offset) {
        var focusElements = this.getFocusElements();
        if (focusElements.length > 0) {
            var focusCurrent = document.activeElement;
            var rootElements = this.rootElements;
            // Determine if an element in the focus zone has focus.
            var focusIndex = focusElements.indexOf(focusCurrent);
            // Focus may not be on an element in the zone so we need to
            // figure out which one we are between in this case.
            if (focusIndex === -1) {
                var index = 0;
                // Determine if the element is in a portal or directly within a focuszone root.
                for (index = 0; index < rootElements.length; index++) {
                    var elementRef = rootElements[index];
                    if (elementRef.current) {
                        if (elementRef.current.contains(event.target)) {
                            break;
                        }
                    }
                }
                // If this is coming from a portal, we will use the element that last had focus.
                if (index === this.rootElements.length && this.lastFocusElement) {
                    focusIndex = focusElements.indexOf(this.lastFocusElement);
                }
                else {
                    for (index = 0; index < focusElements.length; index++) {
                        var relationship = getRelationship(focusCurrent, focusElements[index]);
                        if (relationship === ElementRelationship.Before) {
                            focusIndex = index - (offset > 0 ? 1 : 0);
                            break;
                        }
                        else if (relationship === ElementRelationship.Child) {
                            focusIndex = index;
                            break;
                        }
                        else if (relationship === ElementRelationship.After && index === focusElements.length - 1) {
                            focusIndex = focusElements.length;
                        }
                    }
                }
            }
            // Move to the next component in the set of focus zone components.
            focusIndex += offset;
            // If the FocusZone supports circular navigation and we are on the end
            // we will move to the element on the opposite end.
            if (this.props.circularNavigation) {
                if (focusIndex < 0) {
                    focusIndex = focusElements.length - 1;
                }
                else if (focusIndex >= focusElements.length) {
                    focusIndex = 0;
                }
            }
            // If we ended up on a focusable element update the focus.
            if (focusIndex > -1 && focusIndex < focusElements.length) {
                focusElements[focusIndex].focus();
                if (this.props.selectInputTextOnFocus && focusElements[focusIndex] instanceof HTMLInputElement) {
                    focusElements[focusIndex].select();
                }
                return true;
            }
        }
        return false;
    };
    FocusZone.prototype.getFocusElements = function (customSelector) {
        var focusElements = [];
        var selector = customSelector;
        // If a custom selector was supplied we will use it.
        if (!selector) {
            // The default selector will just pick up items tagged with this focuszone id.
            selector = "[data-focuszone~=" + this.state.focuszoneId + "]";
            // If we are including the default elements from the DOM we will add the
            // default selector to our list of selectors.
            if (this.props.includeDefaults) {
                selector += ",a[href],button,iframe,input,select,textarea,[tabIndex]";
            }
        }
        // Filter the elements that matched our query to the elements that are elligible
        // for receiving focus in this focuszone.
        for (var _i = 0, _a = this.rootElements; _i < _a.length; _i++) {
            var rootElement = _a[_i];
            if (rootElement.current) {
                var focusChildren = rootElement.current.querySelectorAll(selector);
                // Check if the root element matches our selector.
                if (rootElement.current.matches(selector) && this.isFocusElement(rootElement.current, customSelector)) {
                    focusElements.push(rootElement.current);
                }
                // Check all the children of the root that are potential focus elements.
                for (var rootIndex = 0; rootIndex < focusChildren.length; rootIndex++) {
                    var element = focusChildren[rootIndex];
                    if (this.isFocusElement(element, customSelector)) {
                        focusElements.push(element);
                    }
                }
            }
        }
        return focusElements;
    };
    /**
     * isFocusElement is used to determine whether or not an element should participate
     * in this focus zone.
     *
     * @param element HTML Element that you are testing as a valid focus element.
     *
     * @param customSelector A custom selector that is used to match elements with
     *  negative tabIndex. These wont match normally unless targetted by the custom
     *  selector.
     */
    FocusZone.prototype.isFocusElement = function (element, customSelector) {
        // Filter out elements that are disabled.
        if (element.hasAttribute("disabled")) {
            return false;
        }
        if (!customSelector) {
            // Filter out elements that are not visible.
            if (!this.props.skipHiddenCheck) {
                var style = window.getComputedStyle(element);
                if (style.visibility === "hidden" ||
                    style.display === "none" ||
                    !(element.offsetWidth || element.offsetHeight || element.getClientRects().length)) {
                    return false;
                }
            }
            // Filter out elements with negative tabIndex that aren't
            // explicity marked for this focuszone.
            var tabIndex = element.getAttribute("tabindex");
            if (tabIndex && parseInt(tabIndex) < 0) {
                var focuszoneId_1 = element.getAttribute("data-focuszone");
                if (!focuszoneId_1 || focuszoneId_1.indexOf(this.state.focuszoneId) < 0) {
                    return false;
                }
            }
        }
        return true;
    };
    return FocusZone;
}(React.Component));
export { FocusZone };
