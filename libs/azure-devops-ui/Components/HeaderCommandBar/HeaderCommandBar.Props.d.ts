/// <reference types="react" />
import { IObservableValue } from '../../Core/Observable';
import { IButtonProps } from '../../Button';
import { IFocusGroupProps } from '../../FocusGroup';
import { IMenuButtonProps, IMenuItem } from '../../Menu';
import { ITooltipProps } from '../../TooltipEx';
import { IFilter } from '../../Utilities/Filter';
export interface IHeaderCommandBar {
}
export interface IHeaderCommandBarItem extends IMenuItem {
    /**
     * Adds aria-checked to the element.
     */
    ariaChecked?: boolean;
    /**
     * Adds aria-controls to the element.
     *
     * NOTE: Give the base Id in this case, NOT the getSafeId.
     */
    ariaControls?: string;
    /**
     * Adds aria-describedby to the element.
     *
     * NOTE: Give the base Id in this case, NOT the getSafeId.
     */
    ariaDescribedBy?: string;
    /**
     * Adds aria-expanded to the element.
     */
    ariaExpanded?: boolean;
    /**
     * Adds aria-haspopup to the element.
     */
    ariaHasPopup?: boolean;
    /**
     * An aria label to add to the command bar item.
     */
    ariaLabel?: string;
    /**
     * Adds aria-posinset to the element.
     */
    ariaPosInSet?: number;
    /**
     * Adds aria-roledescription to the element.
     */
    ariaRoleDescription?: string;
    /**
     * Adds aria-pressed to the element.
     */
    ariaPressed?: boolean;
    /**
     * Adds aria-selected to the element.
     */
    ariaSelected?: boolean;
    /**
     * Adds aria-setsize to the element.
     */
    ariaSetSize?: number;
    /**
     * Indicates that the dropdown chevron should not be shown.
     * Only applies to items that have subMenuProps.
     */
    hideDropdownIcon?: boolean;
    /**
     * A value of true means the item will always be rendered as
     * a button directly in the header.
     * A value of false means the item will always be rendered in
     * an overflow button.
     * Undefined means that the HeaderCommandBar will determine
     * where the item is rendered.
     */
    important?: boolean;
    /**
     * Determines if we render as a primary button or not
     */
    isPrimary?: boolean;
    /**
     * The items will be sorted by rank if rank is present.
     */
    rank?: number;
    /**
     *  A custom renderer for the command bar item when rendered in the header
     */
    renderButton?(props: IButtonProps | IMenuButtonProps): JSX.Element;
    /**
     * Override the default "menuItem" role for the item
     */
    role?: string;
    /**
     * Uses a subtle button when rendering this item - only applies
     * when the item is not in overflow
     */
    subtle?: boolean;
    /**
     * Optional tooltip props to display
     */
    tooltipProps?: ITooltipProps;
}
export interface IHeaderCommandBarProps {
    /**
     * How many buttons to show if there is room.  The rest will be sent to overflow if they are not marked as important.
     * @default 3
     */
    buttonCount?: number;
    /**
     * Additional classes to be applied to component
     */
    className?: string;
    /**
     * Items to display in the far-right Command Bar
     * Should influence page-wide state
     */
    items: IHeaderCommandBarItem[];
    /**
     * Optional id to apply to the overflow more button.
     */
    moreButtonId?: string;
    /**
     * Optional CSS className to apply to the callout rendered by overflow menu button.
     */
    overflowClassName?: string;
    /**
     * Optional boolean to keep icons for header bar but expand to have text for overflow menu
     */
    useAriaLabelForOverflow?: boolean;
}
export interface ICustomHeaderCommandBarProps {
    /**
     * Additional classes to be applied to component
     */
    className?: string;
    /**
     * Focus group props to use in the focus zone that wraps the ButtonGroup
     */
    focusGroupProps?: IFocusGroupProps;
    /**
     * Whether or not the last child is an icon button - will adjust right padding
     */
    lastItemIsIconButton?: boolean;
    /**
     * Optional role to apply to the div containing the command bar, e.g. "menubar"
     */
    role?: string;
}
export interface IHeaderCommandBarWithFilterProps extends IHeaderCommandBarProps {
    /**
     * A filter object to listen to changes on. When there are changes, the filter icon
     * will be displayed as filled.
     */
    filter: IFilter;
    /**
     * The current state of whether the filter is visible or hidden. The value is toggled
     * by the onClick on the item.
     */
    filterToggled: IObservableValue<boolean | undefined>;
}
