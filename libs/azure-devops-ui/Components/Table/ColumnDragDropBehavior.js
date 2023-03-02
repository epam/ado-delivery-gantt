import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
import { ListDropIndicatorPosition } from '../../Components/List/ListDropIndicator.Props';
import { cellFromEvent } from '../../List';
import { getPointByEventType } from '../../Util';
import { beginDragOperation, DragDropEffect, DragImage } from '../../Utilities/DragDrop';
import { ListDropIndicator } from "../List/ListDropIndicator";
import { ColumnFillId } from "./Table";
/**
 * A behavior for dragging & dropping columns
 */
var ColumnDragDropBehavior = /** @class */ (function () {
    function ColumnDragDropBehavior(options) {
        var _this = this;
        this.initialize = function (props, dragDroppableUI, eventDispatch) {
            _this.dragDroppableUI = dragDroppableUI;
            _this.eventDispatch = eventDispatch;
            _this.eventDispatch.addEventListener("pointerdown", _this.onPointerDown);
            _this.eventDispatch.addEventListener("dragstart", _this.onDragStart);
            _this.eventDispatch.addEventListener("dragend", _this.onDragEnd);
            _this.eventDispatch.addEventListener("dragenter", _this.onDragEnter);
            _this.eventDispatch.addEventListener("dragexit", _this.onDragExit);
            _this.eventDispatch.addEventListener("dragover", _this.onDragOver);
            _this.eventDispatch.addEventListener("drop", _this.onDrop);
            _this.indicatorName = "drop-indicator";
        };
        this.onDragEnd = function (event) {
            var index = eventIsOnHeader(event);
            if (index && index >= 0 && _this.options.onDragEnd) {
                _this.options.onDragEnd(event);
            }
            _this.dragDroppableUI.removeOverlay("drag-source-item");
            _this.dragImageData = undefined;
        };
        this.onDragStart = function (event) {
            if (event.detail.dataTransfer && !event.defaultPrevented) {
                var index = eventIsOnHeader(event);
                if (index !== null && index >= 0) {
                    if (_this.options.onDragStart) {
                        _this.options.onDragStart(event);
                    }
                    if (event.detail.dataTransfer.effectAllowed !== DragDropEffect.none) {
                        _this.dragDroppableUI.addOverlay("drag-source-item", -1, _this.renderDragSourceItemOverlay, 
                        /** z-index */ 0, 
                        /** columnIndex */ index);
                        if (_this.dragImageData === undefined) {
                            _this.dragImageData = {
                                image: _this.options.renderDragImage(event)
                            };
                        }
                    }
                }
            }
        };
        this.onPointerDown = function (event) {
            if (event.button === 0) {
                _this.beginDrag(event);
            }
        };
        this.renderDragSourceItemOverlay = function (props) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "bolt-list-drag-source-item flex-grow" }),
                _this.operation && _this.dragImageData && React.createElement(DragImage, { operation: _this.operation }, _this.dragImageData.image)));
        };
        this.setDragImage = function (image, xOffset, yOffset) {
            _this.dragImageData = { image: image, xOffset: xOffset, yOffset: yOffset };
        };
        this.onDragEnter = function (event) {
            if (!_this.handlesType(event)) {
                return;
            }
            if (_this.options.onDragEnter) {
                _this.options.onDragEnter(event);
            }
            else {
                event.detail.dataTransfer.dropEffect = DragDropEffect.move;
            }
        };
        this.onDragExit = function (event) {
            if (!_this.handlesType(event)) {
                return;
            }
            if (_this.options.onDragExit) {
                _this.options.onDragExit(event);
            }
            _this.dragDroppableUI.removeOverlay(_this.indicatorName);
        };
        this.onDragOver = function (event) {
            if (!_this.handlesType(event)) {
                return;
            }
            var index = _this.calculateIndex(event);
            var dragIndex = event.detail.dataTransfer.secondaryData.index;
            var listId = event.detail.dataTransfer.secondaryData.sourceId;
            if (index >= 0 && (index !== dragIndex || listId !== _this.options.id) && _this.options.columns[index].id !== ColumnFillId) {
                if (_this.options.onDragOver) {
                    _this.options.onDragOver(event, { index: _this.listIndicatorPosition === ListDropIndicatorPosition.right ? index + 1 : index });
                }
                else {
                    event.detail.dataTransfer.dropEffect = DragDropEffect.move;
                }
            }
            else {
                event.detail.dataTransfer.dropEffect = DragDropEffect.none;
            }
            if (event.detail.dataTransfer.dropEffect === DragDropEffect.none) {
                _this.dragDroppableUI.removeOverlay(_this.indicatorName);
            }
            else {
                _this.dragDroppableUI.addOverlay(_this.indicatorName, -1, _this.renderDropIndicator, /** z-index */ 0, /** columnIndex */ index);
            }
        };
        this.onDrop = function (event) {
            if (!_this.handlesType(event)) {
                return;
            }
            var index = _this.calculateIndex(event);
            var dragIndex = event.detail.dataTransfer.secondaryData.index;
            var listId = event.detail.dataTransfer.secondaryData.sourceId;
            if (index >= 0 && (index !== dragIndex || listId !== _this.options.id) && _this.options.onDrop) {
                event.persist();
                _this.options.onDrop(event, { index: _this.listIndicatorPosition === ListDropIndicatorPosition.right ? index + 1 : index });
            }
            _this.dragDroppableUI.removeOverlay(_this.indicatorName);
        };
        this.renderDropIndicator = function (props) {
            var xOffset = _this.listIndicatorPosition === ListDropIndicatorPosition.right ? props.rowElement.offsetWidth : 0;
            return React.createElement(ListDropIndicator, { position: _this.listIndicatorPosition, xOffset: xOffset - 3, lineOffset: xOffset });
        };
        this.options = options;
        this.contextMenuIndex = options.columns.findIndex(function (col) { return col.id === "_more"; });
    }
    ColumnDragDropBehavior.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = this.eventDispatch) === null || _a === void 0 ? void 0 : _a.removeEventListener("pointerdown", this.onPointerDown);
        (_b = this.eventDispatch) === null || _b === void 0 ? void 0 : _b.removeEventListener("dragstart", this.onDragStart);
        (_c = this.eventDispatch) === null || _c === void 0 ? void 0 : _c.removeEventListener("dragend", this.onDragEnd);
        (_d = this.eventDispatch) === null || _d === void 0 ? void 0 : _d.removeEventListener("dragenter", this.onDragEnter);
        (_e = this.eventDispatch) === null || _e === void 0 ? void 0 : _e.removeEventListener("dragexit", this.onDragExit);
        (_f = this.eventDispatch) === null || _f === void 0 ? void 0 : _f.removeEventListener("dragover", this.onDragOver);
        (_g = this.eventDispatch) === null || _g === void 0 ? void 0 : _g.removeEventListener("drop", this.onDrop);
    };
    ColumnDragDropBehavior.prototype.updateBehaviorOptions = function (options) {
        this.options = options;
    };
    ColumnDragDropBehavior.prototype.beginDrag = function (event) {
        var _a;
        var index = eventIsOnHeader(event);
        if (index !== null && ((_a = this.options) === null || _a === void 0 ? void 0 : _a.columns) && index >= 0) {
            var item = this.options.columns[index];
            this.operation = beginDragOperation(event, {
                data: item,
                dropEffect: DragDropEffect.none,
                secondaryData: { index: index, sourceId: this.options.id },
                setDragImage: this.setDragImage,
                type: this.options.type
            });
        }
    };
    ColumnDragDropBehavior.prototype.handlesType = function (event) {
        var _a;
        var type = ((_a = event.detail.dataTransfer) === null || _a === void 0 ? void 0 : _a.type) || "";
        return this.options.allowedTypes.indexOf(type) !== -1;
    };
    ColumnDragDropBehavior.prototype.calculateIndex = function (event) {
        var cell = cellFromEvent(event);
        var index = cell.cellIndex;
        if (cell.cellElement && event.detail.dataTransfer.secondaryData) {
            var dragIndex = event.detail.dataTransfer.secondaryData.index;
            var nativeEvent = event.detail.nativeEvent;
            var columnRect = cell.cellElement.getBoundingClientRect();
            var point = getPointByEventType(nativeEvent);
            var leftOfColumn = point ? point.x < columnRect.width / 2 + columnRect.left : index < dragIndex;
            if (index < dragIndex) {
                this.listIndicatorPosition = ListDropIndicatorPosition.left;
                if (!leftOfColumn) {
                    index++;
                }
                if (index === this.contextMenuIndex) {
                    index--;
                }
            }
            else if (index > dragIndex) {
                this.listIndicatorPosition = ListDropIndicatorPosition.right;
                if (leftOfColumn) {
                    index--;
                }
                if (index + 1 < this.options.columns.length && index + 1 == this.contextMenuIndex) {
                    index++;
                }
            }
            // No-op if index === dragIndex
        }
        return index;
    };
    return ColumnDragDropBehavior;
}());
export { ColumnDragDropBehavior };
function eventIsOnHeader(event) {
    var cell = cellFromEvent(event);
    return cell.rowIndex === -1 ? cell.cellIndex : null;
}
