import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { BoltListDragEvent, IDragDroppableUI } from "./List.Props";
export interface IListDragSourceBehaviorOptions<D> {
    /**
     * A unique id for the drag source. Necessary for situations where
     * the drag source and drop target are separate lists.
     */
    id?: string;
    /**
     * Called with a dragend event when the drag operation has finished.
     * This will be called regardless of the result of the operation,
     * i.e. even if the dropEffect is none.
     */
    onDragEnd?: (event: BoltListDragEvent<HTMLElement, D>) => void;
    /**
     * Called with a dragstart event when a drag operation has been detected.
     * If a consumer only wants certain rows within a list to be draggable, this
     * property should be implemented, and the effectAllowed on the dataTransfer
     * should be set to none.
     */
    onDragStart?: (event: BoltListDragEvent<HTMLElement, D>) => void;
    /**
     * Called with dragover events while the mouse is moved over the list.
     * Additional logic can be implemented when dragging an item through the
     * list. The default implementation allows to scroll when a dragging
     * item approaches the top or bottom of the list.
     */
    onDragging?: (event: BoltListDragEvent<HTMLElement, D>) => void | boolean;
    /**
     * What to render inside of the <DragImage> that will follow the mouse as
     * the user decides where to drop the dragged item.
     *
     * Normally this will be a <ListDragImage /> - as in this example:
     *
     *  <ListDragImage text={event.detail.dataTransfer.data.myString} />
     *
     * Where the D of your behavior is a type that contains a myString property of type string.
     *
     */
    renderDragImage: (event: BoltListDragEvent<HTMLElement, D>) => React.ReactNode;
    /**
     * A string representing the type of data that is being acted upon in the
     * drag and drop operation.
     */
    type: string;
}
/**
 * A behavior that turns a list into the source of a drag and drop operation. Note - this
 * behavior should only be used if your list is intended to _only_ be a drag source. Please use
 * the ListDragDropBehavior instead if the list is also a drop target, as that is the only way
 * to get keyboard drag and drop support within your list.
 */
export declare class ListDragSourceBehavior<D> implements IBehavior<{}, IDragDroppableUI> {
    private dragImageData;
    private dragDroppableUI;
    private eventDispatch;
    private itemProvider;
    private operation;
    private options;
    constructor(options: IListDragSourceBehaviorOptions<D>);
    initialize: (props: any, dragDroppableUI: IDragDroppableUI, eventDispatch: IEventDispatch) => void;
    componentDidUpdate(props: any): void;
    componentWillUnmount(): void;
    private beginDrag;
    private onDragging;
    private onDraggingDefault;
    private onDragEnd;
    private onDragStart;
    private onPointerDown;
    private renderDragSourceItemOverlay;
    private setDragImage;
}
