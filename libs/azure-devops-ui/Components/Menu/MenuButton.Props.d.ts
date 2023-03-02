import { IButtonProps, IExpandableButtonProps } from '../../Button';
import { IContextualMenuProps } from "./Menu.Props";
export interface IMenuButtonProps extends IButtonProps, Pick<IExpandableButtonProps, "buttonClassName"> {
    /**
     * Properties for the menu that appears when the dropdown is shown.
     */
    contextualMenuProps: IContextualMenuProps | (() => IContextualMenuProps);
    /**
     * If hideDropdownIcon is supplied the button acts as a dropdown button
     * without showing the dropdown arrows.
     */
    hideDropdownIcon?: boolean;
    /**
     * Optional callback to call when the dropdown is collapsed.
     */
    onCollapse?: () => void;
    /**
     * Optional callback to call when the dropdown is expanded.
     */
    onExpand?: () => void;
}
