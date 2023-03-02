export declare enum SpinnerSize {
    /**
     * 12px diameter
     */
    xSmall = "xsmall",
    /**
     * 16px diameter
     */
    small = "small",
    /**
     * 20px diameter
     */
    medium = "medium",
    /**
     * 28px diameter
     */
    large = "large"
}
export declare enum SpinnerOrientation {
    /**
     * When a label is used render the label and animation in a row (label to the right).
     */
    row = 0,
    /**
     * When a label is used render the label and animation in a column (label below).
     */
    column = 1
}
export interface ISpinnerProps {
    /**
     * Optional aria-live value
     * @default polite
     */
    ariaLive?: "off" | "assertive" | "polite";
    /**
     * Optional aria-label
     */
    ariaLabel?: string;
    /**
     * Optional custom classname
     */
    className?: string;
    /**
     * Id for the spinner
     */
    id?: string;
    /**
     * Optional label text
     */
    label?: string;
    /**
     * Optional orientation when a label is used.
     *
     * @default column
     */
    orientation?: SpinnerOrientation;
    /**
     * Optional spinner size
     * @default SpinnerSize.medium
     */
    size?: SpinnerSize;
}
