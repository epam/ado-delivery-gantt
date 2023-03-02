/**
 * The orientiation of a the Sizer defines whether or not it is being used
 * in a row or column of components. This is used to determine if the
 * component is sizing on the X axis (horizontally) or Y axis (vertically).
 */
export var Orientation;
(function (Orientation) {
    /**
     * Sizes on the X axis, left - right.
     */
    Orientation[Orientation["row"] = 0] = "row";
    /**
     * Sizes on the Y axis top - bottom.
     */
    Orientation[Orientation["column"] = 1] = "column";
})(Orientation || (Orientation = {}));
/**
 * Position should be defined as where the Sized component being managed
 * by the Sizer is in relationship. If the Sized component comes after
 * the Sizer is should be set to Far, otherwise Near.
 */
export var Position;
(function (Position) {
    /**
     * The Sized component appears before the Sizer.
     */
    Position[Position["near"] = 0] = "near";
    /**
     * The Sized component appears after the Sizer.
     */
    Position[Position["far"] = 1] = "far";
})(Position || (Position = {}));
