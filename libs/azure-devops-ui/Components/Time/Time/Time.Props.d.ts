import { ITooltipProps } from '../../../TooltipEx';
export interface ITimeProps {
    /**
     * Optional aria-hidden
     */
    ariaHidden?: boolean;
    /**
     * Addtional label for the time. First part of the label is the datetime.
     */
    ariaLabel?: string;
    /**
     * Custom className applied to the <time> or <span> element
     */
    className?: string;
    /**
     * The date time that will be machine readable.
     */
    dateTime?: Date;
    /**
     * Reference to the function which returns time interval before next refresh.
     */
    getNextInterval: () => number;
    /**
     * The reference to function which returns a string to display.
     */
    getTimeString: () => string;
    /**
     * tabIndex for time
     */
    tabIndex?: number;
    /**
     * The tool tip to be displayed.
     */
    tooltipProps?: ITooltipProps | null;
}
