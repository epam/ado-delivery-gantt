export declare enum Location {
    start = "start",
    center = "center",
    end = "end"
}
export interface IOrigin {
    horizontal: Location;
    vertical: Location;
}
export interface IOffset {
    horizontal: number;
    vertical: number;
}
export interface IPoint {
    x: number;
    y: number;
}
/**
 * Calculates the distance between two points
 * @param pointA First point
 * @param pointB Second point
 */
export declare function distance(pointA: IPoint, pointB: IPoint): number;
/**
 * The position method is used to set the location of an absolutely positioned element
 * using the standard positioning properties. The names of these properties conform to
 * the naming patterns used in the Material Popover https://material-ui.com. They
 * are not exact but follow the same pattern.
 *
 * For an example usage, look at the Callout component and how it uses this method to
 * position the element in the page.
 *
 * @param transformElement The element that is being positioned/transformed.
 * @param transformOrigin The origin within the transformed element to align with the
 *  anchor position.
 * @param anchorOffset Offset on the anchorElement that is applied to the computed location
 *  given the element/origin/point.
 * @param anchorElement The element used to anchor the position of the transformed element.
 *  The caller must supply either an anchorElement and anchorOrigin, or anchorPoint.
 * @param anchorOrigin When an anchorElement is supplied the anchorOrigin defines the location
 *  on the anchorElement used for positioning.
 * @param anchorPoint Instead of an anchorElement the caller can use an explicit point
 *  to be used as the basis for the anchorLocation. The anchorOffset will still be applied.
 * @param extraSpaceSize Sets the value of how much the container is larger than the window in all directions.
 */
export declare function position(transformElement: HTMLElement, transformOrigin: IOrigin, anchorOffset?: IOffset, anchorElement?: HTMLElement, anchorOrigin?: IOrigin, anchorPoint?: IPoint, extraSpaceSize?: number): void;
/**
 * updateLayout is used to move an element to the "best" location based on it
 * layout. This will look at all the positioning attributes and move the
 * transformElement to a new location based on its size. This is usually done
 * after an initial call to position. After the element is positioned the
 * caller determines if the transformElement is in the desired location, which
 * generally translates to, is it clipped in the window.
 *
 * This is delayed because when position is called the transformElement is
 * frequently not fully laid out and we need to wait other a force reflow will
 * happen and cause performance issues.
 *
 * @param transformElement The element that is being positioned/transformed.
 * @param transformOrigin The origin within the transformed element to align with the
 *  anchor position.
 * @param anchorOffset Offset on the anchorElement that is applied to the computed location
 *  given the element/origin/point.
 * @param anchorElement The element used to anchor the position of the transformed element.
 *  The caller must supply either an anchorElement and anchorOrigin, or anchorPoint.
 * @param anchorOrigin When an anchorElement is supplie the anchorOrigin defines the location
 *  on the anchorElement used for positioning.
 * @param anchorPoint Instead of an anchorElement the caller can use an explicit point
 *  to be used as the basis for the anchorLocation. The anchorOffset will still be applied.
 * @param extraSpaceSize Sets the value of how much the container is larger than the window in all directions.
 * @param recursionControl Use it to avoid infinite loop and call this function LAYOUT_CALCULATION_MAX_TIMES times at most.
 */
export declare function updateLayout(transformElement: HTMLElement, transformOrigin: IOrigin, anchorOffset?: IOffset, anchorElement?: HTMLElement, anchorOrigin?: IOrigin, anchorPoint?: IPoint, extraSpaceSize?: number, recursionControl?: number): void;
