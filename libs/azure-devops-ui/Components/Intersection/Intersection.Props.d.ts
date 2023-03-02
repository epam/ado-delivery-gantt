/**
 * An intersection component uses an IntersectionObserver to watch for changes in the
 * visibility of given elements that are observed within the rootElement. When changes
 * occure the onIntersect method is called with a set of entries that describe the
 * change in visibility. It will also call the onIntersect with an empty set of
 * entries if the rootElement is scrolled.
 *
 * NOTE: The root and observation elements can't be changed after the initial render.
 * In the case that is needed a new key should be supplied to force a new component.
 */
export interface IIntersectionProps {
    /**
     * If the caller wants to observe a single static element within the intersection
     * that is available when the intersection mounts, it can supply an observationElement.
     */
    observationElement?: HTMLElement | string | (() => HTMLElement | null);
    /**
     * onIntersect is called in two cases and denotes a change in the rootElements
     * visible viewport.
     *
     * 1) When the rootElement is scrolled onIntersect is called with a empty
     * array of entries. No intersections are calculated.
     * 2) When the underlying IntersectionObserver fires the intersection events.
     * These event describe the changes in visibility of elements being observed
     * through the IntersectionContext.
     */
    onIntersect?: (entries: IntersectionObserverEntry[]) => void;
    /**
     * The parent element that contains the elements being observed and has its
     * onScroll events forwarded.
     */
    rootElement?: HTMLElement | string | (() => HTMLElement | null);
    /**
     * An additional amount number of pixels that should be considered within the
     * viewport of the rootElement. This is used to enlarge the visibility range
     * making intersection occur when elements are still outside the visible view.
     */
    rootMargin?: number;
    /**
     * Threshold define the point at which the change is important. By default the
     * threshold are set to a 1% change in visibility. If the caller wants to know
     * about specific points only they can supply a custom set of thresholds.
     */
    threshold?: number[];
}
