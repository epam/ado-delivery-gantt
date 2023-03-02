export declare function elementContains(parent: HTMLElement, child: HTMLElement): boolean;
/**
 * Gets the window or iframe container of the target element
 * @param element
 */
export declare function getWindow(element: HTMLElement): Window | undefined;
/**
 * Finds the nearest parent element of the target that is scrollable on the Y axis
 * @param element
 */
export declare function findScrollableParent(element: HTMLElement): HTMLElement | null;
