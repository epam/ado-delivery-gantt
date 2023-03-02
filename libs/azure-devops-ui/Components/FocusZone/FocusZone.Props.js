/**
 * Which direction focus moves within a FocusZone
 */
export var FocusZoneDirection;
(function (FocusZoneDirection) {
    FocusZoneDirection[FocusZoneDirection["Horizontal"] = 1] = "Horizontal";
    FocusZoneDirection[FocusZoneDirection["Vertical"] = 2] = "Vertical";
})(FocusZoneDirection || (FocusZoneDirection = {}));
/**
 * The preprocessKeyStroke method can return one of the following values
 * to modify how the current and parent focus zones treat the keystroke.
 */
export var FocusZoneKeyStroke;
(function (FocusZoneKeyStroke) {
    /**
     * Dont alter the keystroke in any way.
     */
    FocusZoneKeyStroke[FocusZoneKeyStroke["IgnoreNone"] = 1] = "IgnoreNone";
    /**
     * All parent focus zones should ignore the keystroke, but it should be
     * processed normally by the current focuszone.
     */
    FocusZoneKeyStroke[FocusZoneKeyStroke["IgnoreParents"] = 2] = "IgnoreParents";
    /**
     * All focuszones that receive the keystroke should ignore it.
     */
    FocusZoneKeyStroke[FocusZoneKeyStroke["IgnoreAll"] = 3] = "IgnoreAll";
})(FocusZoneKeyStroke || (FocusZoneKeyStroke = {}));
