import { IFilter } from '../../Utilities/Filter';
/**
 * Base set of properties for any filter bar item component
 */
export interface IFilterBarItemProps {
    componentRef?: (component: IFilterBarItem) => void;
    /**
     * The filter store that this filter bar updates (optional, the parent FilterBar's filter is used by default)
     */
    filter?: IFilter;
    /**
     * The unique key for this filter item whose value is updated by changes to this filter item.
     */
    filterItemKey: string;
    /**
     * Text to show for the filter in the case that there is no current value
     */
    placeholder?: string;
    /**
     * Comparer of filter values to determine when the filter needs to be updated.
     */
    filterValueComparer?: (a: any, b: any) => boolean;
    /**
     * Key for FilterBarItem. If this is changed, will always update state with new props.
     */
    setKey?: string;
    /**
     *
     */
    isTextItem?: boolean;
}
export interface IFilterBarItem {
    /**
     * Focuses the item
     */
    focus(): void;
    /**
     * Re-render the FilterBarItem
     */
    forceUpdate(): void;
}
