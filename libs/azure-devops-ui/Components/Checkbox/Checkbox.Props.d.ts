import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { ITooltipProps } from '../../TooltipEx';
export interface ITriStateCheckboxProps {
    /**
     * Id of another element which describes this one for screen reader users.
     */
    ariaDescribedBy?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     * Defaults to this checkbox's label element.
     */
    ariaLabelledBy?: string;
    /**
     * Aria Label for the Checkbox for screen reader users.
     */
    ariaLabel?: string;
    /**
     * The checked state of the checkbox.
     */
    checked: IReadonlyObservableValue<boolean | undefined> | boolean | undefined;
    /**
     * Optional class name to add to the checkbox element.
     */
    className?: string;
    /**
     * If true, the checkbox cannot be interacted with.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * Set to true if you don't want the checkbox's focus managed by a FocusZone.
     *
     * @default false
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true to omit setting the tab index to 0.
     *
     * @default false
     */
    excludeTabStop?: boolean;
    /**
     * Additional focuszoneId the checkbox should be included in.
     */
    focuszoneId?: string;
    /**
     * An id to pass to the checkbox element.
     */
    id?: string;
    /**
     * An optional label to render next to the checkbox.
     */
    label?: React.ReactNode;
    /**
     * An id to pass to the label element.
     */
    labelId?: string;
    /**
     * An optional callback to handle checked state change events.
     */
    onChange?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, checked: boolean | undefined) => void;
    /**
     * The aria role to put on the checkbox element.
     *
     * @default checkbox
     */
    role?: string;
    /**
     * Sets the tabindex on the button element.
     */
    tabIndex?: number;
    /**
     * Optional tooltip to show when the checkbox is hovered.
     */
    tooltipProps?: ITooltipProps;
    /**
     * A triState checkbox means the checkbox can be in one of three states:
     * 1) Unchecked - checked = false
     * 2) Checked - checked = true
     * 3) Indeterminate - checked = undefined
     *
     * If undefined is passed as the value a checkbox it will show in the
     * indeterminate state, but when changed it will switch back and forth between
     * unchecked and checked. If triState is set to true, the rotation will go
     * through the states in the order above.
     *
     * @default false
     */
    triState?: boolean;
}
export interface ICheckboxProps extends ITriStateCheckboxProps {
    /**
     * The checked state of the checkbox.
     */
    checked: IReadonlyObservableValue<boolean> | boolean;
    /**
     * An optional callback to handle checked state change events.
     */
    onChange?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, checked: boolean) => void;
}
