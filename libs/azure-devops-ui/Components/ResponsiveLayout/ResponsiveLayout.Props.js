/**
 * The response layout can be used to adjust the children based on either a horizonal or
 * vertical layout but not both at the same time.
 */
export var ResponsiveOrientation;
(function (ResponsiveOrientation) {
    /**
     * Components are measured by width and adjusted based on the the width of the parent
     * element.
     */
    ResponsiveOrientation[ResponsiveOrientation["Horizontal"] = 0] = "Horizontal";
    /**
     * Components are measure by height and adjusted based on the height of the parent
     * element.
     */
    ResponsiveOrientation[ResponsiveOrientation["Vertical"] = 1] = "Vertical";
})(ResponsiveOrientation || (ResponsiveOrientation = {}));
