/// <reference types="react" />
import { IItemProvider } from '../../Utilities/Provider';
import { ISelection, ISelectionRange } from '../../Utilities/Selection';
export interface IItemsObserverProps<T> {
    /**
     * The selection object to update when the items change.
     */
    selection: ISelection;
    /**
     * The items to observe.
     */
    items: IItemProvider<T> | T[];
    /**
     * The function that's used to get the unselectable ranges from the item set.
     */
    getUnselectableRanges: (items: T[]) => ISelectionRange[];
    children: React.ReactElement;
}
