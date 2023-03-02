/**
 * Note the default IconSize when a custom size is not specified matches
 * the standard body-m font or 0.875rem - 14px.
 */
export var IconSize;
(function (IconSize) {
    /**
     * Inherit has the icon take on the current text size.
     */
    IconSize["inherit"] = "";
    /**
     * 1.5rem - 24px
     */
    IconSize["large"] = "large";
    /**
     * 1rem - 16px
     */
    IconSize["medium"] = "medium";
    /**
     * 0.75rem - 12px
     */
    IconSize["small"] = "small";
})(IconSize || (IconSize = {}));
