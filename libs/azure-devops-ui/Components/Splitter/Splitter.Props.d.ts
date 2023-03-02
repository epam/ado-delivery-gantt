/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
/**
 * Enum which describes which way the children should be laid out
 */
export declare enum SplitterDirection {
    /**
     * Children will be laid out left to right and divided vertically
     */
    Vertical = 0,
    /**
     * Children will be laid out top to bottom and divided horizontally
     */
    Horizontal = 1
}
/**
 * Enum which describes a position, near or far
 */
export declare enum SplitterElementPosition {
    /**
     * Left/Top element
     */
    Near = 0,
    /**
     * Right/Bottom element
     */
    Far = 1
}
export interface ISplitterProps {
    /**
     * Optional aria-label for the divider
     */
    ariaLabel?: string;
    /**
     * Optional aria-labeledby for the divider
     */
    ariaLabelledBy?: string;
    /**
     * Optional className to apply to the splitter
     * container div.
     */
    className?: string;
    /**
     * If true, show the fixed side of the splitter in a collapsed form.
     */
    collapsed?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * Is the splitter disabled
     */
    disabled?: boolean;
    /**
     * Specific tooltip to use for the expand button that is shown in the collapsed state.
     *
     * @default "Show more information"
     */
    expandTooltip?: string;
    /**
     * Optional classname for the root Splitter far element.
     */
    farElementClassName?: string;
    /**
     * Which element is the fixed element. @default SplitterElementPosition.Far
     */
    fixedElement?: SplitterElementPosition;
    /**
     * The size of the fixed element
     */
    fixedSize?: IReadonlyObservableValue<number> | number;
    /**
     * The initial fixed size, if this element does not have a controlled width. Defaults to 50%
     */
    initialFixedSize?: number;
    /**
     * The minimum size of the fixed element
     */
    minFixedSize?: number;
    /**
     * The maximum size of the fixed element
     */
    maxFixedSize?: number;
    /**
     * Optional classname for the root Splitter near element.
     */
    nearElementClassName?: string;
    /**
     * Callback for when the collapsed mode changes. If supplied, the collapsed state will
     * be toggled
     */
    onCollapsedChanged?: (collapsed: boolean) => void;
    /**
     * Callback for when the fixed size changes
     */
    onFixedSizeChanged?: (newFixedSize: number) => void;
    /**
     * Render the content of the far (last) element
     */
    onRenderFarElement?: () => JSX.Element;
    /**
     * Render the content of the near (first) element
     */
    onRenderNearElement?: () => JSX.Element;
    /**
     * The direction of the splitter. @default SplitterDirection.Vertical
     */
    splitterDirection?: SplitterDirection;
}
