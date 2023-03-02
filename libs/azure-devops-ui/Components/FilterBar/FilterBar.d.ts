import "../../CommonImports";
import "../../Core/core.css";
import "./FilterBar.css";
import * as React from "react";
import { IFilterBar, IFilterBarProps } from "./FilterBar.Props";
export interface IFilterBarState {
    hasChangesToApply?: boolean;
    hasChangesToReset?: boolean;
    filtersToShowStartIndex: number;
    filtersToShowStopIndex: number;
    shouldHidePlaceholderLabels: boolean;
    shouldHaveMaxItemWidth: boolean;
}
export declare class FilterBar extends React.Component<IFilterBarProps, IFilterBarState> implements IFilterBar {
    private static RENDER_EVERYTHING;
    private _filterItemRefs;
    private _childrenContainerElements;
    private _rightElement;
    private _filterBarElement;
    private _resizeTimeout;
    private _startingFilterIndices;
    private _hasMadeVisibleFilterAnnouncement;
    private _isMounted;
    private _prevButtonElem;
    private _nextButtonElem;
    private _hasPagedRight;
    private _hasPagedLeft;
    private _firstChildIsKeywordItem;
    private _prevContainerWidth;
    private _id;
    constructor(props: IFilterBarProps);
    focus(): void;
    forceUpdate(): void;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: IFilterBarProps): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    private getChildKeysAsString;
    private _onResize;
    private _onPageLeft;
    private _onPageRight;
    private _calculateFiltersToShowStopIndex;
    private _onFilterChanged;
    private _onFilterApplied;
    private _onClearAndDismiss;
    private _onApplyChanges;
}
