import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ListBox.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { format } from '../../Core/Util/String';
import { Icon } from '../../Icon';
import { renderListCell } from '../../List';
import { ItemsObserver, Observer } from '../../Observer';
import * as Resources from '../../Resources.Dropdown';
import { Spinner, SpinnerSize } from '../../Spinner';
import { ColumnSelect, renderEmptyCell, SimpleTableCell, Table, TableRow } from '../../Table';
import { Tree, TreeRow } from '../../TreeEx';
import { css } from '../../Util';
import { DropdownSelection } from '../../Utilities/DropdownSelection';
import { ArrayItemProvider, getItemsValue } from '../../Utilities/Provider';
import { TreeItemProvider } from '../../Utilities/TreeItemProvider';
import { ListBoxItemType } from "./ListBox.Props";
export var DefaultListBoxWidth = -100;
var ListBox = /** @class */ (function (_super) {
    __extends(ListBox, _super);
    function ListBox(props) {
        var _this = _super.call(this, props) || this;
        _this.tabbableIndex = -1;
        _this.positions = [];
        _this.count = 0;
        _this.table = React.createRef();
        _this.tree = React.createRef();
        _this.getItemWidth = function () {
            var width = _this.props.width;
            return _this.multiSelect && width && width > 0 ? width - 40 /* TODO: Remove this, 40 is only correct with default font-size */ : width;
        };
        _this.loadingChanged = function () {
            if (ObservableLike.getValue(_this.props.loading)) {
                Utils_Accessibility.announce(Resources.AnnounceLoadingItems);
            }
            else {
                Utils_Accessibility.announce(Resources.AnnounceFinishedLoadingItems);
                var itemCount = _this.props.items.length;
                Utils_Accessibility.announce(format(itemCount > 0 ? format(Resources.AnnounceItemCount, itemCount) : Resources.NoFilterResults), true);
            }
            return true;
        };
        _this.searchingChanged = function () {
            if (ObservableLike.getValue(_this.props.searching)) {
                Utils_Accessibility.announce(Resources.Searching);
            }
            else if (ObservableLike.getValue(_this.props.searching) === false) {
                var resultCount = _this.props.items.length;
                Utils_Accessibility.announce(resultCount > 0 ? format(Resources.AnnounceFilterResultCount, resultCount) : Resources.NoFilterResults, true);
            }
            return true;
        };
        _this.onItemsChanged = function () {
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            _this.tabbableIndex = -1;
            _this.positions = [];
            _this.count = 0;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                var itemValue = ObservableLike.getValue(item);
                if (itemValue && !listBoxItemSelectable(itemValue)) {
                    _this.positions.push(-1);
                }
                else {
                    if (_this.tabbableIndex === -1 && _this.selection.selectable(_this.positions.length)) {
                        _this.tabbableIndex = _this.positions.length;
                    }
                    _this.positions.push(++_this.count);
                }
            }
            return true;
        };
        _this.onActivate = function (event, tableRow) {
            if (_this.props.onActivate) {
                _this.props.onActivate(event, tableRow.data);
            }
        };
        _this.onSelect = function (event, tableRow) {
            if (_this.props.onSelect) {
                _this.props.onSelect(event, tableRow.data);
            }
        };
        _this.onTreeActivate = function (event, treeRow) {
            var items = _this.getListBoxItems();
            if (_this.props.onActivate && items) {
                var treeItem_1 = treeRow.data.underlyingItem;
                var item = items.find(function (item) { return item.id === treeItem_1.id; });
                item && _this.props.onActivate(event, item);
            }
        };
        _this.onTreeSelect = function (event, treeRow) {
            var items = _this.getListBoxItems();
            if (_this.props.onSelect && items) {
                var treeItem_2 = treeRow.data.underlyingItem;
                var item = items.find(function (item) { return item.id === treeItem_2.id; });
                item && _this.props.onSelect(event, item);
            }
        };
        _this.renderListBoxRow = function (index, item, details) {
            var _a = _this.props, excludeFocusZone = _a.excludeFocusZone, excludeTabStop = _a.excludeTabStop;
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            var focusable = !excludeFocusZone && _this.selection.selectable(index);
            var rowDetails = __assign(__assign({ tooltipProps: item.tooltipProps || { text: item.text, overflowOnly: true, overflowDetected: overflowDetected } }, details), { ariaPosInSet: _this.positions[index] >= 0 ? _this.positions[index] : null, ariaSetSize: _this.positions[index] >= 0 ? _this.count : null, excludeTabStop: excludeTabStop || _this.tabbableIndex !== index, excludeFocusZone: !focusable, id: item.id, singleClickActivation: false, role: item.type === ListBoxItemType.Header || item.type === ListBoxItemType.Divider ? "presentation" : "option" });
            return (React.createElement(Observer, { key: item.id || index, item: item }, function () { return (React.createElement(TableRow, { key: item.id || index, index: index, details: rowDetails, className: css("bolt-list-box-row", item.type === ListBoxItemType.Header && "bolt-list-box-header-row", item.type === ListBoxItemType.Divider && "bolt-list-box-divider-row", item.type === ListBoxItemType.Loading && "bolt-list-box-loading-row", _this.multiSelect && "bolt-list-box-multi-select-row", item.type !== ListBoxItemType.Header && item.type !== ListBoxItemType.Divider && "cursor-pointer", item.disabled && "bolt-list-box-item-disabled") }, _this.columns.map(function (tableColumn, columnIndex) {
                if (_this.multiSelect && columnIndex === 0) {
                    if (item.type === ListBoxItemType.Divider || item.type === ListBoxItemType.Loading) {
                        return null;
                    }
                    else if (item.type === ListBoxItemType.Header) {
                        return renderEmptyCell(index, columnIndex);
                    }
                }
                return tableColumn.renderCell(index, columnIndex, tableColumn, item);
            }))); }));
        };
        _this.renderListBoxTreeRow = function (index, item, details) {
            var _a = _this.props, excludeFocusZone = _a.excludeFocusZone, excludeTabStop = _a.excludeTabStop;
            var focusable = !excludeFocusZone && _this.selection.selectable(index);
            var data = item.underlyingItem.data;
            var rowDetails = __assign(__assign({ tooltipProps: { text: item.underlyingItem.text, overflowOnly: true, overflowDetected: overflowDetected } }, details), { ariaPosInSet: _this.positions[index] >= 0 ? _this.positions[index] : null, ariaSetSize: _this.positions[index] >= 0 ? _this.count : null, excludeTabStop: excludeTabStop || _this.tabbableIndex !== index, excludeFocusZone: !focusable, id: item.underlyingItem.id, singleClickActivation: false, role: data.type === ListBoxItemType.Header || data.type === ListBoxItemType.Divider ? "row" : "treeitem" });
            return (React.createElement(Observer, { key: "observer-" + (item.underlyingItem.id || index), item: item }, function () { return (React.createElement(TreeRow, { key: "row-" + (item.underlyingItem.id || index), index: index, details: rowDetails, className: css("bolt-list-box-row", data.type === ListBoxItemType.Header && "bolt-list-box-header-row", data.type === ListBoxItemType.Divider && "bolt-list-box-divider-row", data.type === ListBoxItemType.Loading && "bolt-list-box-loading-row", _this.multiSelect && "bolt-list-box-multi-select-row", data.type !== ListBoxItemType.Header && data.type !== ListBoxItemType.Divider && "cursor-pointer", data.disabled && "bolt-list-box-item-disabled") }, _this.columns.map(function (treeColumn, columnIndex) {
                return treeColumn.renderCell(index, columnIndex, treeColumn, item);
            }))); }));
        };
        _this.renderListBoxCell = function (rowIndex, columnIndex, tableColumn, tableItem) {
            return renderListBoxCell(rowIndex, columnIndex, tableColumn, tableItem, _this.multiSelect);
        };
        var _a = _this.props, selection = _a.selection, renderItem = _a.renderItem, items = _a.items;
        _this.selection = selection || new DropdownSelection();
        _this.multiSelect = _this.props.enforceSingleSelect || _this.props.showTree ? false : _this.selection.multiSelect;
        // trees get custom columns
        if (!_this.props.columns) {
            _this.columns = [];
            if (_this.multiSelect && _this.props.showChecksColumn !== false) {
                _this.columns.push(new ColumnSelect({ role: "presentation", excludeFocusZone: true }));
            }
            else if (!_this.multiSelect && _this.props.showChecksColumn === true) {
                _this.columns.push({
                    id: "column-check",
                    width: 24,
                    renderCell: function (rowIndex, columnIndex) { return (React.createElement(SimpleTableCell, { columnIndex: columnIndex, key: "column-check", role: "presentation" },
                        React.createElement(Icon, { className: css(!_this.selection.selected(rowIndex) && "invisible"), iconName: "CheckMark" }))); },
                    readonly: true
                });
            }
            _this.columns.push({
                id: "text",
                width: _this.getItemWidth(),
                renderCell: renderItem || _this.renderListBoxCell,
                className: css("bolt-list-box-text", _this.multiSelect ? "bolt-list-box-text-multi-select" : "bolt-list-box-text-single-select"),
                readonly: true
            });
        }
        else {
            _this.columns = _this.props.columns;
        }
        // string items are wrapped once here.  Only use a string array in the simple case where the items are not changing.
        _this.wrappedItems = wrapListBoxItems(items);
        _this.onItemsChanged();
        return _this;
    }
    ListBox.prototype.componentDidUpdate = function () {
        if (this.props.didUpdate) {
            this.props.didUpdate();
        }
    };
    ListBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, className = _a.className, containerClassName = _a.containerClassName, enforceSingleSelect = _a.enforceSingleSelect, focuszoneProps = _a.focuszoneProps, getUnselectableRanges = _a.getUnselectableRanges, items = _a.items, loading = _a.loading, searching = _a.searching, searchResultsLoadingText = _a.searchResultsLoadingText, showItemsWhileSearching = _a.showItemsWhileSearching, width = _a.width;
        var itemsObservable = { observableValue: items, filter: this.onItemsChanged };
        var listBoxItems = this.getListBoxItems();
        var itemProvider = listBoxItems
            ? this.props.showTree
                ? new TreeItemProvider(convertListBoxItemsToTreeItems(listBoxItems))
                : new ArrayItemProvider(listBoxItems)
            : items;
        if (!this.props.columns) {
            this.columns[this.columns.length - 1].width = this.getItemWidth();
        }
        return (React.createElement(ItemsObserver, { getUnselectableRanges: getUnselectableRanges, items: items, selection: this.selection },
            React.createElement(Observer, { items: itemsObservable, loading: { observableValue: loading || false, filter: this.loadingChanged }, searching: { observableValue: searching || false, filter: this.searchingChanged } }, function (props) {
                if (props.searching && !showItemsWhileSearching) {
                    return (React.createElement("div", { className: "bolt-list-box-loading", style: { width: width } },
                        React.createElement(Spinner, { size: SpinnerSize.medium, label: searchResultsLoadingText || Resources.Searching })));
                }
                if (_this.props.showTree) {
                    var treeProvider_1 = itemProvider;
                    return (React.createElement(Tree, { ariaLabel: ariaLabel || Resources.ListboxAriaLabel, className: css(className, "bolt-list-box"), columns: _this.columns, containerClassName: containerClassName, focuszoneProps: focuszoneProps, itemProvider: treeProvider_1, onActivate: _this.onTreeActivate, onSelect: _this.onTreeSelect, onToggle: function (event, treeItem) {
                            if (event.target.className.includes("bolt-tree-expand-button")) {
                                treeProvider_1.toggle(treeItem.underlyingItem);
                                if (_this.props.onToggle) {
                                    _this.props.onToggle(event, treeItem.underlyingItem.data);
                                }
                            }
                        }, ref: _this.tree, renderRow: _this.renderListBoxTreeRow, role: "listbox", scrollable: true, singleClickActivation: false, selection: _this.selection, showHeader: false, showLines: false }));
                }
                else {
                    return (React.createElement(Table, { ariaLabel: ariaLabel || Resources.ListboxAriaLabel, className: css(className, "bolt-list-box"), columns: _this.columns, containerClassName: containerClassName, enforceSingleSelect: enforceSingleSelect, focuszoneProps: focuszoneProps, itemProvider: itemProvider, onActivate: _this.onActivate, onSelect: _this.onSelect, renderRow: _this.renderListBoxRow, ref: _this.table, role: "listbox", scrollable: true, singleClickActivation: false, selection: _this.selection, showHeader: false, showLines: false, spacerWidth: 0 }));
                }
            })));
    };
    ListBox.prototype.scrollIntoView = function (rowIndex, options) {
        if (this.table.current) {
            return this.table.current.scrollIntoView(rowIndex, options);
        }
        else if (this.tree.current) {
            return this.tree.current.scrollIntoView(rowIndex, options);
        }
    };
    /**
     * Try to pull list box items out of props and variables.
     * Returns undefined in case where IItemProvider was passed in.
     */
    ListBox.prototype.getListBoxItems = function () {
        var _a, _b;
        return ((_b = (_a = this.wrappedItems) !== null && _a !== void 0 ? _a : (this.props.items && (Array.isArray(this.props.items) ? this.props.items : this.props.items.value))) !== null && _b !== void 0 ? _b : undefined);
    };
    ListBox.defaultProps = {
        getUnselectableRanges: getUnselectableRanges,
        width: DefaultListBoxWidth
    };
    return ListBox;
}(React.Component));
export { ListBox };
export function renderListBoxCell(rowIndex, columnIndex, tableColumn, tableItem, multiSelect) {
    if (tableItem.render) {
        return tableItem.render(rowIndex, columnIndex, tableColumn, tableItem);
    }
    if (tableItem.type === ListBoxItemType.Divider) {
        return (React.createElement(SimpleTableCell, { className: css(tableColumn.className, tableItem.className, multiSelect && "bolt-list-box-divider-multi-select"), columnIndex: columnIndex, colspan: multiSelect ? 2 : 1, key: tableItem.id, role: "presentation", tableColumn: tableColumn },
            React.createElement("div", { className: "bolt-list-box-divider flex-grow" })));
    }
    else if (tableItem.type === ListBoxItemType.Loading) {
        return React.createElement(LoadingCell, { columnIndex: columnIndex, key: tableItem.id, tableColumn: tableColumn, tableItem: tableItem });
    }
    return (React.createElement(SimpleTableCell, { className: css(tableColumn.className, tableItem.className, tableItem.type === ListBoxItemType.Header && "bolt-list-box-header"), columnIndex: columnIndex, key: tableItem.id, role: "presentation", tableColumn: tableColumn },
        React.createElement("div", { id: tableItem.type === ListBoxItemType.Header ? "header-" + tableItem.id : undefined, "aria-label": tableItem.type === ListBoxItemType.Header ? format(Resources.HeaderAriaLabel, tableItem.text) : undefined, className: "bolt-list-box-cell-container" }, tableItem && renderListCell(tableItem, false))));
}
function overflowDetected(anchorElement) {
    var overflowElement = anchorElement.querySelector(".text-ellipsis");
    if (overflowElement) {
        return overflowElement.scrollWidth > Math.ceil(overflowElement.offsetWidth);
    }
    return false;
}
/**
 * Retrieve a list of unselectable ranges based on a itemSelectable function.
 * @param items the set of items
 * @param itemSelectable A function that returns false when an items is not selectable.
 *        Defaults to checking that the item type is not header or divider.
 */
export function getUnselectableRanges(items, itemSelectable) {
    if (itemSelectable === void 0) { itemSelectable = listBoxItemSelectable; }
    var ranges = [];
    var beginIndex = -1;
    for (var index = 0; index < items.length; index++) {
        if (!itemSelectable(items[index]) && beginIndex < 0) {
            beginIndex = index;
        }
        else if (itemSelectable(items[index]) && beginIndex >= 0) {
            ranges.push({ beginIndex: beginIndex, endIndex: index - 1 });
            beginIndex = -1;
        }
    }
    if (beginIndex >= 0) {
        ranges.push({ beginIndex: beginIndex, endIndex: items.length - 1 });
    }
    return ranges;
}
/**
 * Return whether a ListBoxItem can be selected or not.
 * @param item the ListBoxItem to evaluate
 */
export function listBoxItemSelectable(item) {
    return item.type !== ListBoxItemType.Header && item.type !== ListBoxItemType.Divider && item.type !== ListBoxItemType.Loading && !item.disabled;
}
/**
 * When items is a string[], wrap each item in a ListBoxItem.  Otherwise, do nothing.
 * @param items the items prop
 */
export function wrapListBoxItems(items) {
    if (Array.isArray(items) && items.length && typeof items[0] === "string") {
        return items.map(function (item) {
            return { id: item, text: item };
        });
    }
}
/**
 * Walk through the ListBoxItems and construct a tree
 */
export function convertListBoxItemsToTreeItems(items) {
    var rootItems = [];
    var itemsMap = new Map();
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
        var item = items_2[_i];
        // include children that may have been processed before this parent
        var precreatedTreeItem = itemsMap.get(item.id);
        var treeItem = {
            childItems: precreatedTreeItem === null || precreatedTreeItem === void 0 ? void 0 : precreatedTreeItem.childItems,
            expanded: item.expanded,
            data: item,
            id: item.id,
            text: item.text
        };
        if (!item.parent) {
            rootItems.push(treeItem);
        }
        else {
            var parent_1 = itemsMap.get(item.parent.id);
            if (parent_1) {
                if (parent_1.childItems) {
                    parent_1.childItems.push(treeItem);
                }
                else {
                    parent_1.childItems = [treeItem];
                }
            }
            else {
                // add a placeholder that tracks children until parent actually gets processed
                itemsMap.set(item.parent.id, { childItems: [treeItem] });
            }
        }
        itemsMap.set(treeItem.id, treeItem);
    }
    return rootItems;
}
/**
 * Helper to get the value of the items prop.  If items is a string[], it should first be wrapped using wrapListBoxItems.
 * If it's an itemProvider, .value will be called on the provider.
 * @param items the items prop.  If items was provided as a string[], it should first be wrapped using wrapListBoxItems.
 */
export function getListBoxItemsValue(items) {
    if (false) {
        if (Array.isArray(items) && items.length && typeof items[0] === "string") {
            console.warn("a string[] was passed for items and not wrapped first.  Call wrapListBoxItems on items and pass in the results as items.");
        }
    }
    return getItemsValue(items);
}
var LoadingCell = /** @class */ (function (_super) {
    __extends(LoadingCell, _super);
    function LoadingCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingCell.prototype.componentDidMount = function () {
        if (this.props.onMount) {
            this.props.onMount();
        }
    };
    LoadingCell.prototype.render = function () {
        var _a = this.props, columnIndex = _a.columnIndex, tableColumn = _a.tableColumn, tableItem = _a.tableItem;
        return (React.createElement(SimpleTableCell, { className: css(tableColumn.className, tableItem.className), columnIndex: columnIndex, colspan: 2, contentClassName: "justify-center", key: columnIndex, tableColumn: tableColumn },
            React.createElement("div", { className: "bolt-list-box-loading" },
                React.createElement(Spinner, { size: SpinnerSize.medium, label: Resources.Loading }))));
    };
    return LoadingCell;
}(React.Component));
export { LoadingCell };
export function isListBoxItemVisible(item) {
    var parent = item.parent;
    while (parent) {
        if (!parent.expanded) {
            return false;
        }
        parent = parent.parent;
    }
    return true;
}
