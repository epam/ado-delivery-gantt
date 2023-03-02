/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IColor } from '../../Utilities/Color';
/**
 * Label Model to be used by other components that manage the props of their labels individually
 * eg. LabelGroup takes an array of these instead of LabelProps
 */
export interface ILabelModel {
    /**
     * Background color of the label
     */
    color?: IColor;
    /**
     * Text string for the label content
     */
    content: string;
}
/**
 * Actual Label Props used to render a Label
 */
export interface ILabelProps extends ILabelModel {
    /**
     * Optional className
     */
    className?: string;
    /**
     * Optional boolean to enable or disable hover effects
     * @default false
     */
    enableHover?: boolean;
    /**
     * The element has been exluded from a current focusZone by default.
     */
    excludeFocusZone?: boolean;
    /**
     * The element should not be tabable but still should be able to receieve focus.
     */
    excludeTabStop?: boolean;
    /**
     * Id for the root element
     */
    id?: string;
    /**
     * onBlur event handler for the Label
     */
    onBlur?: () => void;
    /**
     * onClick event handler for the Label
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * onFocus event handler for the Label
     */
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
    /**
     * onKeyDown when the Label is focused
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    /**
     * onMouseDown event handler for the Label
     */
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Controls rendering of the control as "selected"
     */
    selected?: boolean | IReadonlyObservableValue<boolean>;
    /**
     * Explicit tab index overrides any other focus-zone / focus-group controlled indexing
     */
    tabIndex?: number;
}
