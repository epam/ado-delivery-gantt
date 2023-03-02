export var TeachingBubbleCornerPlacement;
(function (TeachingBubbleCornerPlacement) {
    /**
     * If the anchor origin is a corner, the bubble will be positioned to the right/left of the element
     */
    TeachingBubbleCornerPlacement[TeachingBubbleCornerPlacement["horizontal"] = 0] = "horizontal";
    /**
     * If the anchor origin is a corner, the bubble will be positioned above/below the element
     */
    TeachingBubbleCornerPlacement[TeachingBubbleCornerPlacement["vertical"] = 1] = "vertical";
})(TeachingBubbleCornerPlacement || (TeachingBubbleCornerPlacement = {}));
