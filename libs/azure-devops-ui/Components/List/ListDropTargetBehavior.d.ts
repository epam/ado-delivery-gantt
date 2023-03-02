import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { BoltListDragEvent, IDragDroppableUI } from "./List.Props";
export interface IListDropData {
    /**
     * The index of the item in the list that is being dropped on.
     * The intention is the item will be dropped before this index. So, if the item will be at the
     * end of the list, the index will equal the length of the items.
     */
    index: number;
}
export interface IListDropTargetBehaviorOptions<D> {
    /**
     * A list of types of data which can be dropped on this list.
     */
    allowedTypes: string[];
    /**
     * A unique id for the drop target. Necessary for situations where
     * the drag source and drop target are separate lists.
     */
    id?: string;
    /**
     * Adjust some functionality if we are looking at a tree
     */
    isTree?: boolean;
    /**
     * Called with a dragenter event when the mouse has entered the list.
     */
    onDragEnter?: (event: BoltListDragEvent<HTMLElement, D>) => void;
    /**
     * Called with a dragexit event when the mouse has left the list.
     */
    onDragExit?: (event: BoltListDragEvent<HTMLElement, D>) => void;
    /**
     * Called with dragover events while the mouse is moved over the list.
     * If a certain row within the list should not be a viable drop target, then this callback
     * can set the dropEffect to none to indicate this.
     */
    onDragOver?: (event: BoltListDragEvent<HTMLElement, D>, dropData: IListDropData) => void;
    /**
     * Called with a drop event when the drag operation has ended if the mouse is still over
     * the list and the dropEffect is not none.
     */
    onDrop?: (event: BoltListDragEvent<HTMLElement, D>, dropData: IListDropData) => void;
    /**
     * A string representing the type of data that is being acted upon in the
     * drag and drop operation.
     */
    type: string;
}
/**
 * A behavior that turns a list into the target of a drag and drop operation. Note - this
 * behavior should only be used if your list is intended to _only_ be a drop target. Please use
 * the ListDragDropBehavior instead if the list is also a drag source, as that is the only way
 * to get keyboard drag and drop support within your list.
 */
export declare class ListDropTargetBehavior<D> implements IBehavior<{}, IDragDroppableUI> {
    private dragDroppableUI;
    private eventDispatch;
    private indicatorName;
    private itemProvider;
    private listIndicatorPosition;
    private options;
    constructor(options: IListDropTargetBehaviorOptions<D>);
    initialize: (props: any, dragDroppableUI: IDragDroppableUI, eventDispatch: IEventDispatch) => void;
    componentDidUpdate(props: any): void;
    componentWillUnmount(): void;
    private calculateIndex;
    private handlesType;
    private onDragEnter;
    private onDragExit;
    private onDragOver;
    private onDrop;
    private renderDropIndicator;
}
