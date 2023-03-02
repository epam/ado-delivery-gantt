export var SpinnerSize;
(function (SpinnerSize) {
    /**
     * 12px diameter
     */
    SpinnerSize["xSmall"] = "xsmall";
    /**
     * 16px diameter
     */
    SpinnerSize["small"] = "small";
    /**
     * 20px diameter
     */
    SpinnerSize["medium"] = "medium";
    /**
     * 28px diameter
     */
    SpinnerSize["large"] = "large";
})(SpinnerSize || (SpinnerSize = {}));
export var SpinnerOrientation;
(function (SpinnerOrientation) {
    /**
     * When a label is used render the label and animation in a row (label to the right).
     */
    SpinnerOrientation[SpinnerOrientation["row"] = 0] = "row";
    /**
     * When a label is used render the label and animation in a column (label below).
     */
    SpinnerOrientation[SpinnerOrientation["column"] = 1] = "column";
})(SpinnerOrientation || (SpinnerOrientation = {}));
