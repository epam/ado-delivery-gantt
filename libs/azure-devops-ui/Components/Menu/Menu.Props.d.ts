import * as React from "react";
import { IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IIconProps } from '../../Icon';
import { IFocusable } from '../../Utilities/Focus';
import { IOffset, IOrigin, IPoint } from '../../Utilities/Position';
/**
 * Details about a given item in the menu.
 */
export interface IMenuItemDetails {
    /**
     * expandedIndex defines whether or not the menu item should render subMenu's
     */
    expandedIndex: IReadonlyObservableValue<number>;
    /**
     * The instance of the menu is passed to through the menu details.
     */
    menu: IMenu;
    /**
     * Props used to render this menu.
     */
    menuProps: IMenuProps;
    /**
     * Method the menu item can use to notify the menu that the menu item was activated.
     */
    onActivate: (menuItem: IMenuItem, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    /**
     * If the menu item can receive focus, it MUST call onFocusItem when it does.
     */
    onFocusItem: (index: number, event: React.FocusEvent<HTMLElement>) => void;
    /**
     * aria position in the set.
     */
    position: number;
    /**
     * aria setsize for the menu items.
     */
    setSize: number;
}
/**
 * IMenu interface allows callers to interact with the menu through
 * an API outside of the props.
 */
export interface IMenu extends IFocusable<{}> {
    /**
     * expandItem can be called to set the given menu item to an expanded state.
     * This is generally used when the menu item has a sub menu. Many menu items
     * will not do anything in the expanded state.
     */
    expandItem: (menuItem: IMenuItem | null, expanded: boolean) => void;
    /**
     * If the menu is a subMenu, you can get the parent menu. If this is a root
     * menu undefined is returned.
     */
    getParent(): IMenu | undefined;
}
/**
 * Standard menu item types that are rendered through the menu.
 */
export declare enum MenuItemType {
    /**
     * This uses the standard five column menu item.
     */
    Normal = 0,
    /**
     * This will render a divider line between the previous and next item.
     * A divider will only appear if the previous and next item are non-dividers.
     * Consecutive dividers will be merged to a single divider.
     */
    Divider = 1,
    /**
     * A special menu item that shows a header styled menu item in the PrimaryText column.
     */
    Header = 2
}
/**
 * Indicates what type of menu cell is being rendered. A menu is represented by
 * five columns. If any menu item in the menu uses the column the column will be
 * shown in all items. If no menu item uses the column, the column will not be
 * visible.
 */
export declare enum MenuCell {
    /**
     * The state column is used to represent the state of the menu item. This is
     * usually either a read-only or read-write checkbox.
     */
    State = 0,
    /**
     * This is an Icon prefix used to represent the menu item.
     */
    Icon = 1,
    /**
     * Primary text that describes the menu item. Often this will be the only
     * column that has a value.
     */
    PrimaryText = 2,
    /**
     * Secondary text is a column that is generally used to represent things
     * like hot-keys/accelerators.
     */
    SecondaryText = 3,
    /**
     * Action column is used to give the user a way to represent a secondary
     * way to interact with the menu. This may be things like the submenu icon
     * or some other ui the user can independantly interact with.
     */
    Action = 4
}
/**
 * IMenuItem represents a single menu item in a Menu.
 */
export interface IMenuItem {
    /**
     * Aria label for the menu item.
     */
    ariaLabel?: string;
    /**
     * css class added to the menu item row element in the default rendering.
     */
    className?: string;
    /**
     * State of the menu item. This will render a checkbox if not readonly, and if
     * this is true and readonly it will render a Checkmark.
     */
    checked?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * Optional data attached to the menu item that can be used by the caller to
     * access during rendering or events.
     */
    data?: any;
    /**
     * disabled menu items will render in a disabled style and they can't be activated.
     */
    disabled?: boolean;
    /**
     * If the menu item is grouped with others they should all set the same groupKey.
     */
    groupKey?: string;
    /**
     * Hidden items will not be shown.
     */
    hidden?: boolean;
    /**
     * A menu item can act as an anchor tag by setting an href value.
     */
    href?: string;
    /**
     * iconProps are used to render the Icon column.
     */
    iconProps?: IIconProps;
    /**
     * Each menu item is required to define a unique id.
     */
    id: string;
    /**
     * The built-in rendering type for the menu item. If a custom render method is
     * supplied the itemType is ignored.
     */
    itemType?: MenuItemType;
    /**
     * onActivate is called when the user activates the menu item. This may be
     * clicking on it, or using the keyboard to activate it.
     */
    onActivate?: (menuItem: IMenuItem, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
    /**
     * rank is used to order the menu items within its group. If the menu item is not
     * grouped it will be ordered in the undefined group which occurs at the end of
     * the menu. If no menu items are grouped, this is used as the global ranking.
     */
    rank?: number;
    /**
     * readonly is used to define whether the state of the menu item should be
     * changable from the menu item itself, or only an indicator.
     */
    readonly?: boolean;
    /**
     * rel is used when the menu item is a link. It allows the caller to define how
     * the rel attribute is set. This applies when a target is specified as well.
     */
    rel?: string;
    /**
     * If the caller wants to custom render the cells for a given menu item they
     * can override this method. This means the override MUST take ownership of
     * all relevant columns.
     *
     * @param menuCell is used to communicate which cell is being rendered.
     * @param menuItem is the item that represents the current menu row.
     * @param details is the details about this menu item.
     */
    renderMenuCell?: (menuCell: MenuCell, menuItem: IMenuItem, details: IMenuItemDetails) => JSX.Element | undefined;
    /**
     * If the caller wants to custom render the entire row including the row
     * element this method can be used. The caller MUST handle all the requirements
     * as follows:
     *
     * 1) The row function MUST return a singlely rooted component that resolves
     * to single rooted element, or return a single element that is either a <tr>
     * or another acceptable tag that is marked as a display: table-row.
     *
     * 2) The row function MUST only include direct child elements that are either
     * <td>'s or acceptable elements that are maked as display: table-cell. The
     * renderer MUST return one element for each defined column even if there is
     * no data to be rendered in the column.
     *
     * 3) The row function MUST call onFocusItem when a either the row element of
     * any of the rows child elements receive focus. This is needed to ensure
     * navigation within the menu as well as in and out of the menu function
     * correctly.
     *
     * 4) The row function is responsible for all accessibility and focus
     * management within the row.
     *
     * @param index The menu item index being rendered.
     * @param menuItem The menu item being rendered.
     * @param details Details about the row and menu.
     */
    renderMenuItem?: (index: number, menuItem: IMenuItem, details: IMenuItemDetails) => JSX.Element;
    /**
     * The secondary text can be a string or other React components used to represent
     * this columns value.
     */
    secondaryText?: string;
    /**
     * If the menu item represents a sub menu it should have its sub menu props.
     */
    subMenuProps?: IMenuProps;
    /**
     * target can be used to define how a menu item that is a link should be opened.
     */
    target?: string;
    /**
     * Primary text of the menu item. This can be a string, or other React components.
     */
    text?: string;
}
/**
 * A Menu is used to render a "menu" inline in the markup. If you need a contextual
 * menu to popup make sure you use ContextualMenu instead. It is rare that you need
 * an inline Menu.
 */
export interface IMenuProps {
    /**
     * Aria label for the menu.
     */
    ariaLabel?: string;
    /**
     * css class added to the root element of the menu.
     */
    className?: string;
    /**
     * Predefined groups for the menu items. Groups do not have to be predefined,
     * but they must be in order to specify additional properties.
     */
    groups?: IMenuGroup[];
    /**
     * All menus MUST have a unique id.
     */
    id: string;
    /**
     * Set of menu items that should be rendered. This can either be an array or an
     * observable array of items. Use an observable when the set may be changed while
     * the menu is rendered.
     */
    items: IMenuItem[] | IReadonlyObservableArray<IMenuItem>;
    /**
     * onActivate is called when the user activates a given menu item.
     */
    onActivate?: (menuItem: IMenuItem, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    /**
     * If the menu is created a subMenu of an existing menu it will be given a parent
     * menu.
     */
    parentMenu?: IMenu;
}
/**
 * A ContextualMenu uses the IContextualMenuProps to render a menu in a callout.
 *
 * Positioning the ContentualMenu follows the same patterns as the callout. You
 * can use a relative element or point.
 */
export interface IContextualMenuProps {
    /**
     * The element the contextual menu is relative to. A common example is a
     * MenuButton, where the menu appears below the button.
     * (anchorOrigin should be supplied with anchorElement)
     */
    anchorElement?: HTMLElement;
    /**
     * Offset from the anchor position (element or point) for the contextual menu.
     */
    anchorOffset?: IOffset;
    /**
     * Location on the anchor element the menu should align its menuOrigin.
     */
    anchorOrigin?: IOrigin;
    /**
     * An absolute point to open the menu. This may be used to open a contextual
     * menu when right click occurs, it would open at the mouse location.
     */
    anchorPoint?: IPoint;
    /**
     * Optional CSS className to apply to the callout rendered by menu.
     */
    className?: string;
    /**
     * fixedLayout can be used to avoid re-layout. This is not recommended. This
     * will prevent the callout from moving and it the callout is clipped it will
     * remain clipped.
     */
    fixedLayout?: boolean;
    /**
     * Where on the menu to align with the anchor.
     */
    menuOrigin?: IOrigin;
    /**
     * Details about the menu being shown.
     */
    menuProps: IMenuProps;
    /**
     * onActivate is called when the user activates a given menu item.
     */
    onActivate?: (menuItem: IMenuItem, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    /**
     * onDismiss is called when the contextual menu should be dismissed. If dismisAll
     * is supplied this should notify any parent menu that it should be dismissed as
     * well.
     */
    onDismiss?: (dismissAll: boolean) => void;
    /**
     * If the menu is created a subMenu of an existing menu it will be given a parent
     * menu.
     */
    parentMenu?: IMenu;
    /**
     * Should this menu be treated as a sub menu of an existing menu. This
     * generally shouldnt be supplied when opened a root menu.
     */
    subMenu?: boolean;
}
/**
 * Defines groups for grouping IVssContextualMenuItems.
 */
export interface IMenuGroup {
    /**
     * Key used to identify the group, maps to IMenuItem.groupKey.
     */
    key: string;
    /**
     * Sets the order groups should be displayed in (lowest first, undefined and 0 last)
     */
    rank?: number;
}
/**
 * IMenuItemProps represents the props that are passed to an IMenuItem.
 */
export interface IMenuItemProps {
    /**
     * The details about the given menu item.
     */
    details: IMenuItemDetails;
    /**
     * index of the menu item in the menu.
     */
    index: number;
    /**
     * The actual menu item object.
     */
    menuItem: IMenuItem;
}
