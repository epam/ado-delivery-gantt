/**
 * Standard menu item types that are rendered through the menu.
 */
export var MenuItemType;
(function (MenuItemType) {
    /**
     * This uses the standard five column menu item.
     */
    MenuItemType[MenuItemType["Normal"] = 0] = "Normal";
    /**
     * This will render a divider line between the previous and next item.
     * A divider will only appear if the previous and next item are non-dividers.
     * Consecutive dividers will be merged to a single divider.
     */
    MenuItemType[MenuItemType["Divider"] = 1] = "Divider";
    /**
     * A special menu item that shows a header styled menu item in the PrimaryText column.
     */
    MenuItemType[MenuItemType["Header"] = 2] = "Header";
})(MenuItemType || (MenuItemType = {}));
/**
 * Indicates what type of menu cell is being rendered. A menu is represented by
 * five columns. If any menu item in the menu uses the column the column will be
 * shown in all items. If no menu item uses the column, the column will not be
 * visible.
 */
export var MenuCell;
(function (MenuCell) {
    /**
     * The state column is used to represent the state of the menu item. This is
     * usually either a read-only or read-write checkbox.
     */
    MenuCell[MenuCell["State"] = 0] = "State";
    /**
     * This is an Icon prefix used to represent the menu item.
     */
    MenuCell[MenuCell["Icon"] = 1] = "Icon";
    /**
     * Primary text that describes the menu item. Often this will be the only
     * column that has a value.
     */
    MenuCell[MenuCell["PrimaryText"] = 2] = "PrimaryText";
    /**
     * Secondary text is a column that is generally used to represent things
     * like hot-keys/accelerators.
     */
    MenuCell[MenuCell["SecondaryText"] = 3] = "SecondaryText";
    /**
     * Action column is used to give the user a way to represent a secondary
     * way to interact with the menu. This may be things like the submenu icon
     * or some other ui the user can independantly interact with.
     */
    MenuCell[MenuCell["Action"] = 4] = "Action";
})(MenuCell || (MenuCell = {}));
