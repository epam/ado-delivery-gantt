import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import { IDragDroppableUI } from '../List/List.Props';
import { IListDragDropBehaviorOptions } from '../List/ListDragDropBehavior';
import { ITableColumn } from '../../Table';
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
export interface ColumnDragDropBehaviorOptions extends IListDragDropBehaviorOptions<ITableColumn<{}>> {
    columns: Array<ITableColumn<{}>>;
}
/**
 * A behavior for dragging & dropping columns
 */
export declare class ColumnDragDropBehavior implements IBehavior<{}, IDragDroppableUI> {
    private eventDispatch;
    private options;
    private dragImageData;
    private dragDroppableUI;
    private operation;
    private indicatorName;
    private listIndicatorPosition;
    private contextMenuIndex;
    constructor(options: ColumnDragDropBehaviorOptions);
    initialize: (props: any, dragDroppableUI: IDragDroppableUI, eventDispatch: IEventDispatch) => void;
    componentWillUnmount(): void;
    updateBehaviorOptions(options: ColumnDragDropBehaviorOptions): void;
    private beginDrag;
    private onDragEnd;
    private onDragStart;
    private onPointerDown;
    private renderDragSourceItemOverlay;
    private setDragImage;
    private handlesType;
    private onDragEnter;
    private onDragExit;
    private onDragOver;
    private onDrop;
    private renderDropIndicator;
    private calculateIndex;
}
