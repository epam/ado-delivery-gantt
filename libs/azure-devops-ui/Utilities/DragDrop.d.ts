import * as React from "react";
import { IReadonlyObservableValue } from '../Core/Observable';
/**
 * Represents the .detail property of our custom drag events.
 */
export interface IBoltDragEventDetail<D, S> {
    /**
     * The drag event's data - modeled after the HTML5 DnD
     * DataTransfer object: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
     * We cannot use this class directly as we need the ability to more freely
     * manipulate its properties.
     */
    readonly dataTransfer: IDragDataTransfer<D, S>;
    /**
     * The native keyboard or pointer event which we are translating into
     * a BoltDragEvent.
     */
    readonly nativeEvent: PointerEvent | KeyboardEvent;
}
/**
 * Encapsulates the data and status of a drag and drop operation. Modeled after the HTML5 DnD
 * DataTransfer object: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer.
 * We do not use the DataTransfer class directly as it has some logic that prevents us
 * from freely manipulating its properties. The majority of the properties are intended to be
 * readonly, with the exception of the dropEffect, which consumers can modify in their event handlers
 * to indicate whether or not a drop is allowed on a specific target.
 */
export interface IDragDataTransfer<D, S> {
    /**
     * The primary data being acted upon during a drag and drop operation.
     */
    readonly data: D;
    /**
     * The result of the drag and drop operation if it were to be ended right now. This property gives
     * consumers a chance to indicate whether or not the operation should be allowed based on the current
     * drag data in conjunction with the drop target.
     */
    dropEffect: DragDropEffect;
    /**
     * The type of results this drag and drop operation supports. This property should only be modified
     * during the dragstart event, and can be used to cancel a drag operation. This is useful in the scenario
     * where a List is the drag source, but a given row within the list is not able to be dragged.
     */
    effectAllowed?: DragDropEffect;
    /**
     * Any secondary data related to the operation, but not directly used by
     * the DragDropManager. e.g. for list drag and drop, this can be the index
     * of the item being dragged.
     */
    readonly secondaryData?: S;
    /**
     * Allows consumer to change the drag image based on the latest event.
     * @param image - What to render
     * @param xOffset - Horizontal offset from the mouse position
     * @param yffset - Vertical offset from the mouse position
     */
    setDragImage: (image: React.ReactNode, xOffset?: number, yOffset?: number) => void;
    /**
     * Identifies the type of data being transferred. Allows us to not call drop
     * targets which have restrictions on the types of data that can be dropped on them.
     */
    readonly type: string;
}
/**
 * Represents the end result of a drag / drop operation.
 */
export declare enum DragDropEffect {
    /**
     * If the drop where to happen at this point, it would be a no-op.
     */
    none = "none",
    /**
     * The data should be moved from the drag source to the drop target.
     */
    move = "move",
    /**
     * The data should be copied from the drag source to the drop target.
     */
    copy = "copy"
}
/**
 * Exposes the x/y coordinates of the current drag/drop operation.
 * Used to determine where to draw the drag image.
 */
export interface IDragDropOperation {
    /**
     * X offset of current drag/drop operation
     */
    x: IReadonlyObservableValue<number | undefined>;
    /**
     * Y offset of current drag/drop operation
     */
    y: IReadonlyObservableValue<number | undefined>;
}
/**
 * Extends the React.DragEvent to include our custom event's detail.
 * @typeparam T: The type of the HTMLElement that fired the event.
 * @typeparam D: The type of data in the dataTransfer object.
 * @typeparam S: The type of secondary data in the dataTransfer object.
 */
export interface BoltDragEvent<T, D, S> extends Pick<React.DragEvent<T>, Exclude<keyof React.DragEvent<T>, "detail">> {
    readonly detail: IBoltDragEventDetail<D, S>;
}
export declare function beginDragOperation<D, S>(event: React.PointerEvent<HTMLElement>, dataTransfer: IDragDataTransfer<D, S>, minimumPixelsForDrag?: number): IDragDropOperation | undefined;
export declare function dispatchCustomDragEvent<D, S>(eventType: string, target: EventTarget, event: PointerEvent | KeyboardEvent, dataTransfer: IDragDataTransfer<D, S>): CustomEvent;
export declare function getDragInProgress(): boolean;
export interface IDragItemProps {
    /**
     * Optional class name to place on the content of the portal - the first element
     *  the consumer can control.
     */
    className?: string;
    /**
     * The drag/drop operation which has the current x/y values for the pointer position
     */
    operation: IDragDropOperation;
    /**
     * Number of pixels to offset the image from the pointer position horizontally.
     * @default 5
     */
    xOffset?: number;
    /**
     * Number of pixels to offset the image from the pointer position vertically.
     * @default 5
     */
    yOffset?: number;
}
export declare const DragImage: (props: IDragItemProps & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
