import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IEventDispatch } from '../../Utilities/Dispatch';
import { IItemProvider } from '../../Utilities/Provider';
import { IFixedHeightList, IFixedHeightListCellDetails, IFixedHeightListMaterializedStats, IFixedHeightListProps } from "./FixedHeightList.Props";
export interface IFixedHeightListState<T> {
    eventDispatch: IEventDispatch;
    firstMaterialized: number;
    itemProvider: IItemProvider<T | IReadonlyObservableValue<T | undefined>>;
    lastMaterialized: number;
    focusRows: {
        [rowIndex: number]: JSX.Element | null;
    };
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
    scrollTopRect: number;
    maxHeight: number;
}
/**
 * The FixedHeightList component is used to render a collection of items with a series of rows.
 */
export declare class FixedHeightList<T> extends React.Component<IFixedHeightListProps<T>, IFixedHeightListState<T>> implements IFixedHeightList<T> {
    static contextType: React.Context<import("../Intersection/Intersection").IIntersectionContext>;
    static defaultProps: Partial<IFixedHeightListProps<any>>;
    static getDerivedStateFromProps<T>(props: Readonly<IFixedHeightListProps<T>>, state: Readonly<IFixedHeightListState<T>>): Partial<IFixedHeightListState<T>> | null;
    private intersectionElements;
    private bodyElement;
    private listElement;
    private onScrollComplete?;
    private scrollToIndex;
    private scrollToOptions;
    private selectOnFocus;
    private focusIndex;
    private pivotIndex;
    constructor(props: Readonly<IFixedHeightListProps<T>>);
    private getListRole;
    private getItemRole;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(prevProps: IFixedHeightListProps<T>, prevState: IFixedHeightListState<T>): void;
    componentWillUnmount(): void;
    getFocusIndex(): number;
    getStats(): IFixedHeightListMaterializedStats;
    scrollIntoView(rowIndex: number, options?: ScrollIntoViewOptions, onScrollComplete?: (rowIndex: number) => void): void;
    private focusRow;
    private onBlur;
    private onClick;
    private onDispatch;
    private onDoubleClick;
    private onFocusBody;
    private onFocusItem;
    private onKeyDown;
    private onIntersect;
    private onMouseDownBody;
    private processSelectionEvent;
    private renderLoadingRow;
    private renderIntersectionBounds;
    private renderRow;
    private rowActivated;
    private rowSelected;
    private rowFocused;
}
export declare function rowFromElement(element: HTMLElement | null): IFixedHeightListCellDetails;
export declare function rowFromEvent(event: React.SyntheticEvent<HTMLElement>): IFixedHeightListCellDetails;
