import { ITooltipProps } from '../../../TooltipEx';
export interface IDurationProps {
    /**
     * Optional aria-hidden
     */
    ariaHidden?: boolean;
    /**
     * Addtional label for the duration. First part of the label is duration itself.
     * Defaults to the content of the base tooltip.
     */
    ariaLabel?: string;
    /**
     * Custom className applied to pass to the <Time> component
     */
    className?: string;
    /**
     * The end date object for which Duration string is required.
     */
    endDate?: Date;
    /**
     * The start date object for which Duration string is required.
     */
    startDate: Date;
    /**
     * tabIndex for ago
     */
    tabIndex?: number;
    /**
     * Tooltip props that, if provided, will override the standard tooltip built
     * by the component based on the start time.
     * If no tooltip is desired, pass null.
     * If the standard tooltip is desired, don't use this prop or pass undefined.
     */
    tooltipProps?: ITooltipProps | null;
}
