import { IObservableValue } from '../../Core/Observable';
import { ITableBreakpoint } from "./Table.Props";
export interface ITableBreakpointProps {
    /**
     * Set of columns that being displayed in the table. These are used to compute the
     * breakpoints and when the breakpoints are reached the column widths are updated.
     * The column width must be an ObservableValue for the update to be applied.
     */
    breakpoints: ITableBreakpoint[];
    /**
     * The set of widths that will be managed by the table breakpoint as the available
     * space changes.
     */
    columnWidths: (number | IObservableValue<number>)[];
    /**
     * Delegate that is called when the breakpoint changes.
     */
    onBreakpoint: (breakpointIndex: number, breakpoint: number) => void;
}
