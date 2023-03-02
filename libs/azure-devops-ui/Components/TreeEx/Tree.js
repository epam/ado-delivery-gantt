import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tree.css";
import "./TreeExpand.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { getDefaultAnchorProps } from '../../Link';
import { renderListCell } from '../../List';
import { UncheckedObserver } from '../../Observer';
import { renderColumns, renderLoadingCell, SimpleTableCell, Table } from '../../Table';
import { css, getSafeId, KeyCode, preventDefault } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
import { TreeExpand } from "./TreeExpand";
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.table = React.createRef();
        _this.onActivateExpand = function (event, tableRow) {
            if (!event.defaultPrevented && tableRow.data.underlyingItem.childItems) {
                _this.props.onToggle && _this.props.onToggle(event, tableRow.data);
                event.preventDefault();
            }
        };
        _this.renderRow = function (rowIndex, item, details) {
            // If onActivate for tree is not specified but onToggle is, tree passes on onActivateExpand as onActivate to table.
            // In that case, onActivate can be different for tree and table
            details.singleClickActivation = _this.props.onActivate && details.singleClickActivation;
            if (_this.props.columns.length <= 1 && !details.role) {
                details.role = "treeitem";
            }
            // Since the underlying table is unable to determine whether or not a row
            // is in a loading state since the observable value is within the ITreeItemEx
            // we need to handle this in the row rendering.
            return (React.createElement(UncheckedObserver, { data: item.underlyingItem.data, key: item.underlyingItem.id }, function (props) {
                if (props.data) {
                    // We need to forward the onToggle handler to the treeItemEx before it is rendered.
                    item.onToggle = item.underlyingItem.childItems ? _this.props.onToggle : undefined;
                    // First determine if the item supplied a custom row rendering function, if not
                    // attempt to use the global row rendering function.
                    var renderRow = item.underlyingItem.data.renderRow || _this.props.renderRow;
                    if (renderRow) {
                        return renderRow(rowIndex, item, details);
                    }
                    return renderTreeRow(rowIndex, item, details, _this.props.columns, props.data);
                }
                else {
                    var renderLoadingRow = _this.props.renderLoadingRow;
                    // If a custom row loading animation is available use it.
                    if (renderLoadingRow) {
                        return renderLoadingRow(rowIndex, details);
                    }
                    // Return the default row loading animation.
                    return (React.createElement(TreeRow, { index: rowIndex, details: details }, _this.props.columns.map(function (treeColumn, columnIndex) {
                        var children = renderLoadingCell(treeColumn.columnLayout);
                        if (treeColumn.hierarchical) {
                            children = React.createElement(TreeExpand, { depth: details.data.depth }, children);
                        }
                        return SimpleTableCell({ className: "bolt-tree-cell", columnIndex: columnIndex, children: children });
                    })));
                }
            }));
        };
        return _this;
    }
    Tree.prototype.render = function () {
        var _a = this.props.role, role = _a === void 0 ? this.props.columns.length > 1 ? "treegrid" : "tree" : _a;
        // If we haven't specified an onActivate, but have specified an onToggle, toggle on activate.
        var onActivate = this.props.onActivate ? this.props.onActivate : this.props.onToggle ? this.onActivateExpand : undefined;
        return (React.createElement(Table, { ariaLabel: this.props.ariaLabel, behaviors: this.props.behaviors, className: this.props.className, columns: this.props.columns, containerClassName: this.props.containerClassName, eventDispatch: this.props.eventDispatch, focuszoneProps: this.props.focuszoneProps, id: this.props.id, itemProvider: this.props.itemProvider, maxHeight: this.props.maxHeight, onActivate: onActivate, onFocus: this.props.onFocus, onSelect: this.props.onSelect, pageSize: this.props.pageSize, renderHeader: this.props.renderHeader, renderRow: this.renderRow, renderSpacer: this.props.renderSpacer, role: role, rowHeight: this.props.rowHeight, ref: this.table, scrollable: this.props.scrollable, selectableText: this.props.selectableText, selection: this.props.selection, singleClickActivation: this.props.singleClickActivation, showHeader: this.props.showHeader, showLines: this.props.showLines, showScroll: this.props.showScroll, tableBreakpoints: this.props.tableBreakpoints, virtualize: this.props.virtualize }));
    };
    Tree.prototype.addOverlay = function (id, rowIndex, render, zIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        if (this.table.current) {
            return this.table.current.addOverlay(id, rowIndex, render, zIndex);
        }
    };
    Tree.prototype.removeOverlay = function (id) {
        if (this.table.current) {
            return this.table.current.removeOverlay(id);
        }
    };
    Tree.prototype.focusRow = function (rowIndex, direction) {
        if (direction === void 0) { direction = 1; }
        if (this.table.current) {
            return this.table.current.focusRow(rowIndex, direction);
        }
        else {
            return Promise.resolve();
        }
    };
    Tree.prototype.getFocusIndex = function () {
        if (this.table.current) {
            return this.table.current.getFocusIndex();
        }
        return -1;
    };
    Tree.prototype.getStats = function () {
        if (this.table.current) {
            return this.table.current.getStats();
        }
        return {
            firstMaterialized: -1,
            firstRendered: -1,
            lastMaterialized: -1,
            lastRendered: -1
        };
    };
    Tree.prototype.scrollIntoView = function (rowIndex, options) {
        if (this.table.current) {
            return this.table.current.scrollIntoView(rowIndex, options);
        }
    };
    return Tree;
}(React.Component));
export { Tree };
var TreeRow = /** @class */ (function (_super) {
    __extends(TreeRow, _super);
    function TreeRow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rowElement = React.createRef();
        _this.onFocus = function (event) {
            _this.props.details.onFocusItem(_this.props.index, event);
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (_this.rowElement.current === event.nativeEvent.srcElement) {
                    var data = _this.props.details.data;
                    if (data) {
                        if (data.onToggle) {
                            var expanded = data.underlyingItem.expanded;
                            if ((event.which === KeyCode.rightArrow && !expanded) || (event.which === KeyCode.leftArrow && expanded)) {
                                data.onToggle(event, data);
                                event.preventDefault();
                            }
                        }
                    }
                }
            }
        };
        _this.onPostprocessKeyStroke = function (event) {
            var _a;
            if (event.defaultPrevented)
                return FocusZoneKeyStroke.IgnoreNone;
            if (event.which !== KeyCode.leftArrow)
                return FocusZoneKeyStroke.IgnoreNone;
            var currentElement = _this.rowElement.current;
            if (event.nativeEvent.srcElement !== currentElement) {
                currentElement === null || currentElement === void 0 ? void 0 : currentElement.focus();
                return FocusZoneKeyStroke.IgnoreNone;
            }
            var data = _this.props.details.data;
            if (!data || !data.parentItem)
                return FocusZoneKeyStroke.IgnoreNone;
            var prevElement = currentElement === null || currentElement === void 0 ? void 0 : currentElement.previousElementSibling;
            var currentElementAriaLevel = currentElement === null || currentElement === void 0 ? void 0 : currentElement.getAttribute('aria-level');
            var prevElementAriaLevel = prevElement === null || prevElement === void 0 ? void 0 : prevElement.getAttribute('aria-level');
            while (prevElement && currentElement && currentElementAriaLevel && prevElementAriaLevel) {
                var currentLevel = Number.parseInt(currentElementAriaLevel);
                var prevElementLevel = Number.parseInt(prevElementAriaLevel);
                if (prevElementLevel < currentLevel)
                    break;
                prevElement = prevElement.previousElementSibling;
            }
            if (data.parentItem.onToggle && (prevElement === null || prevElement === void 0 ? void 0 : prevElement.id)) {
                (_a = document.getElementById(prevElement.id)) === null || _a === void 0 ? void 0 : _a.focus();
                data.parentItem.onToggle(event, data.parentItem);
            }
            event.preventDefault();
            return FocusZoneKeyStroke.IgnoreNone;
        };
        return _this;
    }
    TreeRow.prototype.render = function () {
        var _this = this;
        var _a = this.props, details = _a.details, index = _a.index, linkProps = _a.linkProps;
        var ariaRowOffset = details.ariaRowOffset, data = details.data, excludeFocusZone = details.excludeFocusZone, renderSpacer = details.renderSpacer, selectableText = details.selectableText, selection = details.selection, singleClickActivation = details.singleClickActivation;
        // If the row is being rendered as a link we will use an anchor, otherwise we will
        // use a standard table row.
        var RowType = linkProps ? "a" : "tr";
        // Build the set of props needed from the link to forward on to the row element.
        var linkForwardProps = getDefaultAnchorProps(linkProps);
        return (React.createElement(FocusWithin, { onFocus: this.onFocus }, function (focusStatus) {
            return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) {
                var _a;
                return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal, postprocessKeyStroke: _this.onPostprocessKeyStroke },
                    React.createElement(RowType, __assign({}, linkForwardProps, { "aria-busy": data === undefined, "aria-expanded": 
                        // default to false if the item has children without an expanded value
                        data && data.underlyingItem.childItems
                            ? data.underlyingItem.expanded === undefined
                                ? false
                                : data.underlyingItem.expanded
                            : undefined, "aria-level": data ? data.depth + 1 : undefined, "aria-rowindex": index + ariaRowOffset, "aria-selected": selection && selection.selected(index) ? true : undefined, className: css(_this.props.className, "bolt-tree-row bolt-table-row bolt-list-row", index === 0 && "first-row", focusStatus.hasFocus && "focused", selection && selection.selected(index) && "selected", singleClickActivation && "single-click-activation", selectableText && "selectable-text", linkProps && "v-align-middle"), "data-focuszone": excludeFocusZone || (selection && !selection.selectable(index)) ? undefined : rowContext.focuszoneId, "data-row-index": index, id: getSafeId((_a = details.data.underlyingItem.id) !== null && _a !== void 0 ? _a : index.toString()), onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, onKeyDown: _this.onKeyDown, ref: _this.rowElement, role: details.role || "row", tabIndex: getTabIndex(details) }),
                        React.createElement("td", { key: "left-spacer", className: "bolt-table-cell-compact bolt-table-cell bolt-list-cell", role: "presentation" }, renderSpacer && renderSpacer(index, true)),
                        _this.props.children,
                        React.createElement("td", { key: "right-spacer", className: "bolt-table-cell-compact bolt-table-cell bolt-list-cell", role: "presentation" }, renderSpacer && renderSpacer(index, false)))));
            }));
        }));
    };
    return TreeRow;
}(React.Component));
export { TreeRow };
export function renderTreeRow(rowIndex, item, details, columns, data, className, key) {
    return (React.createElement(TreeRow, { index: rowIndex, details: details, linkProps: data ? data.linkProps : undefined, className: className, key: key }, renderColumns(rowIndex, columns, item, details)));
}
/**
 * Standard cell renderer for a tree cell with expandable children. This will use the tree items
 * state to determine whether or not the row is expanded etc.
 */
export function ExpandableTreeCell(props) {
    var colspan = props.colspan, columnIndex = props.columnIndex, contentClassName = props.contentClassName, treeItem = props.treeItem, treeColumn = props.treeColumn;
    var depth = treeItem.depth, onToggle = treeItem.onToggle, underlyingItem = treeItem.underlyingItem;
    var expanded = underlyingItem.expanded;
    var children = (React.createElement(TreeExpand, { expanded: expanded, depth: depth, indentationSize: treeColumn && treeColumn.indentationSize, onClick: preventDefault, onToggle: onToggle ? function (event) { return onToggle(event, treeItem); } : undefined }, props.children));
    return SimpleTableCell({
        children: children,
        className: css(props.className, "bolt-tree-cell"),
        colspan: colspan,
        columnIndex: columnIndex,
        contentClassName: contentClassName,
        tableColumn: treeColumn
    });
}
export function renderExpandableTreeCell(rowIndex, columnIndex, treeColumn, treeItem) {
    var underlyingItem = treeItem.underlyingItem;
    var data = ObservableLike.getValue(underlyingItem.data);
    var treeCell = data && data[treeColumn.id];
    // Do not include padding if the table cell has an href
    var hasLink = !!(treeCell && typeof treeCell !== "string" && typeof treeCell !== "number" && treeCell.href);
    return ExpandableTreeCell({
        children: treeCell && renderListCell(treeCell),
        className: treeColumn.className,
        columnIndex: columnIndex,
        contentClassName: hasLink ? "bolt-table-cell-content-with-link" : undefined,
        treeItem: treeItem,
        treeColumn: treeColumn
    });
}
export function renderTreeCell(rowIndex, columnIndex, treeColumn, treeItem) {
    var underlyingItem = treeItem.underlyingItem;
    var data = ObservableLike.getValue(underlyingItem.data);
    var treeCell = data && data[treeColumn.id];
    // Do not include padding if the table cell has an href
    var hasLink = !!(treeCell && typeof treeCell !== "string" && typeof treeCell !== "number" && treeCell.href);
    return SimpleTableCell({
        className: treeColumn.className,
        children: treeCell && renderListCell(treeCell),
        columnIndex: columnIndex,
        contentClassName: hasLink ? "bolt-table-cell-content-with-link" : undefined,
        tableColumn: treeColumn
    });
}
export function renderTreeCellWithClassName(rowIndex, columnIndex, treeColumn, treeItem, contentClassName) {
    var underlyingItem = treeItem.underlyingItem;
    var data = ObservableLike.getValue(underlyingItem.data);
    var treeCell = data && data[treeColumn.id];
    // Do not include padding if the table cell has an href
    var hasLink = !!(treeCell && typeof treeCell !== "string" && typeof treeCell !== "number" && treeCell.href);
    return SimpleTableCell({
        className: treeColumn.className,
        children: treeCell && renderListCell(treeCell),
        columnIndex: columnIndex,
        contentClassName: css(contentClassName, hasLink ? "bolt-table-cell-content-with-link" : undefined),
        tableColumn: treeColumn
    });
}
