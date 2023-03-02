import { noop } from '../Util';
import { getWindow } from "./Dom";
/**
 * getTabIndex takes in a standard set of focus related properties to determine
 * the correct tabIndex for the element.
 */
export function getTabIndex(props, focusGroupContext) {
    // Return an explicit tabIndex if one was requested.
    if (props.tabIndex !== undefined) {
        return props.tabIndex;
    }
    // Make element tabbable if:
    //  The element is not disabled,
    //  The element does not have the excludeTabStop property
    //  Optionally, the component is within a focusGroup and is the focused element
    if (!props.disabled &&
        !props.excludeTabStop &&
        (!focusGroupContext || focusGroupContext.onFocus === noop || focusGroupContext.focusedElementId === props.id)) {
        return 0;
    }
    // Allow the element to have focus as long as the excludeFocusZone was not supplied.
    if (!props.excludeFocusZone) {
        return -1;
    }
    // The element is not tabbable and wont have a tabIndex, therefore it can't get focus.
    return undefined;
}
var targetToFocusOnNextRepaint = undefined;
/**
 * Sets focus on the next frame OR after setTimeout(0)
 * If you pass an IFocusable instead of an HTMLElement it'll use setTimeout instead of window.requestAnimationFrame
 */
export function focusAsync(element) {
    // If we've called this method this frame, re-set the element to focus but don't hook up another handler
    if (targetToFocusOnNextRepaint) {
        targetToFocusOnNextRepaint = element;
        return;
    }
    // If this is the first time we've called this this frame, set an event handler
    // or schedule it async if we can't get the window element
    targetToFocusOnNextRepaint = element;
    var window = getWindow(element);
    if (window) {
        window.requestAnimationFrame(function () {
            if (targetToFocusOnNextRepaint) {
                targetToFocusOnNextRepaint.focus();
            }
            targetToFocusOnNextRepaint = undefined;
        });
    }
    else {
        setTimeout(function () {
            if (targetToFocusOnNextRepaint) {
                targetToFocusOnNextRepaint.focus();
            }
        });
    }
}
