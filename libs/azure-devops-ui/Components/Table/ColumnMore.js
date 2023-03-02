import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { ExpandableButton } from '../../Button';
import { ContextualMenu } from '../../Menu';
import * as Resources from '../../Resources.Widgets';
import { css, eventTargetContainsNode, KeyCode, preventDefault } from '../../Util';
import { Location } from '../../Utilities/Position';
import { IMeasurementStyle, TableColumnLayout } from "./Table.Props";
/**
 * Standard widths for the more column
 */
export var ColumnMoreWidths;
(function (ColumnMoreWidths) {
    ColumnMoreWidths[ColumnMoreWidths["compact"] = 2] = "compact";
    ColumnMoreWidths[ColumnMoreWidths["default"] = 2.625] = "default";
})(ColumnMoreWidths || (ColumnMoreWidths = {}));
/**
 * The ColumnMore class is used as a custom column within a Table.
 *
 * It renders a fixed width column with a button that is visible on focus and
 * hover that will show a contextual menu for the given item. The caller
 * should create a new instance of this for each table. The header for this
 * column is empty.
 *
 * When creating the column you must supply delegate that is used to get the
 * menuProps when the menu is opened.
 */
var ColumnMore = /** @class */ (function () {
    /**
     * Creates an instance of ColumnMore with the appropriate delegates.
     *
     * @param menuProvider Method that returns the menu props. This is called
     *  with the item from the row the menu was activated on.
     * @param menuAvailable Optional method that is called when the row
     *  is rendered. The MoreButton will be shown if no method is supplied
     *  or if the method is supplied and it returns true.
     */
    function ColumnMore(menuProvider, menuAvailable, onActivate, width, refs) {
        var _this = this;
        if (width === void 0) { width = ColumnMoreWidths.default; }
        this.ariaLabel = Resources.MoreActions;
        this.columnLayout = TableColumnLayout.none;
        this.id = "_more";
        this.widthStyle = IMeasurementStyle.REM;
        this.renderCell = function (rowIndex, columnIndex, tableColumn, listItem) {
            var _a;
            var buttonRef = React.createRef();
            if (_this.refs && !_this.refs.value[rowIndex]) {
                _this.refs.value[rowIndex] = buttonRef;
            }
            return (React.createElement("td", { "aria-colindex": columnIndex + 1, className: css("bolt-table-cell-side-action bolt-table-cell bolt-list-cell", "col-" + columnIndex), "data-column-index": columnIndex, key: "col-more", onClick: _this.onClick, onDoubleClick: preventDefault, onKeyDown: _this.onKeyDown, onMouseDown: preventDefault }, !_this.menuAvailable || _this.menuAvailable(listItem) ? (React.createElement("div", { className: "bolt-table-cell-content-reveal flex-row justify-center" },
                React.createElement(ExpandableButton, { ariaLabel: Resources.MoreTooltip, className: "bolt-table-button-more", excludeTabStop: true, hideDropdownIcon: true, iconProps: { className: "small", iconName: "MoreVertical" }, onClick: function (e) {
                        if (_this.onActivate) {
                            _this.onActivate(rowIndex, columnIndex, e);
                        }
                    }, ref: (_a = _this.refs) === null || _a === void 0 ? void 0 : _a.value[rowIndex], renderCallout: function (dropdown, dropdownId, anchorElement) {
                        return (React.createElement(ContextualMenu, { anchorElement: anchorElement, anchorOrigin: { horizontal: Location.end, vertical: Location.end }, menuProps: _this.menuProvider(listItem, rowIndex, buttonRef), menuOrigin: { horizontal: Location.end, vertical: Location.start }, onDismiss: dropdown.collapse }));
                    }, subtle: true, tooltipProps: { text: Resources.MoreTooltip } }))) : (React.createElement("span", { className: "bolt-table-cell-content visually-hidden" }, Resources.NoMoreActions))));
        };
        this.renderHeaderCell = function (columnIndex, tableColumn) {
            return (React.createElement("th", { "aria-colindex": columnIndex + 1, "aria-label": tableColumn.ariaLabel, className: css(tableColumn.headerClassName, "bolt-table-header-cell bolt-table-header-cell-empty", "col-header-" + columnIndex), "data-column-index": columnIndex, key: "col-more" }));
        };
        this.onClick = function (event) {
            if (!event.defaultPrevented) {
                if (!eventTargetContainsNode(event, ["A"], document.body)) {
                    event.preventDefault();
                }
            }
        };
        this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.enter || event.which === KeyCode.space) {
                    if (!eventTargetContainsNode(event, ["A"])) {
                        event.preventDefault();
                    }
                }
            }
        };
        this.menuAvailable = menuAvailable;
        this.menuProvider = menuProvider;
        this.onActivate = onActivate;
        this.width = new ObservableValue(width);
        this.refs = refs;
    }
    return ColumnMore;
}());
export { ColumnMore };
