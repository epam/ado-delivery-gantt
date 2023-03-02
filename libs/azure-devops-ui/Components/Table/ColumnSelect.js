import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { announce } from '../../Core/Util/Accessibility';
import { Checkbox, TriStateCheckbox } from '../../Checkbox';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Widgets';
import { css, KeyCode, preventDefault } from '../../Util';
import { IMeasurementStyle, TableColumnLayout } from "./Table.Props";
/**
 * ColumnSelect is used to render additional selection ui for a given row.
 *
 * This renders a fixed width column that contains a checkbox in the header
 * as well as each row that represents the selection state of the row. It
 * also allows the user to change the selection state. The header checkbox
 * is used to set the state of all rows in the table to the same state.
 *
 */
var ColumnSelect = /** @class */ (function () {
    function ColumnSelect(props) {
        var _this = this;
        this.columnSelectBehavior = {
            initialize: function (props) {
                _this.ariaHidden = props.tableProps.role === "menu";
                _this.itemProvider = props.tableProps.itemProvider;
                _this.selection = props.tableProps.selection;
                _this.onSelect = props.tableProps.onSelect;
            },
            componentDidMount: function (props) {
                _this.componentDidMount(props);
            },
            componentDidUpdate: function (props) {
                _this.componentDidUpdate(props);
            },
            componentWillUnmount: function () {
                _this.componentWillUnmount();
            }
        };
        this.allSelected = new ObservableValue(false);
        this.columnLayout = TableColumnLayout.none;
        this.id = "_select";
        this.width = 2.5;
        this.widthStyle = IMeasurementStyle.REM;
        this.behaviors = [this.columnSelectBehavior];
        this.renderCell = function (rowIndex, columnIndex, listColumn) {
            var _a, _b, _c;
            var selection = _this.selection;
            var selected = selection && selection.selected(rowIndex);
            var selectable = selection && selection.selectable(rowIndex);
            return (React.createElement("td", { "aria-colindex": columnIndex + 1, "aria-hidden": _this.ariaHidden, className: css("bolt-table-cell-select bolt-table-cell bolt-list-cell", "col-" + columnIndex), "data-column-index": columnIndex, key: "col-select", onClick: preventDefault, onDoubleClick: preventDefault, onMouseDown: function (event) {
                    _this.updateSelection(event, rowIndex);
                    event.preventDefault();
                }, onKeyDown: function (event) {
                    if (event.which === KeyCode.space) {
                        _this.updateSelection(event, rowIndex);
                        event.preventDefault();
                    }
                } },
                React.createElement("div", { className: "flex-row justify-center" },
                    React.createElement("span", { className: "flex-row-inline" },
                        React.createElement(Checkbox, { role: (_a = _this.props) === null || _a === void 0 ? void 0 : _a.role, ariaLabel: ((_b = _this.props) === null || _b === void 0 ? void 0 : _b.role) === "presentation" ? undefined : Resources.SelectRowLabel, checked: !!selected, excludeFocusZone: (_c = _this.props) === null || _c === void 0 ? void 0 : _c.excludeFocusZone, excludeTabStop: true, disabled: !selectable })))));
        };
        this.renderHeaderCell = function (columnIndex, listColumn, focuszoneId) {
            return (React.createElement("th", { "aria-colindex": columnIndex + 1, className: css("bolt-table-cell-select bolt-table-header-cell", "col-header-" + columnIndex), "data-column-index": columnIndex, key: "col-select" },
                React.createElement("div", { className: "flex-row" },
                    React.createElement(Observer, { allSelected: _this.allSelected }, function (props) {
                        var _a, _b;
                        var _c = _this, itemProvider = _c.itemProvider, selection = _c.selection;
                        // Get the total number of items within the list.
                        var itemCount = itemProvider && itemProvider.length;
                        return selection && selection.multiSelect && itemCount !== -1 ? (React.createElement("div", { className: "flex-row flex-grow justify-center" },
                            React.createElement(TriStateCheckbox, { ariaLabel: (_a = listColumn.ariaLabel) !== null && _a !== void 0 ? _a : Resources.SelectAllRowsLabel, checked: props.allSelected, focuszoneId: focuszoneId, onChange: _this.onChangeHeader }))) : (React.createElement("div", { "aria-label": (_b = listColumn.ariaLabel) !== null && _b !== void 0 ? _b : Resources.SelectionColumnLabel }));
                    }))));
        };
        this.onChangeHeader = function (event) {
            var _a = _this, itemProvider = _a.itemProvider, onSelect = _a.onSelect, selection = _a.selection;
            // toggle select all
            if (selection) {
                if (_this.allSelected.value !== false) {
                    selection.clear();
                    announce(Resources.AllRowsUnselectedMessage, true);
                }
                else {
                    selection.select(0, itemProvider && itemProvider.length);
                    announce(Resources.AllRowsSelectedMessage, true);
                }
            }
            if (onSelect && itemProvider) {
                for (var i = 0; i < itemProvider.length; i++) {
                    onSelect(event, _this.getListRow(i));
                }
            }
        };
        this.onSelectionChange = function () {
            var _a = _this, itemProvider = _a.itemProvider, selection = _a.selection;
            if (selection) {
                var selectedCount = selection.selectedCount;
                var itemCount = itemProvider && itemProvider.length - selection.unselectableCount;
                if (selectedCount > 0) {
                    if (selectedCount === itemCount) {
                        _this.allSelected.value = true;
                    }
                    else {
                        _this.allSelected.value = undefined;
                    }
                }
                else {
                    _this.allSelected.value = false;
                }
            }
        };
        this.updateSelection = function (event, rowIndex) {
            var _a = _this, onSelect = _a.onSelect, selection = _a.selection;
            if (selection) {
                if (selection.selected(rowIndex)) {
                    selection.unselect(rowIndex);
                }
                else {
                    selection.select(rowIndex, 1, true);
                }
            }
            if (onSelect) {
                var listRow = _this.getListRow(rowIndex);
                onSelect(event, listRow);
            }
        };
        this.getListRow = function (rowIndex) {
            return { data: _this.itemProvider ? _this.itemProvider.value[rowIndex] : {}, index: rowIndex };
        };
        this.props = props;
    }
    ColumnSelect.prototype.componentDidMount = function (props) {
        var _a = this, itemProvider = _a.itemProvider, selection = _a.selection;
        // We need to know about changes to the selection to manage the selectAll state.
        if (selection) {
            selection.subscribe(this.onSelectionChange);
            this.onSelectionChange();
        }
        if (itemProvider && itemProvider.subscribe) {
            itemProvider.subscribe(this.onSelectionChange);
        }
    };
    ColumnSelect.prototype.componentDidUpdate = function (props) {
        var selection = this.selection;
        if (selection !== props.tableProps.selection) {
            if (selection) {
                selection.unsubscribe(this.onSelectionChange);
            }
            selection = props.tableProps.selection;
            this.selection = selection;
            if (selection) {
                selection.subscribe(this.onSelectionChange);
            }
        }
        if (selection) {
            this.onSelectionChange();
        }
        if (this.itemProvider !== props.tableProps.itemProvider) {
            if (this.itemProvider && this.itemProvider.unsubscribe) {
                this.itemProvider.unsubscribe(this.onSelectionChange);
            }
            this.itemProvider = props.tableProps.itemProvider;
            if (this.itemProvider && this.itemProvider.subscribe) {
                this.itemProvider.subscribe(this.onSelectionChange);
            }
        }
    };
    ColumnSelect.prototype.componentWillUnmount = function () {
        var selection = this.selection;
        if (selection) {
            selection.unsubscribe(this.onSelectionChange);
        }
        if (this.itemProvider && this.itemProvider.unsubscribe) {
            this.itemProvider.unsubscribe(this.onSelectionChange);
        }
    };
    return ColumnSelect;
}());
export { ColumnSelect };
