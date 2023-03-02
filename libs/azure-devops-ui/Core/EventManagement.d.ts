/**
 * The EventManagement class is used to track active event listeners
 * on DOM elements.
 */
export declare class EventManagement {
    private listeners;
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
    addEventListener(target: EventTarget, type: string, listener: (event?: Event) => boolean | void, useCapture?: boolean): void;
    /**
     * removeAllListeners is used to clear out any added listeners that are being
     * managed by this object.
     */
    removeAllListeners(): void;
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
    removeEventListener(target: EventTarget, type: string, listener: (event?: Event) => boolean | void, useCapture?: boolean): void;
}
