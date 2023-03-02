/// <reference types="react" />
export interface IStatusProps {
    /**
     * Animate the icon (if supported). Defaults to true for Running.
     */
    animated?: boolean;
    /**
     * If provided, will set aria label of the Status component when
     * text is not specified.
     */
    ariaLabel?: string;
    /**
     * Optional classname to add to the Status component.
     */
    className?: string;
    /**
     * Used to identify the fill color for the Status svg.
     */
    color: string;
    /**
     * Renders an icon of the provided size with the provided className,
     * and an optional aria label.
     */
    onRenderIcon: (className: string, size: StatusSize, animated?: boolean, ariaLabel?: string) => JSX.Element;
    /**
     * Size of the component.
     */
    size?: StatusSize;
    /**
     * If provided, will turn the component into an extended status pill
     * with this text.
     */
    text?: string;
    /**
     * If provided, will be displayed on pill hover.
     */
    tooltipContent?: (() => React.ReactNode) | undefined;
}
export declare enum StatusSize {
    s = "12",
    m = "16",
    l = "24",
    xl = "32"
}
