import { IFocusGroupContext } from '../FocusGroup';
export interface IFocusable<T> {
    focus(options?: T): void;
}
/**
 * IFocusableProps are used to describe how the element is focused. Whether or not
 * you can tab to the element. Whether or not clicking on the element or calling
 * its focus method will set focus.
 *
 * Elements MUST either have a tabIndex set, or be native element that supports
 * focus to recieve keyboard focus.
 */
export interface IFocusableProps {
    /**
     * Disabled elements are not tabable by default.
     */
    disabled?: boolean;
    /**
     * The element has been exluded from a current focusZone by default.
     */
    excludeFocusZone?: boolean;
    /**
     * The element should not be tabable but still should be able to receieve focus.
     */
    excludeTabStop?: boolean;
    /**
     * If an element participates in a FocusGroup, it MUST have a unique identifier
     * that the group uses to track the active focus element.
     */
    id?: string;
    /**
     * An explicit tabIndex that should be used on the element.
     */
    tabIndex?: number;
}
/**
 * getTabIndex takes in a standard set of focus related properties to determine
 * the correct tabIndex for the element.
 */
export declare function getTabIndex(props: IFocusableProps, focusGroupContext?: IFocusGroupContext): number | undefined;
/**
 * Sets focus on the next frame OR after setTimeout(0)
 * If you pass an IFocusable instead of an HTMLElement it'll use setTimeout instead of window.requestAnimationFrame
 */
export declare function focusAsync(element: HTMLElement | IFocusable<any> | {
    focus(): void;
}): void;
