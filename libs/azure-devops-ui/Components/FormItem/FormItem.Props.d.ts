import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
export interface IFormItemContext {
    /**
     * The id to use as the consuming component's ariaDescribedBy
     */
    ariaDescribedById?: string;
    /**
     * The id to use as the consuming component's ariaLabelledBy
     */
    ariaLabelledById?: string;
    /**
     * Whether or not the FormItem is in an error state. Consuming components
     * can alter their visualization based on this prop.
     *
     * @default false
     */
    error?: boolean;
}
export interface IFormItemProps {
    /**
     * Optional aria label that can be supplied if is should be something different than label.
     */
    ariaLabel?: string;
    /**
     * Optional className to include on the element that wraps the item's
     */
    className?: string;
    /**
     * Whether or not the form item is currently in an error state.
     */
    error?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * A label for the component. Will be wrapped in a <label /> element.
     */
    label?: React.ReactNode;
    /**
     * A helper message to include with the component. Will be wrapped in a <span /> element.
     */
    message?: IReadonlyObservableValue<React.ReactNode> | React.ReactNode;
}
