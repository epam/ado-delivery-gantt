/**
 * Enum which describes which way the children should be laid out
 */
export var SplitterDirection;
(function (SplitterDirection) {
    /**
     * Children will be laid out left to right and divided vertically
     */
    SplitterDirection[SplitterDirection["Vertical"] = 0] = "Vertical";
    /**
     * Children will be laid out top to bottom and divided horizontally
     */
    SplitterDirection[SplitterDirection["Horizontal"] = 1] = "Horizontal";
})(SplitterDirection || (SplitterDirection = {}));
/**
 * Enum which describes a position, near or far
 */
export var SplitterElementPosition;
(function (SplitterElementPosition) {
    /**
     * Left/Top element
     */
    SplitterElementPosition[SplitterElementPosition["Near"] = 0] = "Near";
    /**
     * Right/Bottom element
     */
    SplitterElementPosition[SplitterElementPosition["Far"] = 1] = "Far";
})(SplitterElementPosition || (SplitterElementPosition = {}));
