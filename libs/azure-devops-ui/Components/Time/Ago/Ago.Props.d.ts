import { ITooltipProps } from '../../../TooltipEx';
import { AgoFormat } from '../../../Utilities/Date';
export interface IAgoProps {
    /**
     * Assitional label for ago. First part of the label is the ago value itself.
     * Defaults to the content of the base tooltip.
     */
    ariaLabel?: string;
    /**
     * Custom className applied to pass to the <Time> component
     */
    className?: string;
    /**
     * The date object for which Duration string is required.
     */
    date: Date;
    /**
     * The format in which Duration string is required (default compact).
     */
    format?: AgoFormat;
    /**
     * tabIndex for Ago
     */
    tabIndex?: number;
    /**
     * Tooltip props that, if provided, will override the standard tooltip built
     * by the component based on the start time.
     * If no tooltip is desired, pass null.
     * If the standard tooltip is desired, don't use this prop or pass undefined.
     */
    tooltipProps?: ITooltipProps | null;
    /**
     * Locale for Ago
     */
    locale?: string;
}
