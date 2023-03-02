import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IDragDroppableUI } from "./List.Props";
import { IListDragSourceBehaviorOptions } from "./ListDragSourceBehavior";
import { IListDropTargetBehaviorOptions } from "./ListDropTargetBehavior";
export interface IListDragDropBehaviorOptions<D> extends IListDragSourceBehaviorOptions<D>, IListDropTargetBehaviorOptions<D> {
}
/**
 * A behavior that combines the ListDragSourceBehavior and ListDropTargetBehavior. If your list
 * is only meant to be a drag source, or only meant to be a drop target, then use those two
 * behaviors individually.
 * In addition to combining the two behaviors for convenience, this single behavior also enhances
 * the list with keyboard drag and drop support.
 */
export declare class ListDragDropBehavior<D> implements IBehavior<{}, IDragDroppableUI> {
    private dataTransfer;
    private dragBehavior;
    private dragItemRowElement;
    private dropBehavior;
    private eventDispatch;
    private focusIndex;
    private itemProvider;
    private options;
    constructor(options: IListDragDropBehaviorOptions<D>);
    initialize: (props: any, dragDroppableUI: IDragDroppableUI, eventDispatch: IEventDispatch) => void;
    componentDidUpdate(props: any): void;
    componentWillUnmount(): void;
    private dispatchEventAtIndex;
    private endDrag;
    private fireRowDragEvents;
    private onDragRowKeyDown;
    private onKeyDown;
}
