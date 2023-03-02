import * as React from "react";
import { IFilter } from '../../Utilities/Filter';
/**
 * Properties for the FilterBar component
 */
export interface IFilterBarProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * The filter store that this filter bar updates.  Apply mode handling within the filter bar is being deprecated.
     * If the filter uses apply mode, changes should be applied outside of the filter bar.
     */
    filter?: IFilter;
    /**
     * Callback that is called when the component is initially mounted. Passed an instance of the component,
     * so that methods like focus() can be called.
     */
    onMounted?: (filterBar: IFilterBar) => void;
    /**
     * Optional CSS class name to add to the filter bar container
     */
    className?: string;
    /**
     * Optional callback that is invoked after the filter bar has been rendered.
     */
    onRenderComplete?: () => void;
    /**
     * Optional callback to access the IFilterBar interface. Use this instead of ref for accessing
     * the public methods and properties of the component.
     */
    componentRef?: (component: IFilterBar) => void;
    /**
     * Optional callback to handle clicking on the filter bar dismiss button.
     */
    onDismissClicked?: () => void;
    /**
     * Optional boolean to hide clear button.
     */
    hideClearAction?: boolean;
}
export interface IFilterBar {
    /**
     * Focuses the first item in the filter bar
     */
    focus(): void;
    /**
     * Force the filter bar to re-render.
     */
    forceUpdate(): void;
}
