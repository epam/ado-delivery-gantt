export function elementContains(parent, child) {
    var currentElement = child;
    while (currentElement) {
        if (currentElement === parent) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}
/**
 * Gets the window or iframe container of the target element
 * @param element
 */
export function getWindow(element) {
    if (typeof window === "undefined") {
        return undefined;
    }
    else {
        return element && element.ownerDocument && element.ownerDocument.defaultView ? element.ownerDocument.defaultView : window;
    }
}
/**
 * Finds the nearest parent element of the target that is scrollable on the Y axis
 * @param element
 */
export function findScrollableParent(element) {
    var currentElement = element;
    while (currentElement && currentElement !== document.body) {
        var styles = getComputedStyle(currentElement);
        var overflowY = styles ? styles.getPropertyValue("overflow-y") : "";
        if (overflowY && (overflowY === "scroll" || overflowY === "auto")) {
            return currentElement;
        }
        currentElement = currentElement.parentElement;
    }
    return document.body;
}
