import * as React from "react";
import { IIconProps } from '../../Icon';
import { IColor } from '../../Utilities/Color';
export declare enum PillSize {
    compact = 0,
    regular = 1,
    large = 2
}
export declare enum PillVariant {
    standard = 0,
    outlined = 1,
    colored = 2,
    themedStandard = 3
}
export interface IPillProps {
    /**
     * Whether the Pill should apply aria-hidden={true} to hide the element from screen readers.
     * This should only be done if some other element is responsible for reading the contents of the Pill.
     */
    ariaHidden?: boolean;
    /**
     * Optional aria label to pass to the pill.  Will default to the this.props.children if this.props.children is a string.
     */
    ariaLabel?: string;
    /**
     * Optional className to emit on the root element
     */
    className?: string;
    /**
     * Optional className to emit on the content
     */
    contentClassName?: string;
    /**
     * Background color for the pill
     * Ignored unless variant is set to Colored
     * If variant is set to Colored and this is not provided, we'll render as Standard and emit a warning to the console
     */
    color?: IColor;
    /**
     * Optional boolean to set if the pill is displaying a count of something
     * @default false
     */
    containsCount?: boolean;
    /**
     * The element has been exluded from a current focusZone by default.
     */
    excludeFocusZone?: boolean;
    /**
     * The element should not be tabable but still should be able to receieve focus.
     */
    excludeTabStop?: boolean;
    /**
     * Props used to render the pill icon
     * If a filled visual is provided as well, we only render the visual
     * and will emit a warning to the console
     * Using with Size = PillSize.Compact will result in no icon being rendered and a warning being printed to the console
     */
    iconProps?: IIconProps;
    /**
     * Id for the root element
     */
    id?: string;
    /**
     * Callback to handle blur events
     */
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    /**
     * onClick handler for the pill itself
     */
    onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * onFocus handler for the pill itself
     */
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    /**
     * onMouseEnter for root element
     */
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * onMouseLeave for root element
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Renders the remove button if provided
     * Handler to remove the pill
     */
    onRemoveClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Custom rendering function for left-aligned visuals
     * Using with size = PillSize.Compact will trigger a warning in the console
     * and will not render anything
     */
    onRenderFilledVisual?: () => JSX.Element;
    /**
     * Use of iconProps, onRemoveClick, or onRenderFilledVisual in conjunction with Compact will result in those elements not being rendered
     * and a warning being printed to the console
     * @default Regular
     */
    size?: PillSize;
    /**
     * Explicit tab index overrides any other focus-zone / focus-group controlled indexing
     */
    tabIndex?: number;
    /**
     * If this is set to Colored and color is not provided, we'll render as Standard and emit a warning to the console
     * @default Standard
     */
    variant?: PillVariant;
}
