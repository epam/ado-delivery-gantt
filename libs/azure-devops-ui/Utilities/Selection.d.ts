import { IObservableArrayEventArgs, IObservableValue, ObservableArrayAction, ObservableValue } from '../Core/Observable';
export interface ISelectionRange {
    beginIndex: number;
    endIndex: number;
}
/**
 * events:
 *  "addUnselectable": - A range specifying the updated lock.
 *  "select": - A range specifying the items that were selected.
 *  "set": - The array of ranges that were set.
 *  "setUnselectable": - The array of ranges that were set.
 *  "removeUnselectable": - A range specifying the updated lock.
 *  "unselect": - A range specifying the items that were unselected.
 */
export interface ISelection extends IObservableValue<ISelectionRange[]> {
    alwaysMerge: boolean;
    multiSelect: boolean;
    selectedCount: number;
    unselectableCount: number;
    unselectableRanges: ISelectionRange[];
    onItemsChanged: (value: IObservableArrayEventArgs<{}>, action: ObservableArrayAction) => void;
    selectable(index: number): boolean;
    selected(index: number): boolean;
    clear(): void;
    select(index: number, count?: number, merge?: boolean, multiSelect?: boolean): void;
    toggle(index: number, merge?: boolean, multiSelect?: boolean): void;
    unselect(index: number, count?: number): void;
    clearUnselectable(): void;
    addUnselectable(index: number, count?: number): void;
    removeUnselectable(index: number, count?: number): void;
    lock(): void;
    unlock(): void;
}
export interface ISelectOptions {
    /**
     * Set to true to always merge new selections with the existing selection.
     */
    alwaysMerge?: boolean;
    /**
     * Set to true to allow selecting multiple items.
     */
    multiSelect?: boolean;
    /**
     * Ranges of items whose selection value is unselectable.  Select and Unselect actions on these items will be ignored.
     */
    unselectableRanges?: ISelectionRange[];
    /**
     * Initially selected ranges of items.
     */
    selectedRanges?: ISelectionRange[];
}
export interface IHasSelection {
    selection?: ISelection;
}
export interface ISelectableUI {
    /**
     * getFocusIndex will return the row that currently contains focus. If
     * the list doesn't have focus, -1 is returned.
     */
    getFocusIndex(): number;
}
export interface IIndexed {
    index: number;
}
export declare class Selection extends ObservableValue<ISelectionRange[]> implements ISelection {
    get value(): ISelectionRange[];
    set value(ranges: ISelectionRange[]);
    get unselectableRanges(): ISelectionRange[];
    set unselectableRanges(ranges: ISelectionRange[]);
    private selectedRanges;
    private lockCount;
    private unselectableRangesValue;
    alwaysMerge: boolean;
    multiSelect: boolean;
    selectedCount: number;
    unselectableCount: number;
    constructor(options?: boolean | ISelectOptions);
    clear(): void;
    clearUnselectable(): void;
    onItemsChanged: (change: IObservableArrayEventArgs<{}>, action: ObservableArrayAction) => void;
    selectable(index: number): boolean;
    selected(index: number): boolean;
    addUnselectable(index: number, count?: number): void;
    removeUnselectable(index: number, count?: number): void;
    select(index: number, count?: number, merge?: boolean, multiSelect?: boolean): void;
    toggle(index: number, merge?: boolean, multiSelect?: boolean): void;
    unselect(index: number, count?: number): void;
    lock(): void;
    unlock(): void;
    private removeUnselectableInternal;
    private unselectInternal;
    private clearSelectedRanges;
}
export declare function indexWithinRanges(index: number, ranges?: ISelectionRange[]): boolean;
/**
 * return an array describing the difference of two sets of selection ranges.  Postive values in the array are indices in second
 * that are not in first.  Negative values in the array are indices that are in first that are not in second.
 * @param firstRanges the first set of values to use in the comparison.
 * @param secondRanges the second set of values to use in the comparison.
 */
export declare function compareSelectionRanges(firstRanges: ISelectionRange[], secondRanges: ISelectionRange[]): number[];
