import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { format } from '../../Core/Util/String';
import { FocusOrMouseWithin } from '../../FocusOrMouseWithin';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { Icon } from '../../Icon';
import { Intersection } from '../../Intersection';
import { getDefaultLinkProps } from '../../Link';
import { List, renderListCell } from '../../List';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Widgets';
import { Orientation, Position, Sizer } from '../../Sizer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, KeyCode } from '../../Util';
import { EventDispatch } from '../../Utilities/Dispatch';
import { getTabIndex } from '../../Utilities/Focus';
import { ScreenSizeConditional } from '../../Utilities/ScreenSize';
import { ColumnJustification, IMeasurementStyle, SortOrder, TableColumnLayout, TableColumnStyle } from "./Table.Props";
import { TableBreakpoint } from "./TableBreakpoint";
/** Id used for the ColumnFill */
export var ColumnFillId = "_fill";
/**
 * ColumnFill is used to fill the remaining space in the parent element with an
 * empty column. This column can be used anywhere in the column order. Columns
 * that appear after this will be pushed to the right.
 */
export var ColumnFill = {
    columnLayout: TableColumnLayout.none,
    id: ColumnFillId,
    renderCell: function (rowIndex, columnIndex) {
        return (React.createElement("td", { key: "col-fill", "aria-colindex": columnIndex + 1, "aria-hidden": true, className: css("bolt-table-cell bolt-list-cell", "col-" + columnIndex), "data-column-index": columnIndex, role: "presentation" }));
    },
    renderHeaderCell: function (columnIndex, tableColumn) {
        return (React.createElement("th", { key: "col-fill", "aria-hidden": true, className: css(tableColumn.headerClassName, "bolt-table-header-cell bolt-table-header-cell-empty", "col-header-" + columnIndex), "data-column-index": columnIndex, role: "presentation" }));
    },
    width: -100
};
/**
 * The Table is a multi-column List component with an optional header.
 */
var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(props) {
        var _this = _super.call(this, props) || this;
        _this.currentElement = React.createRef();
        // Reference to the underlying list interface.
        _this.list = React.createRef();
        _this.onBreakpoint = function () {
            var visibleColumnsKey = _this.props.tableBreakpoints
                ? getVisibleColumnsAndIndices(_this.props.columns)
                    .map(function (_a) {
                    var originalIndex = _a.originalIndex;
                    return originalIndex;
                })
                    .join(",")
                : "";
            // If any column has toggled its visibility, we have to re-render.
            if (_this.state.renderInvisible || _this.state.visibleColumnsKey !== visibleColumnsKey) {
                _this.setState({ renderInvisible: false, visibleColumnsKey: visibleColumnsKey });
            }
        };
        _this.onColumnsChanged = function () {
            _this.forceUpdate();
            return false;
        };
        _this.renderHeader = function () {
            var _a = _this.props, columns = _a.columns, showHeader = _a.showHeader, renderHeader = _a.renderHeader, spacerWidth = _a.spacerWidth;
            var widths = [];
            var proportionalTotal = 0;
            // Determine the percentage for proportionally sized columns.
            for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                var width = ObservableLike.getValue(columns[columnIndex].width);
                if (width < 0) {
                    proportionalTotal += width;
                }
            }
            // Compute the width of all columns based on the fixed/proportional values
            for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                var width = ObservableLike.getValue(columns[columnIndex].width);
                widths[columnIndex] = width >= 0 ? width : -((width / proportionalTotal) * 100);
            }
            var header = null;
            // 0 is a valid ScreenSize, so we have strict inequality checking here
            if (showHeader !== false) {
                header = renderHeader ? renderHeader(columns) : React.createElement(TableHeader, { tableColumns: columns });
            }
            if (typeof showHeader === "function") {
                header = React.createElement(ScreenSizeConditional, { condition: function (screenSize) { return showHeader(screenSize); } }, header);
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("colgroup", null,
                    React.createElement("col", { "aria-hidden": "true", key: "col-group-left-spacer", style: { width: spacerWidth === 0 ? spacerWidth + "%" : spacerWidth + "px" } }),
                    getVisibleColumnsAndIndices(columns).map(function (_a) {
                        var column = _a.column, originalIndex = _a.originalIndex;
                        var _b = column.widthStyle, widthStyle = _b === void 0 ? IMeasurementStyle.Pixel : _b;
                        return (React.createElement(Observer, { key: "col-group-" + originalIndex, width: {
                                filter: _this.onColumnsChanged,
                                observableValue: column.width
                            } }, function () { return (React.createElement("col", { style: {
                                width: Math.abs(widths[originalIndex]) +
                                    (widths[originalIndex] < 0 ? "%" : widthStyle === IMeasurementStyle.Pixel ? "px" : "rem")
                            } })); }));
                    }),
                    React.createElement("col", { "aria-hidden": "true", key: "col-group-right-spacer", style: { width: spacerWidth === 0 ? spacerWidth + "%" : spacerWidth + "px" } })),
                header));
        };
        _this.renderLoadingRow = function (rowIndex, details) {
            var _a;
            var _b = _this.props, columns = _b.columns, renderLoadingRow = _b.renderLoadingRow;
            var rowDetails = {
                ariaBusy: true,
                ariaRowOffset: details.ariaRowOffset,
                data: details.data,
                eventDispatch: _this.state.eventDispatch,
                excludeFocusZone: true,
                excludeTabStop: (_a = _this.props.excludeTabStop) !== null && _a !== void 0 ? _a : details.excludeTabStop,
                itemProvider: _this.props.itemProvider,
                listProps: details.listProps,
                onFocusItem: details.onFocusItem,
                renderSpacer: _this.props.renderSpacer,
                selection: _this.props.selection,
                singleClickActivation: _this.props.onActivate && _this.props.singleClickActivation
            };
            // If a custom row loading animation is available use it.
            if (renderLoadingRow) {
                return renderLoadingRow(rowIndex, rowDetails);
            }
            return React.createElement(TableLoadingRow, { columns: columns, details: rowDetails, rowIndex: rowIndex });
        };
        _this.renderRow = function (rowIndex, item, details) {
            var _a;
            var rowDetails = {
                selectableText: details.selectableText,
                ariaRowOffset: details.ariaRowOffset,
                eventDispatch: _this.state.eventDispatch,
                data: details.data,
                excludeTabStop: (_a = _this.props.excludeTabStop) !== null && _a !== void 0 ? _a : details.excludeTabStop,
                itemProvider: _this.props.itemProvider,
                listProps: details.listProps,
                onFocusItem: details.onFocusItem,
                renderSpacer: _this.props.renderSpacer,
                selection: _this.props.selection,
                singleClickActivation: _this.props.onActivate && _this.props.singleClickActivation
            };
            // First determine if the item supplied a custom row rendering function, if not
            // attempt to use the global row rendering function.
            var renderRow = item.renderRow || _this.props.renderRow;
            if (renderRow) {
                return renderRow(rowIndex, item, rowDetails);
            }
            // If no custom row renderer is available use the default row renderer.
            return (React.createElement(TableRow, { details: rowDetails, index: rowIndex, linkProps: item.linkProps }, renderColumns(rowIndex, _this.props.columns, item, rowDetails)));
        };
        _this.state = {
            columnBehaviors: [],
            eventDispatch: props.eventDispatch || new EventDispatch(),
            renderInvisible: !!props.tableBreakpoints,
            visibleColumnsKey: "",
            tableBehaviors: [],
            tableWidth: ""
        };
        // Initialize any column behaviors.
        for (var columnIndex = 0; columnIndex < props.columns.length; columnIndex++) {
            var tableColumn = props.columns[columnIndex];
            if (tableColumn.behaviors) {
                for (var _i = 0, _a = tableColumn.behaviors; _i < _a.length; _i++) {
                    var behavior = _a[_i];
                    if (behavior && behavior.initialize) {
                        behavior.initialize({ tableProps: props, columnIndex: columnIndex }, {}, _this.state.eventDispatch);
                    }
                }
            }
        }
        // Initialize the supplied behaviors.
        if (props.behaviors) {
            for (var _b = 0, _c = props.behaviors; _b < _c.length; _b++) {
                var behavior = _c[_b];
                if (behavior.initialize) {
                    behavior.initialize(props, _this, _this.state.eventDispatch);
                }
            }
        }
        return _this;
    }
    Table.getDerivedStateFromProps = function (props, state) {
        var tableBehaviors = [];
        var columnBehaviors = [];
        // Build the set of behaviors columns have attached to them
        for (var columnIndex = 0; columnIndex < props.columns.length; columnIndex++) {
            var tableColumn = props.columns[columnIndex];
            if (tableColumn.behaviors) {
                for (var _i = 0, _a = tableColumn.behaviors; _i < _a.length; _i++) {
                    var behavior = _a[_i];
                    columnBehaviors.push(behavior);
                }
            }
        }
        // Build the set of behaviors the table has attached to it
        if (props.behaviors) {
            tableBehaviors.splice.apply(tableBehaviors, __spreadArrays([tableBehaviors.length, 0], props.behaviors));
        }
        return {
            columnBehaviors: columnBehaviors,
            tableBehaviors: tableBehaviors
        };
    };
    Table.prototype.render = function () {
        var _a = this.state, eventDispatch = _a.eventDispatch, renderInvisible = _a.renderInvisible, visibleColumnsKey = _a.visibleColumnsKey;
        var _b = this.props, selectableText = _b.selectableText, className = _b.className, columns = _b.columns, containerClassName = _b.containerClassName, enforceSingleSelect = _b.enforceSingleSelect, focuszoneProps = _b.focuszoneProps, showLines = _b.showLines, id = _b.id, itemProvider = _b.itemProvider, maxHeight = _b.maxHeight, onActivate = _b.onActivate, onFocus = _b.onFocus, onSelect = _b.onSelect, pageSize = _b.pageSize, role = _b.role, rowHeight = _b.rowHeight, rowHeights = _b.rowHeights, scrollable = _b.scrollable, selection = _b.selection, singleClickActivation = _b.singleClickActivation, selectRowOnClick = _b.selectRowOnClick, showScroll = _b.showScroll, tableBreakpoints = _b.tableBreakpoints, virtualize = _b.virtualize;
        var columnWidths = [];
        var spacerWidth = (this.props.spacerWidth || 0) * 2;
        var tableMaxWidth = spacerWidth;
        var tableMinWidth = spacerWidth;
        var tableWidth = spacerWidth;
        var hasBoundedColumn = false;
        var hasUnboundedColumn = false;
        var fill = false;
        var columnCount = 0;
        var columnFillCount = 0;
        // Compute the table size based on the current column definition. Size the sizes
        // are observable, we need to recompute each render to ensure we have the
        // proper values.
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            var maxWidth = column.maxWidth, minWidth = column.minWidth, _c = column.widthStyle, widthStyle = _c === void 0 ? IMeasurementStyle.Pixel : _c;
            var width = ObservableLike.getValue(column.width);
            // Add the column width the set of available columnWidths.
            columnWidths.push(column.width);
            if (width < 0) {
                // This is a variable width columnn so we will fill the container.
                fill = true;
                // Update the min/max width of the table based on the supplied value.
                // We use a minumum width of 100px if one isnt specified.
                tableMinWidth += minWidth ? minWidth : 0;
                // If all variable width columns have a maxWidth, let the table fill the available
                // space, but set the table's max width to the sum of the column widths/maxWidths.
                if (maxWidth) {
                    hasBoundedColumn = true;
                    tableMaxWidth += maxWidth;
                }
                else {
                    // If there are any variable width columns without maxWidth, let the table
                    // fill the available space with no maxWidth.
                    hasUnboundedColumn = true;
                }
                columnCount++;
            }
            else if (width > 0) {
                if (widthStyle === IMeasurementStyle.Pixel) {
                    tableWidth += width;
                    tableMinWidth += width;
                    tableMaxWidth += width;
                }
                else {
                    // @NOTE: For now we are going to estimate a rem = 16px which is the default.
                    //  We could attempt to measure this if an exact measurement is really important.
                    tableWidth += width * 16;
                    tableMinWidth += width * 16;
                    tableMaxWidth += width * 16;
                }
                columnCount++;
            }
            if (column.id === "_fill") {
                columnFillCount++;
            }
        }
        var listProps = {
            selectableText: selectableText,
            ariaColumnCount: columnCount - columnFillCount,
            ariaLabel: this.props.ariaLabel,
            ariaRowOffset: this.props.showHeader ? 1 : 0,
            className: css(className, "bolt-table", showLines && "bolt-table-show-lines"),
            columnCount: columnCount + 2,
            enforceSingleSelect: enforceSingleSelect,
            eventDispatch: eventDispatch,
            focuszoneProps: focuszoneProps,
            id: id,
            itemProvider: itemProvider,
            maxWidth: hasBoundedColumn && !hasUnboundedColumn ? tableMaxWidth + "px" : undefined,
            maxHeight: maxHeight,
            minWidth: tableMinWidth !== tableWidth ? tableMinWidth + "px" : undefined,
            onActivate: onActivate,
            onFocus: onFocus,
            onSelect: onSelect,
            pageSize: pageSize,
            renderHeader: this.renderHeader,
            renderLoadingRow: this.renderLoadingRow,
            renderRow: this.renderRow,
            role: role,
            rowHeight: rowHeight,
            rowHeights: rowHeights,
            selection: selection,
            selectRowOnClick: selectRowOnClick,
            singleClickActivation: singleClickActivation,
            showScroll: showScroll,
            virtualize: virtualize,
            width: fill ? "100%" : tableWidth + "px"
        };
        var firstActionableHeaderIndex = getActionableIndex(columns);
        if (firstActionableHeaderIndex >= 0) {
            // If the header is tabbable, the rows do not need to be since they are
            // in the focus zone.
            listProps.defaultTabbableRow = -1;
        }
        var table = (React.createElement("div", { className: css(containerClassName, "bolt-table-container flex-grow", renderInvisible && "invisible", scrollable && "v-scroll-auto", tableBreakpoints && "h-scroll-hidden"), ref: this.currentElement },
            tableBreakpoints ? (React.createElement(TableBreakpoint, { columnWidths: columnWidths, onBreakpoint: this.onBreakpoint, breakpoints: tableBreakpoints })) : undefined,
            React.createElement(List, __assign({}, listProps, { key: visibleColumnsKey, ref: this.list }))));
        if (scrollable) {
            table = React.createElement(Intersection, null, table);
        }
        return table;
    };
    Table.prototype.componentDidMount = function () {
        // Mount any of the attached tableBehaviors.
        for (var _i = 0, _a = this.state.tableBehaviors; _i < _a.length; _i++) {
            var behavior = _a[_i];
            if (behavior.componentDidMount) {
                behavior.componentDidMount(this.props);
            }
        }
        for (var _b = 0, _c = this.state.columnBehaviors; _b < _c.length; _b++) {
            var behavior = _c[_b];
            if (behavior.componentDidMount) {
                behavior.componentDidMount({ tableProps: this.props });
            }
        }
    };
    Table.prototype.componentDidUpdate = function () {
        // Update any of the attached tableBehaviors.
        for (var _i = 0, _a = this.state.tableBehaviors; _i < _a.length; _i++) {
            var behavior = _a[_i];
            if (behavior.componentDidUpdate) {
                behavior.componentDidUpdate(this.props);
            }
        }
        for (var _b = 0, _c = this.state.columnBehaviors; _b < _c.length; _b++) {
            var behavior = _c[_b];
            if (behavior.componentDidUpdate) {
                behavior.componentDidUpdate({ tableProps: this.props });
            }
        }
    };
    Table.prototype.componentWillUnmount = function () {
        // Unmount any of the attached tableBehaviors.
        for (var _i = 0, _a = this.state.tableBehaviors; _i < _a.length; _i++) {
            var behavior = _a[_i];
            if (behavior.componentWillUnmount) {
                behavior.componentWillUnmount();
            }
        }
        for (var _b = 0, _c = this.state.columnBehaviors; _b < _c.length; _b++) {
            var behavior = _c[_b];
            if (behavior.componentDidUpdate) {
                behavior.componentDidUpdate({ tableProps: this.props });
            }
        }
    };
    Table.prototype.addOverlay = function (id, rowIndex, render, zIndex, columnIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        if (this.list.current) {
            return this.list.current.addOverlay(id, rowIndex, render, zIndex, columnIndex);
        }
    };
    Table.prototype.removeOverlay = function (id) {
        if (this.list.current) {
            return this.list.current.removeOverlay(id);
        }
    };
    Table.prototype.focusRow = function (rowIndex, direction) {
        if (direction === void 0) { direction = 1; }
        if (this.list.current) {
            return this.list.current.focusRow(rowIndex, direction);
        }
        else {
            return Promise.resolve();
        }
    };
    Table.prototype.getFocusIndex = function () {
        if (this.list.current) {
            return this.list.current.getFocusIndex();
        }
        return -1;
    };
    Table.prototype.getStats = function () {
        if (this.list.current) {
            return this.list.current.getStats();
        }
        return {
            firstMaterialized: -1,
            firstRendered: -1,
            lastMaterialized: -1,
            lastRendered: -1
        };
    };
    Table.prototype.scrollIntoView = function (rowIndex, options) {
        if (this.list.current) {
            return this.list.current.scrollIntoView(rowIndex, options);
        }
    };
    Table.defaultProps = {
        role: "grid",
        selectRowOnClick: true,
        showHeader: true,
        showLines: true,
        singleClickActivation: true,
        spacerWidth: 8
    };
    return Table;
}(React.Component));
export { Table };
export function renderColumns(rowIndex, columns, item, details) {
    return getVisibleColumnsAndIndices(columns).map(function (_a, columnIndex) {
        var column = _a.column;
        return column.renderCell(rowIndex, columnIndex, column, item, rowIndex + (details.ariaRowOffset ? details.ariaRowOffset : 1));
    });
}
function getVisibleColumnsAndIndices(columns) {
    return columns.map(function (column, index) { return ({ column: column, originalIndex: index }); }).filter(function (_a) {
        var column = _a.column;
        return ObservableLike.getValue(column.width);
    });
}
function getActionableIndex(columns) {
    return columns.findIndex(function (column) { return ObservableLike.getValue(column.width) !== 0 && ((column.behaviors && column.behaviors.length > 0) || !!column.sortProps); });
}
var TableHeader = /** @class */ (function (_super) {
    __extends(TableHeader, _super);
    function TableHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableHeader.prototype.render = function () {
        var _this = this;
        var firstActionableIndex = getActionableIndex(this.props.tableColumns);
        return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) {
            return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
                React.createElement("thead", null,
                    React.createElement(FocusWithin, null, function (focusStatus) {
                        return (React.createElement("tr", { "aria-rowindex": 1, className: css("bolt-table-header-row", focusStatus.hasFocus && "focused"), "data-row-index": -1, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, role: "row" },
                            React.createElement("th", { "aria-hidden": "true", key: "left-spacer", role: "presentation", className: "bolt-table-header-border" }),
                            getVisibleColumnsAndIndices(_this.props.tableColumns).map(function (_a, columnIndex) {
                                var column = _a.column, originalIndex = _a.originalIndex;
                                if (column.renderHeaderCell) {
                                    return column.renderHeaderCell(columnIndex, column, rowContext.focuszoneId, originalIndex === firstActionableIndex);
                                }
                                else if (column.iconProps || column.name) {
                                    return (React.createElement(TableHeaderCell, { key: "col-header-" + columnIndex, ariaLabel: column.ariaLabel || column.name, column: column, columnIndex: columnIndex, focuszoneId: rowContext.focuszoneId, isFirstActionableHeader: originalIndex === firstActionableIndex },
                                        React.createElement(Tooltip, { overflowOnly: true, text: column.name },
                                            React.createElement("div", { className: "bolt-table-header-cell-text text-ellipsis body-s" },
                                                column.iconProps && Icon(column.iconProps),
                                                React.createElement("span", null, column.name)))));
                                }
                                else {
                                    return (React.createElement("th", { "aria-colindex": columnIndex + 1, "aria-label": column.ariaLabel || Resources.EmptyColumnHeaderLabel, "aria-readonly": column.readonly !== undefined ? column.readonly : "true", className: "bolt-table-header-border", key: "col-header-" + columnIndex }));
                                }
                            }),
                            React.createElement("th", { "aria-hidden": "true", key: "right-spacer", role: "presentation", className: "bolt-table-header-border" })));
                    }))));
        }));
    };
    return TableHeader;
}(React.Component));
var boltTableHeaderCellCount = 0;
var TableHeaderCell = /** @class */ (function (_super) {
    __extends(TableHeaderCell, _super);
    function TableHeaderCell(props) {
        var _this = _super.call(this, props) || this;
        _this.element = React.createRef();
        _this.state = { measuredWidth: 0, isFocused: false };
        _this.onSize = function (event, updatedSize) {
            var column = _this.props.column;
            // Ensure we havent had our column definition updated and onSize removed.
            if (column.onSize) {
                column.onSize(event, _this.props.columnIndex, updatedSize, column);
            }
        };
        _this.headerCellId = boltTableHeaderCellCount++;
        return _this;
    }
    TableHeaderCell.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, column = _a.column, columnIndex = _a.columnIndex, focuszoneId = _a.focuszoneId, isFirstActionableHeader = _a.isFirstActionableHeader;
        var sizer;
        if (column.onSize) {
            sizer = (React.createElement(Observer, { width: column.width }, function (props) {
                // If we are sizable we will either use the supplied width (desired), or the
                // measured width if we are a proportional column.
                var width = props.width;
                if (width < 0) {
                    width = _this.state.measuredWidth;
                }
                return (React.createElement(Sizer, { ariaLabel: format(Resources.ColumnSizerLabel, column.name), className: "bolt-table-header-sizer", divider: false, maxSize: column.maxWidth, minSize: column.minWidth, onSize: _this.onSize, onSizeEnd: _this.props.column.onSizeEnd, orientation: Orientation.row, position: Position.near, size: width, tabIndex: 0, getFocusedElement: function (e) { return _this.element; } }));
            }));
        }
        return (React.createElement(FocusZoneContext.Consumer, null, function (cellContext) {
            var actionable = (column.behaviors && column.behaviors.length > 0) || !!column.sortProps;
            var _a = column.sortProps, sortProps = _a === void 0 ? {} : _a;
            var sortIcon = column.sortProps && sortProps.sortOrder !== undefined
                ? Icon({
                    className: "bolt-table-header-sort-icon body-s",
                    iconName: sortProps.sortOrder === SortOrder.ascending ? "SortUp" : "SortDown"
                })
                : null;
            var justificationClassName;
            if (column.justification === ColumnJustification.Left) {
                justificationClassName = "justify-start";
            }
            else if (column.justification === ColumnJustification.Right) {
                justificationClassName = "justify-end";
            }
            var colIndex = columnIndex + 1;
            var childId = getSafeId("th-col-content-" + _this.headerCellId);
            return (React.createElement("th", { role: "columnheader", "aria-colindex": colIndex, "aria-label": ariaLabel, "aria-labelledby": !ariaLabel ? childId : undefined, "aria-readonly": "true", "aria-sort": sortProps.sortOrder !== undefined
                    ? sortProps.sortOrder === SortOrder.ascending
                        ? "ascending"
                        : "descending"
                    : undefined, className: css(column.headerClassName, "bolt-table-header-cell", "col-header-" + columnIndex, actionable && "bolt-table-header-cell-actionable"), "data-column-index": columnIndex, "data-focuszone": actionable && css(isFirstActionableHeader && focuszoneId, cellContext.focuszoneId), ref: _this.element, onFocus: function () { return _this.setState({ isFocused: true }); }, onBlur: function () { return _this.setState({ isFocused: false }); }, tabIndex: actionable || sizer ? 0 : -1 },
                React.createElement("div", { className: css("bolt-table-header-cell-content flex-row", justificationClassName) },
                    column.justification === ColumnJustification.Right && sortIcon,
                    React.createElement("div", { id: childId, className: "scroll-hidden" }, _this.props.children),
                    column.justification !== ColumnJustification.Right && sortIcon,
                    React.createElement("div", { "aria-hidden": !_this.state.isFocused }, sizer))));
        }));
    };
    TableHeaderCell.prototype.componentDidMount = function () {
        this.updateMeasuredWidth();
    };
    TableHeaderCell.prototype.componentDidUpdate = function () {
        this.updateMeasuredWidth();
    };
    TableHeaderCell.prototype.updateMeasuredWidth = function () {
        var column = this.props.column;
        if (column.onSize && this.element.current && ObservableLike.getValue(column.width) < 0) {
            var measuredWidth = this.element.current.getBoundingClientRect().width;
            if (measuredWidth !== this.state.measuredWidth) {
                this.setState({ measuredWidth: measuredWidth });
            }
        }
    };
    return TableHeaderCell;
}(React.Component));
export { TableHeaderCell };
export function TableRow(props) {
    var onFocus = function (event) {
        var _a;
        props.details.onFocusItem(props.index, event);
        var rowNumber = (_a = props.details.ariaPosInSet) !== null && _a !== void 0 ? _a : props.index + ariaRowOffset;
        if (props.details.ariaSetSize) {
            if (props.linkProps) {
                Utils_Accessibility.announce(format(Resources.ClickableRowAnnouncementWithSize, rowNumber, props.details.ariaSetSize), true);
            }
            else if (role == "option") {
                Utils_Accessibility.announce(Resources.ListItem, true);
            }
            else {
                Utils_Accessibility.announce(format(Resources.RowAnnouncementWithSize, rowNumber, props.details.ariaSetSize), true);
            }
        }
        else {
            if (props.linkProps) {
                Utils_Accessibility.announce(format(Resources.ClickableRowAnnouncement, rowNumber), true);
            }
            else {
                Utils_Accessibility.announce(format(Resources.RowAnnouncement, rowNumber), true);
            }
        }
    };
    var postprocessKeyStroke = function (event) {
        var nodeName = event.target.nodeName;
        if (!event.defaultPrevented && nodeName !== "INPUT" && nodeName !== "TEXTAREA") {
            if (event.which === KeyCode.leftArrow && rowElement.current) {
                rowElement.current.focus();
                event.preventDefault();
            }
        }
        return FocusZoneKeyStroke.IgnoreNone;
    };
    var rowElement = React.useState(function () { return React.createRef(); })[0];
    var details = props.details, index = props.index, linkProps = props.linkProps;
    var selectableText = details.selectableText, ariaLabel = details.ariaLabel, ariaBusy = details.ariaBusy, ariaDescribedBy = details.ariaDescribedBy, ariaPosInSet = details.ariaPosInSet, ariaRowOffset = details.ariaRowOffset, ariaSetSize = details.ariaSetSize, excludeFocusZone = details.excludeFocusZone, id = details.id, renderSpacer = details.renderSpacer, role = details.role, selection = details.selection, singleClickActivation = details.singleClickActivation;
    var ariaChecked;
    var ariaSelected;
    if (role === "menuitemcheckbox") {
        ariaChecked = selection && selection.selected(index);
    }
    else {
        ariaSelected = selection && selection.selected(index);
    }
    var rowElem = (React.createElement(FocusOrMouseWithin, { onFocus: onFocus }, function (focusOrMouseWithinStatus) {
        return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) {
            var rowProps = {
                "aria-busy": ariaBusy,
                "aria-checked": ariaChecked,
                "aria-describedby": ariaDescribedBy,
                "aria-label": ariaLabel,
                "aria-rowindex": role === "menuitemcheckbox" || role === "option" || role === "presentation" ? undefined : index + ariaRowOffset,
                "aria-posinset": ariaPosInSet === null ? undefined : ariaPosInSet,
                "aria-selected": role === "presentation" ? undefined : ariaSelected,
                "aria-setsize": ariaSetSize === null ? undefined : ariaSetSize,
                className: css(props.className, "bolt-table-row bolt-list-row", index === 0 && "first-row", focusOrMouseWithinStatus.hasFocus && "focused", selection && selection.selected(index) && "selected", singleClickActivation && "single-click-activation", linkProps && "v-align-middle", selectableText && "selectable-text"),
                "data-focuszone": excludeFocusZone || (selection && !selection.selectable(index)) ? undefined : rowContext.focuszoneId,
                "data-row-index": props.index,
                id: getSafeId(id),
                role: role || "row",
                tabIndex: getTabIndex(details),
                onBlur: focusOrMouseWithinStatus.onBlur,
                onFocus: focusOrMouseWithinStatus.onFocus,
                onMouseEnter: focusOrMouseWithinStatus.onMouseEnter,
                onMouseLeave: focusOrMouseWithinStatus.onMouseLeave,
                ref: rowElement
            };
            var rowChildren = [
                React.createElement("td", { "aria-hidden": "true", key: "left-spacer", className: "bolt-table-cell-compact bolt-table-cell bolt-list-cell bolt-table-spacer-cell", role: "presentation" }, renderSpacer && renderSpacer(index, true)),
                props.children,
                React.createElement("td", { "aria-hidden": "true", key: "right-spacer", className: "bolt-table-cell-compact bolt-table-cell bolt-list-cell bolt-table-spacer-cell", role: "presentation" }, renderSpacer && renderSpacer(index, false))
            ];
            return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal, postprocessKeyStroke: postprocessKeyStroke }, linkProps ? (React.createElement("a", __assign({}, getDefaultLinkProps(linkProps), rowProps), rowChildren)) : (React.createElement("tr", __assign({}, rowProps), rowChildren))));
        }));
    }));
    if (details.tooltipProps) {
        return React.createElement(Tooltip, __assign({}, details.tooltipProps), rowElem);
    }
    return rowElem;
}
export function TableLoadingRow(props) {
    return (
    // Return the default row loading animation.
    React.createElement(TableRow, { className: "bolt-list-row-loading", details: props.details, index: props.rowIndex }, getVisibleColumnsAndIndices(props.columns).map(function (_a, columnIndex) {
        var column = _a.column;
        return SimpleTableCell({ columnIndex: columnIndex, children: renderLoadingCell(column.columnLayout) });
    })));
}
export function TableCell(props) {
    var ariaLabel = props.ariaLabel, ariaRowIndex = props.ariaRowIndex, className = props.className, colspan = props.colspan, columnIndex = props.columnIndex, role = props.role, tableColumn = props.tableColumn;
    var justificationClassName;
    if (tableColumn) {
        if (tableColumn.justification === ColumnJustification.Left) {
            justificationClassName = "justify-cell-start";
        }
        else if (tableColumn.justification === ColumnJustification.Right) {
            justificationClassName = "justify-cell-end";
        }
    }
    return (React.createElement("td", { "aria-colindex": role === "presentation" ? undefined : columnIndex + 1, "aria-label": role === "presentation" ? undefined : ariaLabel, "aria-readonly": role === "presentation" ? undefined : tableColumn && tableColumn.readonly, "aria-rowindex": role === "presentation" ? undefined : ariaRowIndex, className: css(className, tableColumn && tableColumn.className, "bolt-table-cell bolt-list-cell", justificationClassName), colSpan: colspan, "data-column-index": columnIndex, key: "col-" + columnIndex, role: role || "gridcell" }, props.children));
}
export function SimpleTableCell(props) {
    var children = React.createElement("div", { className: css(props.contentClassName, "bolt-table-cell-content flex-row flex-center") }, props.children);
    return TableCell({
        ariaLabel: props.ariaLabel,
        ariaRowIndex: props.ariaRowIndex,
        children: children,
        className: props.className,
        colspan: props.colspan,
        columnIndex: props.columnIndex,
        role: props.role,
        tableColumn: props.tableColumn
    });
}
export function TwoLineTableCell(props) {
    var rowClasses = "bolt-table-two-line-cell-item flex-row scroll-hidden";
    var line1 = React.createElement("div", { className: rowClasses }, props.line1);
    var line2 = React.createElement("div", { className: rowClasses }, props.line2);
    var lines = (React.createElement(React.Fragment, null,
        line1,
        line2));
    var children;
    if (props.iconProps) {
        children = (React.createElement("div", { className: css(props.className, "bolt-table-cell-content flex-row flex-center") },
            Icon(__assign(__assign({}, props.iconProps), { className: css(props.iconProps.className, "bolt-table-two-line-cell-icon flex-noshrink") })),
            React.createElement("div", { className: "flex-column scroll-hidden" }, lines)));
    }
    else {
        children = React.createElement("div", { className: css(props.className, "bolt-table-cell-content flex-column") }, lines);
    }
    return TableCell({
        ariaRowIndex: props.ariaRowIndex,
        children: children,
        colspan: props.colspan,
        columnIndex: props.columnIndex,
        className: "bolt-table-two-line-cell",
        tableColumn: props.tableColumn
    });
}
export function renderEmptyCell(rowIndex, columnIndex) {
    return React.createElement(TableCell, { columnIndex: columnIndex, key: columnIndex, role: "presentation" });
}
/**
 * A basic cell renderer that works well for most simple columns. Gets the value of the
 * the {column.id} property in the given table item and displays it as a string
 *
 * @param rowIndex Index of the row being rendered
 * @param columnIndex Index of the column being rendered
 * @param tableColumn Column definition
 * @param tableItem The data item being rendered for the current row
 */
export function renderSimpleCell(rowIndex, columnIndex, tableColumn, tableItem, ariaRowIndex) {
    return renderSimpleCellValue(columnIndex, tableColumn, tableItem[tableColumn.id], ariaRowIndex);
}
/**
 * Renders a simple table cell value
 *
 * @param columnIndex Index of the column being rendered
 * @param tableColumn Column definition
 * @param tableCell Simple value to render as text
 */
export function renderSimpleCellValue(columnIndex, tableColumn, tableCell, ariaRowIndex) {
    var columnStyle = tableColumn.columnStyle;
    // Do not include padding if the table cell has an href
    var hasLink = !!(tableCell && typeof tableCell !== "string" && typeof tableCell !== "number" && tableCell.href);
    return (React.createElement(SimpleTableCell, { ariaRowIndex: ariaRowIndex, className: css(columnStyle === TableColumnStyle.Primary && "bolt-table-cell-primary", columnStyle === TableColumnStyle.Secondary && "bolt-table-cell-secondary", columnStyle === TableColumnStyle.Tertiary && "bolt-table-cell-tertiary"), columnIndex: columnIndex, contentClassName: hasLink ? "bolt-table-cell-content-with-link" : undefined, key: columnIndex, tableColumn: tableColumn }, tableCell && renderListCell(tableCell)));
}
function getVariableLength() {
    return Math.random() * 80 + 20 + "%";
}
export function renderLoadingCell(columnLayout) {
    if (columnLayout === TableColumnLayout.singleLine || columnLayout === undefined) {
        return (React.createElement("div", { className: "shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0"));
    }
    else if (columnLayout === TableColumnLayout.singleLinePrefix) {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "shimmer shimmer-circle-small flex-noshrink" }),
            React.createElement("div", { className: "shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0")));
    }
    else if (columnLayout === TableColumnLayout.twoLine) {
        return (React.createElement("div", { className: "flex-column flex-grow" },
            React.createElement("div", { className: "bolt-table-two-line-cell-item shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0"),
            React.createElement("div", { className: "bolt-table-two-line-cell-item shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0")));
    }
    else if (columnLayout === TableColumnLayout.twoLinePrefix) {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "shimmer shimmer-circle-large flex-noshrink" }),
            React.createElement("div", { className: "flex-column flex-grow" },
                React.createElement("div", { className: "bolt-table-two-line-cell-item shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0"),
                React.createElement("div", { className: "bolt-table-two-line-cell-item shimmer shimmer-line", style: { width: getVariableLength() } }, "\u00A0"))));
    }
    return null;
}
