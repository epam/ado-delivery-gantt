/// <reference types="react" />
import { ISelection, ISelectionRange } from '../../Utilities/Selection';
export interface ISelectionObserverProps {
    /**
     * The selection object to observe.
     */
    selection: ISelection;
    /**
     * A callback to make when the selection changes.  Return true to update the child component.
     */
    onSelectionChanged?: (newSelection: ISelectionRange[], action: string) => boolean;
    /**
     * A callback to make when a a new item is selected.  Return true to update the child component.
     */
    onSelect?: (selectedIndices: ISelectionRange[]) => boolean;
    children: React.ReactNode;
}
