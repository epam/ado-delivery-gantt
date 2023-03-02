import { ObservableArray } from '../../Core/Observable';
import { IResponsiveLayoutProps } from '../../ResponsiveLayout';
import { IMenuItem } from "../Menu/Menu.Props";
/**
 * IResizeGroupContext is available through the ResizeGroup Consumer.
 */
export interface IResizeGroupContext {
    overflowItems?: ObservableArray<IMenuItem>;
}
/**
 * Set of properties used to create a ResizeGroup component.
 */
export interface IResizeGroupProps {
    /**
     * Props to forward to the responsive layout.
     */
    responsiveLayoutProps: IResponsiveLayoutProps;
    /**
     * An array of menu items that correspond to responsiveChildren. Hidden responsive items
     * will have their corresponding menu items forwarded to ResizeGroupContext Consumers.
     */
    overflowMenuItems: IMenuItem[];
    /**
     * Extra items are always forwarded to ResizeGroupContext Consumers as overflowing items.
     * They do not correpsond with responsive children.
     */
    extraItems?: IMenuItem[];
    /**
     * Optional boolean to keep icons for header bar but expand to have text for overflow menu
     */
    useAriaLabelForOverflow?: boolean;
}
