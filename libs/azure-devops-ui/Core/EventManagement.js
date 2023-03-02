/**
 * The EventManagement class is used to track active event listeners
 * on DOM elements.
 */
var EventManagement = /** @class */ (function () {
    function EventManagement() {
        this.listeners = {};
    }
    /**
     * addEventListener provides a component level method for adding event listeners
     * to any EventTarget in the DOM and tracking them with the scope of this component.
     * This ensures that when the component is unmounted, any outstanding listeners
     * will be removed.
     *
     * @param target - The EventTarget to add the listener too.
     *
     * @param type - The event type the listener is signing up too.
     *
     * @param listener - The listener callback delegate to be called when the events occur.
     *
     * @param useCapture - Use capture mode for event phase.
     */
    EventManagement.prototype.addEventListener = function (target, type, listener, useCapture) {
        var eventKey = type + (useCapture ? "-uc" : "");
        if (!this.listeners[eventKey]) {
            this.listeners[eventKey] = [];
        }
        // Determine whether or not we are already tracking this listener for this event
        var typeList = this.listeners[eventKey];
        var listenerExists = false;
        for (var index = 0; index < typeList.length; index++) {
            if (typeList[index].listener === listener) {
                listenerExists = true;
                break;
            }
        }
        // Only track this listener if we dont have it yet.
        if (!listenerExists) {
            this.listeners[eventKey].push({
                listener: listener,
                target: target,
                type: type,
                useCapture: useCapture
            });
        }
        // Add the event listener to the element (even if we already have it, it could have been removed).
        target.addEventListener(type, listener, useCapture);
    };
    /**
     * removeAllListeners is used to clear out any added listeners that are being
     * managed by this object.
     */
    EventManagement.prototype.removeAllListeners = function () {
        for (var eventKey in this.listeners) {
            var typeList = this.listeners[eventKey];
            for (var index = 0; index < typeList.length; index++) {
                typeList[index].target.removeEventListener(typeList[index].type, typeList[index].listener, typeList[index].useCapture);
            }
        }
    };
    /**
     * removeEventListener provides a way to remove an event listener from any EventTarget
     * in the DOM and will remove the components tracking reference on this listener.
     *
     * @param target - The EventTarget to remove the listener from.
     *
     * @param type - The event type the listener was signed up too.
     *
     * @param listener - The listener callback delegate to remove.
     *
     * @param useCapture - Was the event using capture mode.
     */
    EventManagement.prototype.removeEventListener = function (target, type, listener, useCapture) {
        var eventKey = type + (useCapture ? "-uc" : "");
        // Remove the listener from the target
        target.removeEventListener(type, listener, useCapture);
        // Remove our tracking value for this listener
        if (this.listeners[eventKey]) {
            var typeList = this.listeners[eventKey];
            for (var index = 0; index < typeList.length; index++) {
                if (typeList[index].target === target && typeList[index].listener === listener) {
                    typeList.splice(index, 1);
                    break;
                }
            }
        }
    };
    return EventManagement;
}());
export { EventManagement };
