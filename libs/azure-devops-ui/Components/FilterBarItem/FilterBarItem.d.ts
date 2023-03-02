import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { FilterOperatorType, IFilterItemState } from '../../Utilities/Filter';
import { IFilterBarItem, IFilterBarItemProps } from "./FilterBarItem.Props";
export interface IFilterBarItemState<T> {
    value?: T;
    operator?: FilterOperatorType;
}
export declare abstract class FilterBarItem<TFilterItem, TProps extends IFilterBarItemProps, TState extends IFilterBarItemState<TFilterItem>> extends React.Component<TProps, TState> implements IFilterBarItem {
    private throttledSetFilterValue;
    private timerManagement;
    constructor(props: TProps);
    UNSAFE_componentWillMount(): void;
    /**
     * Setting state when component state is different from filter item state
     * Needed for handling scenarios when filter object's setState method is called with suppressChangeEvent=true
     * In such cases, FILTER_CHANGE_EVENT is not triggered and thus component state is not updated
     * And then on re-rendering component renders with old state.
     * @param nextProps
     */
    UNSAFE_componentWillReceiveProps(nextProps: TProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    abstract focus(): void;
    protected onFilterChanged(filterState: IFilterItemState | null): void;
    protected getThrottleWait(): number;
    protected setFilterValue(filterState: IFilterItemState): void;
    private _onFilterChanged;
    private _setFilterValue;
}
