import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { IObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
import { IList, IListCellDetails, IListItemDetails, IListItemProps, IListMaterializedStats, IListProps, IOverlayRenderProps, IScrollableListProps, ISimpleListCell, ISimpleListProps } from "./List.Props";
interface IRowOverlay {
    id: string;
    columnIndex?: number;
    render: (props: IOverlayRenderProps) => React.ReactNode;
    rowIndex: number;
    zIndex: number;
}
export interface IListState<T> {
    columnCount: number;
    eventDispatch: IEventDispatch;
    firstMaterialized: number;
    firstRendered: number;
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    lastMaterialized: number;
    lastRendered: number;
    overlays: IObservableArray<IRowOverlay>;
    pageSize: number;
    renderedRows: {
        [rowIndex: number]: JSX.Element | null;
    };
    rowCount: number;
    rowHeight: number;
    rowProportion: number;
    rows: {
        [rowIndex: number]: T | IReadonlyObservableValue<T | undefined>;
    };
    scrollTop: number;
    virtualize: boolean;
}
/**
 * The List component is used to render a collection of items with a series of rows.
 */
export declare class List<T> extends React.Component<IListProps<T>, IListState<T>> implements IList<T> {
    static contextType: React.Context<import("../Intersection/Intersection").IIntersectionContext>;
    static defaultProps: Partial<IListProps<any>>;
    static getDerivedStateFromProps<T>(props: Readonly<IListProps<T>>, state: Readonly<IListState<T>>): Partial<IListState<T>> | null;
    private bodyElement;
    private listElement;
    private spacerElements;
    private onScrollComplete?;
    private scrollToIndex;
    private scrollToOptions;
    private selectOnFocus;
    private focusIndex;
    private pivotIndex;
    constructor(props: Readonly<IListProps<T>>);
    private onVirtualizeKeyDown;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number, columnIndex?: number): void;
    removeOverlay(id: string): void;
    getFocusIndex(): number;
    getStats(): IListMaterializedStats;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions, onScrollComplete?: (rowIndex: number) => void): void;
    focusRow(rowIndex: number, direction?: number): Promise<void>;
    private onBlur;
    private onClick;
    private onDispatch;
    private onDoubleClick;
    private onFocusBody;
    private onFocusItem;
    private onKeyDown;
    private onIntersect;
    private onPointerDownBody;
    private processSelectionEvent;
    private renderLoadingRow;
    private renderOverlay;
    private renderRow;
    private getInitialTabbableRow;
    private renderSpacer;
    private getHeight;
    private rowActivated;
    private rowSelected;
    private rowFocused;
}
export declare class ScrollableList<T> extends React.Component<IScrollableListProps<T>> implements IList<T> {
    private list;
    private scrollableElement;
    render(): JSX.Element;
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number, columnIndex?: number): void;
    getStats(): IListMaterializedStats;
    removeOverlay(id: string): void;
    focusRow(rowIndex: number, direction?: number): Promise<void>;
    getFocusIndex(): number;
    scrollIntoView(rowIndex: number, scrollToOptions?: ScrollIntoViewOptions): void;
    scrollTo(scrollTop: number): void;
}
export declare class SimpleList extends React.Component<ISimpleListProps> implements IList<ISimpleListCell | string | number> {
    private list;
    render(): JSX.Element;
    addOverlay(id: string, rowIndex: number, render: (props: IOverlayRenderProps) => React.ReactNode, zIndex?: number): void;
    removeOverlay(id: string): void;
    focusRow(rowIndex: number, direction?: number): Promise<void>;
    getFocusIndex(): number;
    getStats(): IListMaterializedStats;
    scrollIntoView(rowIndex: number, scrollToOptions?: ScrollIntoViewOptions): void;
    private renderListItem;
}
export declare function renderListItem<T>(rowIndex: number, details: IListItemDetails<T>, children: JSX.Element): JSX.Element;
export declare function ListItem<T>(props: IListItemProps<T> & {
    children: React.ReactNode;
}): JSX.Element;
export declare function renderListCell(listCell: ISimpleListCell | string | number, showOverflowTooltip?: boolean): JSX.Element;
export declare function cellFromElement(element: HTMLElement | null): IListCellDetails;
export declare function cellFromEvent(event: React.SyntheticEvent<HTMLElement>): IListCellDetails;
export {};
