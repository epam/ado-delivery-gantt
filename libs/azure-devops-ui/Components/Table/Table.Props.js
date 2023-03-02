/**
 * TableColumnLayout is used to define the general shape of the data for a given
 * column. One of the purposes of this is an animation when the rows are loaded
 * asynchronously.
 *
 * If the caller wants non-standard shapes a custom loading row function will need
 * to be implemented. For any columns that fit the standard shapes the exported
 * functions can be used.
 */
export var TableColumnLayout;
(function (TableColumnLayout) {
    /**
     * If a column is noted as none, when an asynchronous row is loaded no
     * animation will be added to this column.
     */
    TableColumnLayout[TableColumnLayout["none"] = 0] = "none";
    /**
     * The row uses a single line of text. This is the default for a column that
     * doesnt explicitly define a column layout
     */
    TableColumnLayout[TableColumnLayout["singleLine"] = 1] = "singleLine";
    /**
     * The row uses a single line of text with a small prefix.
     */
    TableColumnLayout[TableColumnLayout["singleLinePrefix"] = 2] = "singleLinePrefix";
    /**
     * The row uses two lines of text.
     */
    TableColumnLayout[TableColumnLayout["twoLine"] = 3] = "twoLine";
    /**
     * The row uses two lines of text with a large prefex.
     */
    TableColumnLayout[TableColumnLayout["twoLinePrefix"] = 4] = "twoLinePrefix";
})(TableColumnLayout || (TableColumnLayout = {}));
/**
 * The ColumnStyles effect how the values for the column should be rendered.
 */
export var TableColumnStyle;
(function (TableColumnStyle) {
    /**
     * Secondary colums should be rendered normally.
     */
    TableColumnStyle[TableColumnStyle["Secondary"] = 1] = "Secondary";
    /**
     * Primary columns should be rendered with emphasis.
     */
    TableColumnStyle[TableColumnStyle["Primary"] = 2] = "Primary";
    /**
     * Tertiary columns should be rendered de-emphasized.
     */
    TableColumnStyle[TableColumnStyle["Tertiary"] = 3] = "Tertiary";
})(TableColumnStyle || (TableColumnStyle = {}));
/**
 * Sorting order for columns
 */
export var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["ascending"] = 0] = "ascending";
    SortOrder[SortOrder["descending"] = 1] = "descending";
})(SortOrder || (SortOrder = {}));
/**
 * Justification of the content within a column
 */
export var ColumnJustification;
(function (ColumnJustification) {
    ColumnJustification[ColumnJustification["Left"] = 0] = "Left";
    ColumnJustification[ColumnJustification["Right"] = 1] = "Right";
})(ColumnJustification || (ColumnJustification = {}));
/**
 * An IMeasurementStyle is used to represent a fixed size. The fixed size may be
 * based on a number of base measurement values.
 */
export var IMeasurementStyle;
(function (IMeasurementStyle) {
    /**
     * Pixels represented by the 'px' css measurement.
     */
    IMeasurementStyle[IMeasurementStyle["Pixel"] = 0] = "Pixel";
    /**
     * RootEMs represented by the 'rem' css measurement.
     */
    IMeasurementStyle[IMeasurementStyle["REM"] = 1] = "REM";
})(IMeasurementStyle || (IMeasurementStyle = {}));
