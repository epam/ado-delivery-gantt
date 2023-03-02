import * as React from "react";
export interface IFocusWithin {
    hasFocus: () => boolean;
}
export interface IFocusWithinEvents {
    onBlur?: () => void;
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
}
export interface IFocusWithinProps extends IFocusWithinEvents {
    /**
     * If updateStateOnFocusChange is set to true, the FocusWithin component will update
     * the state of the component and cause a re-render of the sub-tree when focus enters
     * of leaves the component.
     */
    updateStateOnFocusChange?: boolean;
}
/**
 * The IFocusWithinStatus is passed to the children when the FocusWithin is rendered.
 */
export interface IFocusWithinStatus extends IFocusWithinEvents {
    hasFocus: boolean;
}
