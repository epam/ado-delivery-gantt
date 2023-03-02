import { __awaiter, __extends, __generator } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ColorPicker.css";
import * as React from "react";
import { wait } from '../../Core/Util/Promise';
import { Button } from '../../Button';
import { Callout, ContentSize } from '../../Callout';
import { FocusZone, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { SimpleTableCell, Table } from '../../Table';
import { css, KeyCode } from '../../Util';
import { colorItems, colorRowProvider } from "./Utils";
var ColorDropdownCalloutComponent = /** @class */ (function (_super) {
    __extends(ColorDropdownCalloutComponent, _super);
    function ColorDropdownCalloutComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._focusedColumn = 0;
        _this.renderCell = function (rowIndex, columnIndex, tableColumn, tableRow, ariaRowIndex) {
            var _a;
            var cell = tableRow.cells[columnIndex];
            var selectedIdx = (_a = _this.props.selection) === null || _a === void 0 ? void 0 : _a.value[0].beginIndex;
            var selected = cell === colorItems[selectedIdx !== null && selectedIdx !== void 0 ? selectedIdx : 0];
            return (React.createElement(SimpleTableCell, { ariaRowIndex: ariaRowIndex, columnIndex: columnIndex, key: columnIndex, tableColumn: tableColumn },
                React.createElement(Button, { id: rowIndex + "-" + columnIndex, className: css(selected && "bolt-dropdown-init-focus", "color-button flex-grow"), style: {
                        backgroundColor: "#" + cell.id
                    }, tooltipProps: { text: cell.text }, onClick: function (e) {
                        var _a;
                        var idx = colorItems.findIndex(function (ci) { return ci.id === cell.id; });
                        if (idx >= 0) {
                            (_a = _this.props.selection) === null || _a === void 0 ? void 0 : _a.select(idx);
                            _this.props.onSelect && _this.props.onSelect(e, colorItems[idx]);
                            _this.props.onDismiss();
                        }
                    }, onFocus: function () { return (_this._focusedColumn = columnIndex); }, 
                    // hack to prevent <tr> from getting focused
                    onKeyDown: function (e) {
                        if (columnIndex === 0 && e.which === KeyCode.leftArrow) {
                            e.preventDefault();
                        }
                    } })));
        };
        _this.columns = [
            { id: "c1", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c2", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c3", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c4", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c5", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c6", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c7", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c8", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c9", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c10", renderCell: _this.renderCell, width: -100 / 11 },
            { id: "c11", renderCell: _this.renderCell, width: -100 / 11 }
        ];
        return _this;
    }
    ColorDropdownCalloutComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, anchorElement = _a.anchorElement, anchorOffset = _a.anchorOffset, anchorOrigin = _a.anchorOrigin, anchorPoint = _a.anchorPoint, _b = _a.blurDismiss, blurDismiss = _b === void 0 ? true : _b, calloutContentClassName = _a.calloutContentClassName, contentLocation = _a.contentLocation, dropdownOrigin = _a.dropdownOrigin, excludeTabStop = _a.excludeTabStop, id = _a.id, lightDismiss = _a.lightDismiss, onFilterKeyDown = _a.onFilterKeyDown;
        var focusOnMount = true;
        var onDismiss = function () {
            if (_this.props.onDismiss) {
                _this.props.onDismiss();
            }
        };
        return (React.createElement(Callout, { anchorElement: anchorElement, anchorOffset: anchorOffset, anchorOrigin: anchorOrigin, anchorPoint: anchorPoint, blurDismiss: blurDismiss, calloutOrigin: dropdownOrigin, contentClassName: css(calloutContentClassName, "bolt-dropdown flex-column custom-scrollbar v-scroll-auto h-scroll-hidden color-dropdown-callout"), contentLocation: contentLocation, contentShadow: true, contentSize: ContentSize.Auto, escDismiss: true, id: id, lightDismiss: lightDismiss, focuszoneProps: {
                postprocessKeyStroke: function (event) {
                    // dismiss the callout on tab key instead of letting the
                    // browser handle the tab key, since with React.portals it
                    // will move to the body, instead of the next tabbable element after
                    // the dropdown.
                    if (event.which === KeyCode.tab && !event.defaultPrevented) {
                        event.preventDefault();
                        onDismiss();
                        return FocusZoneKeyStroke.IgnoreAll;
                    }
                    return FocusZoneKeyStroke.IgnoreNone;
                }
            }, onDismiss: onDismiss },
            React.createElement(FocusZone, { circularNavigation: true, defaultActiveElement: ".bolt-dropdown-init-focus", direction: FocusZoneDirection.Vertical, focusOnMount: focusOnMount !== undefined ? focusOnMount : true },
                React.createElement("div", { className: "bolt-dropdown-container no-outline", onKeyDown: onFilterKeyDown },
                    React.createElement("div", { "aria-hidden": "true", className: "no-outline", tabIndex: !excludeTabStop ? -1 : undefined, role: "listbox" }),
                    React.createElement(Table, { columns: this.columns, containerClassName: "color-dropdown-table-container", itemProvider: colorRowProvider, onFocus: function (reactEvent, r) { return __awaiter(_this, void 0, void 0, function () {
                            var evt, row, button;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        evt = reactEvent.nativeEvent;
                                        // Sometimes FocusZone correctly focuses the right button. If we also focus it, that
                                        // screws up FocusZone's counting. So we have to wait a sec and check to see if the
                                        // button is already focused to avoid double focusing.
                                        return [4 /*yield*/, wait(0)];
                                    case 1:
                                        // Sometimes FocusZone correctly focuses the right button. If we also focus it, that
                                        // screws up FocusZone's counting. So we have to wait a sec and check to see if the
                                        // button is already focused to avoid double focusing.
                                        _a.sent();
                                        if (evt.target.tagName === "TR") {
                                            row = evt.target;
                                            button = row.querySelector("td[data-column-index=\"" + this._focusedColumn + "\"] button");
                                            if (button && button !== document.activeElement) {
                                                button.focus();
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); } })))));
    };
    return ColorDropdownCalloutComponent;
}(React.Component));
export { ColorDropdownCalloutComponent };
