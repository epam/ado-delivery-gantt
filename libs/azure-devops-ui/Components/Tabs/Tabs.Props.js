export var TabSize;
(function (TabSize) {
    /**
     * 32px tall with 14px text
     */
    TabSize["Compact"] = "compact";
    /**
     * 48px tall with 14px text
     */
    TabSize["Tall"] = "tall";
    /**
     * 40px tall with 17px text
     */
    TabSize["LargeLink"] = "large-link";
})(TabSize || (TabSize = {}));
/**
 * Defines the orientation of the child FocusZone and the flex orientation
 * of the list
 */
export var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation || (Orientation = {}));
