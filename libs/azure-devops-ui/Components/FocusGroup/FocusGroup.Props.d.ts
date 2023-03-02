export interface IFocusGroupProps {
    /**
     * The id of the element to be treated as the
     * default focusable element of the group.
     */
    defaultElementId?: string;
}
/**
 * IFocusZoneContext is avaialble through the FocusZone Consumer.
 */
export interface IFocusGroupContext {
    /**
     * The id of the element that has received focus.
     * Should be used by the component that is consuming the context
     * to determine whether tabIndex=1 or tabIndex=0 should be placed on
     * the element.
     */
    focusedElementId?: string;
    /**
     * Callback to be invoked when the element has received a DOM
     * focus event.
     */
    onFocus: (elementId: string) => void;
}
export interface IFocusGroup {
    /**
     * Set focus within the focus group. If no elementId is provided,
     * focus will be set to the last focused element of the group. If the group has
     * not yet received focus, focus will be set to the default element.
     */
    focus(elementId?: string): void;
}
