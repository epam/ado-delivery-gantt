import { IFilterBarItemProps } from '../../FilterBarItem';
import { IDropdownProps } from "./Dropdown.Props";
export interface IDropdownFilterBarItemProps<T = {}> extends IFilterBarItemProps, IDropdownProps<T> {
    /**
     * Don't show the Clear action.
     */
    hideClearAction?: boolean;
    /**
     * Set to true to include the placeholder as part of the selected label.
     */
    showPlaceholderAsLabel?: boolean;
    /**
     * Untoggle filter bar on clear filter
     */
    toggleFilterBar?: () => void;
}
