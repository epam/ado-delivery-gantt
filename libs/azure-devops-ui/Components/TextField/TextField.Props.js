/**
 * Defines how the TextField is styled
 */
export var TextFieldStyle;
(function (TextFieldStyle) {
    /**
     * Rendered closer to a typical <input />
     */
    TextFieldStyle[TextFieldStyle["normal"] = 0] = "normal";
    /**
     * Rendered with no border and a non-white background
     */
    TextFieldStyle[TextFieldStyle["inline"] = 1] = "inline";
})(TextFieldStyle || (TextFieldStyle = {}));
/**
 * Defines how the focus treatment should be rendered for the TextField.
 */
export var TextFieldFocusTreatmentBehavior;
(function (TextFieldFocusTreatmentBehavior) {
    /**
     * Focus treatment will appear when the TextField has focus via mouse or keyboard
     */
    TextFieldFocusTreatmentBehavior[TextFieldFocusTreatmentBehavior["all"] = 0] = "all";
    /**
     * Focus treatment will only appear when the TextField has focus via keyboard
     */
    TextFieldFocusTreatmentBehavior[TextFieldFocusTreatmentBehavior["keyboardOnly"] = 1] = "keyboardOnly";
    /**
     * Focus treatment will never appear (used within FilterBar)
     */
    TextFieldFocusTreatmentBehavior[TextFieldFocusTreatmentBehavior["none"] = 2] = "none";
})(TextFieldFocusTreatmentBehavior || (TextFieldFocusTreatmentBehavior = {}));
// /**
//  * Defines the TextField's width
//  */
export var TextFieldWidth;
(function (TextFieldWidth) {
    /**
     * No width property is added to the TextField, it will grow to fill its container.
     */
    TextFieldWidth["auto"] = "auto";
    /**
     * A standard width of 296px is set for the TextField
     */
    TextFieldWidth["standard"] = "bolt-textfield-default-width";
    /**
     * Width for the TextField when it is used inline within a TabBar
     */
    TextFieldWidth["tabBar"] = "bolt-textfield-inline-tabbar-width";
})(TextFieldWidth || (TextFieldWidth = {}));
