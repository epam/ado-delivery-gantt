import { ISelectionRange, Selection } from '../../Utilities/Selection';
import { IFilteredListSelection, IListSelection, IListSelectionOptions } from "./List.Props";
export declare class ListSelection extends Selection implements IListSelection {
    selectOnFocus: boolean;
    constructor(options?: boolean | IListSelectionOptions);
}
export declare class FilteredListSelection extends ListSelection implements IFilteredListSelection {
    private selection;
    private filteredIndexMap;
    constructor(selection: IListSelection);
    updateFilteredSelection: (filteredIndexMap: number[], multiSelect?: boolean) => void;
    select(index: number, count?: number, merge?: boolean, multiSelect?: boolean): void;
    unselect(index: number, count?: number): void;
    clear(): void;
    selectionChanged: (value: ISelectionRange[], action: string) => void;
}
