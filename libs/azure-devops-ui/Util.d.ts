import * as React from "react";
import { IPoint } from "./Utilities/Position";
/**
 * Set of KeyCodes that are used in the platform.
 */
export declare enum KeyCode {
    backspace = 8,
    tab = 9,
    enter = 13,
    shift = 16,
    ctrl = 17,
    alt = 18,
    pause = 19,
    capsLock = 20,
    escape = 27,
    space = 32,
    pageUp = 33,
    pageDown = 34,
    end = 35,
    home = 36,
    leftArrow = 37,
    upArrow = 38,
    rightArrow = 39,
    downArrow = 40,
    delete = 46,
    b = 66,
    i = 73,
    k = 75,
    q = 81,
    t = 84,
    windowsKey = 91,
    macCommand = 91,
    F10 = 121,
    numLock = 144,
    scrollLock = 145,
    comma = 188
}
/**
 * Determines whether or not a keystroke is an arrow key or not.
 */
export declare function isArrowKey(event: React.KeyboardEvent<HTMLElement>): boolean;
/**
 * Type guard function to determine if children are defined as a function
 * @param children (usually from this.props.children)
 */
export declare function isFunctionalChildren<T>(children: React.ReactNode): children is (props: T) => JSX.Element;
/**
 * childCount is used to determine the number of defined renderable children within
 * a standard set of React.Children. This is different than React.Children.length
 * which includes children that are null or undefined.
 */
export declare function childCount(children?: React.ReactNode): number;
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
export declare function getSafeId(id?: string): string | undefined;
/**
 * getSafeIdSelector will return the string that can use used to denote the selector
 * for elements that use this id.
 *
 * @param id The root id that is being made "Safe".
 */
export declare function getSafeIdSelector(id: string): string;
/**
 * function that does nothing and accepts any set of arguments.
 */
export declare function noop(): void;
/**
 * Basic function for building a css classlist string from and array of classes, where
 * one of more of the arguments may be null or undefined.
 *
 * @param classes Array of strings the represents the css class list.
 *
 * @example css("base", "active", x === 42 && "optional") will return "base active optional" if x === 42 or "base active" otherwise
 */
export declare function css(...classes: Array<string | undefined | null | false>): string;
/**
 * Returns the set of parent elements with index 0 the root and the last
 * element is either the direct parent or itself based on includeSelf.
 *
 * @param element The element to get the parent element hierarchy from.
 * @param includeSelf Should the element supplied be included in the parent list.
 * @param rootElement Optional root element to stop processing
 * @param includeRoot Should the root element supplied be included in the parent list.
 */
export declare function getParents(element: HTMLElement, includeSelf?: boolean, rootElement?: HTMLElement, includeRoot?: boolean): HTMLElement[];
/**
 * Determines if the target element of an event (or its ancestry) has a particular node name.
 *
 * @param event The initial element is pulled off of this event.
 * @param nodeNames A list of DOM node names ("A", "INPUT", etc.) to check for the presence
 * @param rootAncestor If provided, build a list of ancestors from the event's element, to this element to check. Otherwise,
 * only check the element from the event.
 */
export declare function eventTargetContainsNode(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, nodeNames: string[], rootAncestor?: HTMLElement): boolean;
/**
 * ElementRelationship is used to define how two elements in the same
 * document are related in position to each other.
 */
export declare enum ElementRelationship {
    Unrelated = 0,
    Before = 1,
    After = 2,
    Child = 3,
    Parent = 4
}
/**
 * getRelationship returns the relationship of the two specified elements.
 *
 * @param element1
 * @param element2
 */
export declare function getRelationship(element1: HTMLElement, element2: HTMLElement): ElementRelationship;
/**
 * preventDefault is used as a standard delegate to prevent the default behavior
 * for a given event.
 *
 * @param event Synthetic event that should have its default action prevented.
 */
export declare function preventDefault(event: React.SyntheticEvent<HTMLElement>): void;
/**
 * shimRef is used to acquire a React Ref from a child component. If the child
 * has an existing ref, it will return the existing ref, if not it will
 * create a new one.
 */
export declare function shimRef<T>(child: React.ReactChild): React.RefObject<T>;
/**
 * Helper to merge refs from within class components.
 * Taken from FluentUI v8 and modified to match local style
 */
export declare function createMergedRef<TType, TValue = null>(value?: TValue): (...newRefs: (React.Ref<TType | null | TValue> | undefined)[]) => (newValue: TType | TValue | null) => void;
/**
 * Determine whether or not focus is currently visible to the user. This generally
 * means the user is using the keyboard to manage focus instead of the mouse.
 */
export declare function getFocusVisible(): boolean;
/**
 * Make sure the focus treatment is enabled and disabled based on
 * the state of mouse and keyboard usage.
 */
export declare function setFocusVisible(visible: boolean): void;
export declare const Mouse: {
    position: {
        x: number;
        y: number;
    };
    releaseCapture: (callback: (event: MouseEvent) => void) => void;
    setCapture: (callback: (event: MouseEvent) => void, button?: number) => void;
};
/**
 * Currently only basic touch support - assumes a single touch
 * throughout the touch operation.
 */
export declare const Touch: {
    position: {
        x: number;
        y: number;
    };
    releaseCapture: (callback: (event: TouchEvent) => void) => void;
    setCapture: (callback: (event: TouchEvent) => void) => void;
};
export declare const Pointer: {
    position: {
        x: number;
        y: number;
    };
    releaseCapture: (callback: (event: PointerEvent) => void) => void;
    setCapture: (callback: (event: PointerEvent) => void) => void;
};
/**
 * Returns the coordinates of a native event. For mouse / touch events, uses the
 * Mouse/Touch helpers. For a keyboard event, will return undefined.
 * @param event
 */
export declare function getPointByEventType(event: KeyboardEvent | MouseEvent | TouchEvent | PointerEvent): IPoint | undefined;
/**
 * Checks two arrays to see they contain equal elements in the same order.
 *
 * @param array1 First array to check.
 * @param array2 Second array to check.
 * @param comparer Optional comparer to check whether array items are equal. If not specified, items are compared using strict equals.
 * @returns {boolean}
 */
export declare function arrayEquals<T>(array1: T[], array2: T[], comparer?: (item1: T, item2: T) => boolean): boolean;
export declare function isSafari(): boolean;
