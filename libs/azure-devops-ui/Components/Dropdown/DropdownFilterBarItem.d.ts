/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import { FilterBarItem, IFilterBarItemState } from '../../FilterBarItem';
import { IListBoxItem } from '../../ListBox';
import { IFilterItemState } from '../../Utilities/Filter';
import { IDropdownFilterBarItemProps } from "./DropdownFilterBarItem.Props";
export declare class DropdownFilterBarItem<T> extends FilterBarItem<IListBoxItem<T>, IDropdownFilterBarItemProps<T>, IFilterBarItemState<any>> {
    private dropdown;
    private selection;
    private wrappedItems;
    constructor(props: IDropdownFilterBarItemProps<T>);
    focus(): void;
    render(): JSX.Element;
    componentDidMount: () => void;
    private selectDefaultFilterItem;
    protected onFilterChanged: (filterState: IFilterItemState | null) => void;
    private onSelectionChanged;
    private renderExpandableButton;
    private onClearClick;
    private renderSelectedItems;
}
