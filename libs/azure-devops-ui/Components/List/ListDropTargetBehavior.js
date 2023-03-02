import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { getPointByEventType } from '../../Util';
import { DragDropEffect } from '../../Utilities/DragDrop';
import { cellFromEvent } from "./List";
import { ListDropIndicator } from "./ListDropIndicator";
import { ListDropIndicatorPosition } from "./ListDropIndicator.Props";
/**
 * A behavior that turns a list into the target of a drag and drop operation. Note - this
 * behavior should only be used if your list is intended to _only_ be a drop target. Please use
 * the ListDragDropBehavior instead if the list is also a drag source, as that is the only way
 * to get keyboard drag and drop support within your list.
 */
var ListDropTargetBehavior = /** @class */ (function () {
    function ListDropTargetBehavior(options) {
        var _this = this;
        this.initialize = function (props, dragDroppableUI, eventDispatch) {
            _this.dragDroppableUI = dragDroppableUI;
            _this.eventDispatch = eventDispatch;
            _this.eventDispatch.addEventListener("dragenter", _this.onDragEnter);
            _this.eventDispatch.addEventListener("dragexit", _this.onDragExit);
            _this.eventDispatch.addEventListener("dragover", _this.onDragOver);
            _this.eventDispatch.addEventListener("drop", _this.onDrop);
            _this.itemProvider = props.itemProvider;
            _this.indicatorName = _this.options.isTree ? "tree-drop-indicator" : "drop-indicator";
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
            if (index >= 0 && (index !== dragIndex || listId !== _this.options.id || _this.options.isTree)) {
                if (_this.options.onDragOver) {
                    _this.options.onDragOver(event, { index: _this.listIndicatorPosition === ListDropIndicatorPosition.bottom ? index + 1 : index });
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
                _this.dragDroppableUI.addOverlay(_this.indicatorName, index, _this.renderDropIndicator);
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
                _this.options.onDrop(event, { index: _this.listIndicatorPosition === ListDropIndicatorPosition.bottom ? index + 1 : index });
            }
            _this.dragDroppableUI.removeOverlay(_this.indicatorName);
        };
        this.renderDropIndicator = function (props) {
            return _this.options.isTree ? (React.createElement("div", { className: "bolt-list-tree-drop-target flex-grow" })) : (React.createElement(ListDropIndicator, { position: _this.listIndicatorPosition }));
        };
        this.options = options;
    }
    ListDropTargetBehavior.prototype.componentDidUpdate = function (props) {
        this.itemProvider = props.itemProvider;
    };
    ListDropTargetBehavior.prototype.componentWillUnmount = function () {
        var _a, _b, _c;
        (_a = this.eventDispatch) === null || _a === void 0 ? void 0 : _a.removeEventListener("dragenter", this.onDragEnter);
        (_b = this.eventDispatch) === null || _b === void 0 ? void 0 : _b.removeEventListener("dragexit", this.onDragExit);
        (_c = this.eventDispatch) === null || _c === void 0 ? void 0 : _c.removeEventListener("dragover", this.onDragOver);
    };
    ListDropTargetBehavior.prototype.calculateIndex = function (event) {
        var cell = cellFromEvent(event);
        var index = cell.rowIndex;
        if (this.options.isTree) {
            return index;
        }
        if (cell.rowElement && event.detail.dataTransfer.secondaryData) {
            var dragIndex = event.detail.dataTransfer.secondaryData.index;
            var listId = event.detail.dataTransfer.secondaryData.sourceId;
            var nativeEvent = event.detail.nativeEvent;
            var rowRect = cell.rowElement.getBoundingClientRect();
            var point = getPointByEventType(nativeEvent);
            var topHalfOfRow = point ? point.y < rowRect.height / 2 + rowRect.top : index < dragIndex;
            if (this.options.id !== listId) {
                this.listIndicatorPosition = ListDropIndicatorPosition.top;
                if (!topHalfOfRow) {
                    index++;
                }
                if (index >= this.itemProvider.length) {
                    this.listIndicatorPosition = ListDropIndicatorPosition.bottom;
                    index--;
                }
            }
            else {
                if (index < dragIndex) {
                    this.listIndicatorPosition = ListDropIndicatorPosition.top;
                    if (!topHalfOfRow) {
                        index++;
                    }
                }
                else if (index > dragIndex) {
                    this.listIndicatorPosition = ListDropIndicatorPosition.bottom;
                    if (topHalfOfRow) {
                        index--;
                    }
                }
                // No-op if index === dragIndex
            }
        }
        return index;
    };
    ListDropTargetBehavior.prototype.handlesType = function (event) {
        var _a;
        var type = ((_a = event.detail.dataTransfer) === null || _a === void 0 ? void 0 : _a.type) || "";
        return this.options.allowedTypes.indexOf(type) !== -1;
    };
    return ListDropTargetBehavior;
}());
export { ListDropTargetBehavior };
