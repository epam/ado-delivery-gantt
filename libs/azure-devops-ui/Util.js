import * as React from "react";
/**
 * Set of KeyCodes that are used in the platform.
 */
export var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["backspace"] = 8] = "backspace";
    KeyCode[KeyCode["tab"] = 9] = "tab";
    KeyCode[KeyCode["enter"] = 13] = "enter";
    KeyCode[KeyCode["shift"] = 16] = "shift";
    KeyCode[KeyCode["ctrl"] = 17] = "ctrl";
    KeyCode[KeyCode["alt"] = 18] = "alt";
    KeyCode[KeyCode["pause"] = 19] = "pause";
    KeyCode[KeyCode["capsLock"] = 20] = "capsLock";
    KeyCode[KeyCode["escape"] = 27] = "escape";
    KeyCode[KeyCode["space"] = 32] = "space";
    KeyCode[KeyCode["pageUp"] = 33] = "pageUp";
    KeyCode[KeyCode["pageDown"] = 34] = "pageDown";
    KeyCode[KeyCode["end"] = 35] = "end";
    KeyCode[KeyCode["home"] = 36] = "home";
    KeyCode[KeyCode["leftArrow"] = 37] = "leftArrow";
    KeyCode[KeyCode["upArrow"] = 38] = "upArrow";
    KeyCode[KeyCode["rightArrow"] = 39] = "rightArrow";
    KeyCode[KeyCode["downArrow"] = 40] = "downArrow";
    KeyCode[KeyCode["delete"] = 46] = "delete";
    KeyCode[KeyCode["b"] = 66] = "b";
    KeyCode[KeyCode["i"] = 73] = "i";
    KeyCode[KeyCode["k"] = 75] = "k";
    KeyCode[KeyCode["q"] = 81] = "q";
    KeyCode[KeyCode["t"] = 84] = "t";
    KeyCode[KeyCode["windowsKey"] = 91] = "windowsKey";
    KeyCode[KeyCode["macCommand"] = 91] = "macCommand";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["numLock"] = 144] = "numLock";
    KeyCode[KeyCode["scrollLock"] = 145] = "scrollLock";
    KeyCode[KeyCode["comma"] = 188] = "comma";
})(KeyCode || (KeyCode = {}));
/**
 * Determines whether or not a keystroke is an arrow key or not.
 */
export function isArrowKey(event) {
    return (event.which === KeyCode.downArrow ||
        event.which === KeyCode.upArrow ||
        event.which === KeyCode.leftArrow ||
        event.which === KeyCode.rightArrow);
}
/**
 * Type guard function to determine if children are defined as a function
 * @param children (usually from this.props.children)
 */
export function isFunctionalChildren(children) {
    return typeof children === "function";
}
/**
 * childCount is used to determine the number of defined renderable children within
 * a standard set of React.Children. This is different than React.Children.length
 * which includes children that are null or undefined.
 */
export function childCount(children) {
    var childCount = 0;
    React.Children.forEach(children, function (child) {
        if (child) {
            childCount++;
        }
    });
    return childCount;
}
/**
 * getSafeId is designed to create a string from the input id that is safe for use
 * as the id attribute of a component. The ids appear in the global javscript namespace.
 * This means if you create an element and assign the "id" property to a value
 * the element is accessible by doing window.<id>. This causes problems when the
 * id of the element collides with other global objects. Using a SafeId adds a prefix
 * intended to avoid conflicts.
 *
 * This should be called anytime a DOM elements property is being set that refers to
 * the components id. This should not be called when passing the id as a prop to a
 * component. It is the components responsibility to make the Id safe when attaching
 * it to an element.
 *
 * This includes but is not limited to properties like:
 *  aria-controls, aria-describedby, aria-labelledby, id, htmlFor, ...
 *
 * @param id The root id that is being made "Safe".
 */
export function getSafeId(id) {
    if (false) {
        if (id && id.startsWith("__bolt-")) {
            console.error("getSafeId was called twice on id " + id + ", it should only be called once");
        }
    }
    // querySelector won't select id's with .'s in them replace them with '-'.
    return id ? "__bolt-" + id.replace(/[^0-9A-Za-z_]/g, "-") : undefined;
}
/**
 * getSafeIdSelector will return the string that can use used to denote the selector
 * for elements that use this id.
 *
 * @param id The root id that is being made "Safe".
 */
export function getSafeIdSelector(id) {
    return "#" + getSafeId(id);
}
/**
 * function that does nothing and accepts any set of arguments.
 */
export function noop() { }
/**
 * Basic function for building a css classlist string from and array of classes, where
 * one of more of the arguments may be null or undefined.
 *
 * @param classes Array of strings the represents the css class list.
 *
 * @example css("base", "active", x === 42 && "optional") will return "base active optional" if x === 42 or "base active" otherwise
 */
export function css() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes
        .filter(function (c) { return c; })
        .join(" ")
        .trim();
}
/**
 * Returns the set of parent elements with index 0 the root and the last
 * element is either the direct parent or itself based on includeSelf.
 *
 * @param element The element to get the parent element hierarchy from.
 * @param includeSelf Should the element supplied be included in the parent list.
 * @param rootElement Optional root element to stop processing
 * @param includeRoot Should the root element supplied be included in the parent list.
 */
export function getParents(element, includeSelf, rootElement, includeRoot) {
    var parentElements = [];
    if (includeSelf) {
        parentElements.push(element);
    }
    while (element.parentElement && element.parentElement !== rootElement) {
        parentElements.splice(0, 0, element.parentElement);
        element = element.parentElement;
    }
    if (element.parentElement && includeRoot) {
        parentElements.splice(0, 0, element.parentElement);
    }
    return parentElements;
}
/**
 * Determines if the target element of an event (or its ancestry) has a particular node name.
 *
 * @param event The initial element is pulled off of this event.
 * @param nodeNames A list of DOM node names ("A", "INPUT", etc.) to check for the presence
 * @param rootAncestor If provided, build a list of ancestors from the event's element, to this element to check. Otherwise,
 * only check the element from the event.
 */
export function eventTargetContainsNode(event, nodeNames, rootAncestor) {
    var targetElement = event.target;
    var ancestors = rootAncestor ? getParents(targetElement, true, rootAncestor, true) : [targetElement];
    return ancestors.some(function (element) { return nodeNames.indexOf(element.nodeName) !== -1; });
}
/**
 * ElementRelationship is used to define how two elements in the same
 * document are related in position to each other.
 */
export var ElementRelationship;
(function (ElementRelationship) {
    ElementRelationship[ElementRelationship["Unrelated"] = 0] = "Unrelated";
    ElementRelationship[ElementRelationship["Before"] = 1] = "Before";
    ElementRelationship[ElementRelationship["After"] = 2] = "After";
    ElementRelationship[ElementRelationship["Child"] = 3] = "Child";
    ElementRelationship[ElementRelationship["Parent"] = 4] = "Parent";
})(ElementRelationship || (ElementRelationship = {}));
/**
 * getRelationship returns the relationship of the two specified elements.
 *
 * @param element1
 * @param element2
 */
export function getRelationship(element1, element2) {
    // If the second element is a child of the first element, then element1 occurs before element2.
    if (element1.contains(element2)) {
        return ElementRelationship.Parent;
    }
    // If the first element is a child of the second element, then element1 occurs after element2.
    if (element2.contains(element1)) {
        return ElementRelationship.Child;
    }
    // Retrieve the parents of both the elements.
    var parents1 = getParents(element1, true);
    var parents2 = getParents(element2, true);
    for (var elementIndex = 0;; elementIndex++) {
        if (parents1[elementIndex] !== parents2[elementIndex]) {
            var siblings = parents1[elementIndex - 1].children;
            for (var siblingIndex = 0; siblingIndex < siblings.length; siblingIndex++) {
                if (siblings[siblingIndex] === parents1[elementIndex]) {
                    return ElementRelationship.Before;
                }
                if (siblings[siblingIndex] === parents2[elementIndex]) {
                    return ElementRelationship.After;
                }
            }
        }
    }
}
/**
 * preventDefault is used as a standard delegate to prevent the default behavior
 * for a given event.
 *
 * @param event Synthetic event that should have its default action prevented.
 */
export function preventDefault(event) {
    event.preventDefault();
}
/**
 * shimRef is used to acquire a React Ref from a child component. If the child
 * has an existing ref, it will return the existing ref, if not it will
 * create a new one.
 */
export function shimRef(child) {
    // @HACK: This uses an internal property on the created element which is the
    //  forwarded ref property of the element. If React ever changes the implementation
    //  removing this property this code will need to be updated.
    // @NOTE: The ref MUST be a React.createRef if the a ref property is specified,
    //  otherwise we will not be able to share the ref.
    var ref = child.ref;
    // If no ref was created by the element owner we will add one.
    if (!ref) {
        ref = React.createRef();
    }
    else {
        // @DEBUG: Ensure the ref is a React.createRef by validated the current property
        if (!ref.hasOwnProperty("current")) {
            throw Error("Children of a focus zone MUST use React.createRef to obtain child references");
        }
        // @DEBUG
    }
    return ref;
}
/**
 * Set up a ref resolver function given internal state managed for the ref.
 * Taken from FluentUI v8 and modified to match local style
 * @param local Set
 */
function createResolver(local) {
    return function (newValue) {
        for (var _i = 0, _a = local.refs; _i < _a.length; _i++) {
            var ref = _a[_i];
            if (typeof ref === "function") {
                ref(newValue);
            }
            else if (ref) {
                // work around the immutability of the React.Ref type
                ref.current = newValue;
            }
        }
    };
}
/**
 * Helper to merge refs from within class components.
 * Taken from FluentUI v8 and modified to match local style
 */
export function createMergedRef(value) {
    var local = {
        refs: [],
    };
    return function () {
        var newRefs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newRefs[_i] = arguments[_i];
        }
        if (!local.resolver || !arrayEquals(local.refs, newRefs)) {
            local.resolver = createResolver(local);
        }
        local.refs = newRefs;
        return local.resolver;
    };
}
var focusVisible = false;
/**
 * Determine whether or not focus is currently visible to the user. This generally
 * means the user is using the keyboard to manage focus instead of the mouse.
 */
export function getFocusVisible() {
    return focusVisible;
}
/**
 * Make sure the focus treatment is enabled and disabled based on
 * the state of mouse and keyboard usage.
 */
export function setFocusVisible(visible) {
    if ((focusVisible = visible) === true) {
        document.body && document.body.classList.add("bolt-focus-visible");
    }
    else {
        document.body && document.body.classList.remove("bolt-focus-visible");
    }
}
/* Setup the set of non-focus keys, when these are pressed it doesnt start showing focus treatment */
var nonFocusKeys = new Array(255);
nonFocusKeys[KeyCode.alt] = true;
nonFocusKeys[KeyCode.capsLock] = true;
nonFocusKeys[KeyCode.ctrl] = true;
nonFocusKeys[KeyCode.numLock] = true;
nonFocusKeys[KeyCode.pause] = true;
nonFocusKeys[KeyCode.scrollLock] = true;
nonFocusKeys[KeyCode.shift] = true;
nonFocusKeys[KeyCode.windowsKey] = true;
document.addEventListener("keydown", function (event) {
    if (!nonFocusKeys[event.which]) {
        setFocusVisible(true);
    }
}, true);
var mouseCapture;
// MouseCaptureFunction is the global mouse handler we use to trap events and forward
// them to the current capture if one exists.
var mouseCaptureFunction = function (event) {
    // Track the position of the mouse as it moves.
    Mouse.position.x = event.clientX;
    Mouse.position.y = event.clientY;
    // Notify the mouse capture of the mouse movement and mouseup if one is signed up.
    if (mouseCapture && mouseCapture.callback && mouseCapture.button === event.button) {
        mouseCapture.callback(event);
        if (event.type === "mouseup") {
            Mouse.releaseCapture(mouseCapture.callback);
        }
    }
};
export var Mouse = {
    position: {
        x: 0,
        y: 0
    },
    releaseCapture: function releaseCapture(callback) {
        if (mouseCapture && mouseCapture.callback === callback) {
            mouseCapture = undefined;
        }
    },
    setCapture: function setCapture(callback, button) {
        if (button === void 0) { button = 0; }
        // Before starting a new capture, we will release the current capture.
        if (mouseCapture) {
            Mouse.releaseCapture(mouseCapture.callback);
        }
        // Update the mouseCapture to the new capture.
        mouseCapture = { button: button, callback: callback };
    }
};
document.addEventListener("mousemove", mouseCaptureFunction);
document.addEventListener("mouseup", mouseCaptureFunction);
document.addEventListener("mousedown", function (event) {
    // Screen readers on scan mode trigger some key strokes as Mouse events.
    // We can easily identify those events because they have no coordinates.
    if (event.button === 0 &&
        event.clientX === 0 &&
        event.clientY === 0 &&
        event.screenX === 0 &&
        event.screenY === 0 &&
        event.pageX === 0 &&
        event.pageY === 0) {
        return;
    }
    setFocusVisible(false);
}, true);
var touchCapture;
// touchCaptureFunction is the global touch handler we use to trap events and forward
// them to the current capture if one exists.
var touchCaptureFunction = function (event) {
    var touch = event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event.touches[0];
    // Track the position of the touch as it moves.
    Touch.position.x = touch.clientX;
    Touch.position.y = touch.clientY;
    // Notify the touch capture of the touch movement and touchend if one is signed up.
    if (touchCapture && touchCapture.callback) {
        touchCapture.callback(event);
        if (event.type === "touchend") {
            Touch.releaseCapture(touchCapture.callback);
        }
    }
};
/**
 * Currently only basic touch support - assumes a single touch
 * throughout the touch operation.
 */
export var Touch = {
    position: {
        x: 0,
        y: 0
    },
    releaseCapture: function releaseCapture(callback) {
        if (touchCapture && touchCapture.callback === callback) {
            touchCapture = undefined;
        }
    },
    setCapture: function setCapture(callback) {
        // Before starting a new capture, we will release the current capture.
        if (touchCapture) {
            Touch.releaseCapture(touchCapture.callback);
        }
        // Update the touchCapture to the new capture.
        touchCapture = { callback: callback };
    }
};
document.addEventListener("touchmove", touchCaptureFunction);
document.addEventListener("touchend", touchCaptureFunction);
document.addEventListener("touchstart", function () { return setFocusVisible(false); }, true);
var pointerCaptures = [];
// PointerCaptureFunction is the global pointer handler we use to trap events and forward
// them to the current capture if one exists.
var pointerCaptureFunction = function (event) {
    // Track the position of the pointer as it moves.
    Pointer.position.x = event.clientX;
    Pointer.position.y = event.clientY;
    // Notify the pointer capture of the pointer movement and pointerup if one is signed up.
    for (var i = pointerCaptures.length - 1; i >= 0; i--) {
        var pointerCapture = pointerCaptures[i];
        if (pointerCapture && pointerCapture.callback) {
            pointerCapture.callback(event);
            if (event.type === "pointerup") {
                Pointer.releaseCapture(pointerCapture.callback);
            }
        }
    }
};
export var Pointer = {
    position: {
        x: 0,
        y: 0
    },
    releaseCapture: function releaseCapture(callback) {
        var pointerCaptureIndex = pointerCaptures.findIndex(function (pointerCapture) { return pointerCapture.callback === callback; });
        if (pointerCaptureIndex > -1) {
            pointerCaptures.splice(pointerCaptureIndex, 1);
        }
    },
    setCapture: function setCapture(callback) {
        // Update the pointerCapture to the new capture.
        pointerCaptures.push({ callback: callback });
    }
};
document.addEventListener("pointermove", pointerCaptureFunction);
document.addEventListener("pointerup", pointerCaptureFunction);
document.addEventListener("pointerdown", function (event) {
    // Screen readers on scan mode trigger some key strokes as Pointer events.
    // We can easily identify those events because they have no coordinates.
    if (event.button === 0 &&
        event.clientX === 0 &&
        event.clientY === 0 &&
        event.screenX === 0 &&
        event.screenY === 0 &&
        event.pageX === 0 &&
        event.pageY === 0) {
        return;
    }
    setFocusVisible(false);
}, true);
/**
 * Returns the coordinates of a native event. For mouse / touch events, uses the
 * Mouse/Touch helpers. For a keyboard event, will return undefined.
 * @param event
 */
export function getPointByEventType(event) {
    if (event.clientX !== undefined) {
        return { x: Pointer.position.x, y: Pointer.position.y };
    }
    else if (event.changedTouches || event.touches) {
        // If the event has a changedTouches or touches property, it is a touch event.
        return { x: Touch.position.x, y: Touch.position.y };
    }
    else if (event.clientX !== undefined) {
        // If the event has a clientX, it is not a keyboard event, so treat it as a mouse event.
        return { x: Mouse.position.x, y: Mouse.position.y };
    }
    return undefined;
}
/**
 * Checks two arrays to see they contain equal elements in the same order.
 *
 * @param array1 First array to check.
 * @param array2 Second array to check.
 * @param comparer Optional comparer to check whether array items are equal. If not specified, items are compared using strict equals.
 * @returns {boolean}
 */
export function arrayEquals(array1, array2, comparer) {
    if (comparer === void 0) { comparer = function (item1, item2) { return item1 === item2; }; }
    if (!array1 && !array2) {
        return true;
    }
    if (!array1 || !array2) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (!comparer(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
}
export function isSafari() {
    var safari = /Safari\/([\d.]+)/i.exec(window.navigator.userAgent);
    return !!safari && navigator.userAgent.toLowerCase().includes("chrome");
}
