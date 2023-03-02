import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { beginDragOperation, DragDropEffect, DragImage } from '../../Utilities/DragDrop';
import { cellFromEvent } from "./List";
/**
 * A behavior that turns a list into the source of a drag and drop operation. Note - this
 * behavior should only be used if your list is intended to _only_ be a drag source. Please use
 * the ListDragDropBehavior instead if the list is also a drop target, as that is the only way
 * to get keyboard drag and drop support within your list.
 */
var ListDragSourceBehavior = /** @class */ (function () {
    function ListDragSourceBehavior(options) {
        var _this = this;
        this.initialize = function (props, dragDroppableUI, eventDispatch) {
            _this.dragDroppableUI = dragDroppableUI;
            _this.eventDispatch = eventDispatch;
            _this.eventDispatch.addEventListener("pointerdown", _this.onPointerDown);
            _this.eventDispatch.addEventListener("dragstart", _this.onDragStart);
            _this.eventDispatch.addEventListener("dragend", _this.onDragEnd);
            _this.eventDispatch.addEventListener("dragover", _this.onDragging);
            _this.itemProvider = props.itemProvider;
        };
        this.onDragging = function (event) {
            if (_this.options.onDragging) {
                _this.options.onDragging(event);
                return;
            }
            _this.onDraggingDefault();
        };
        this.onDraggingDefault = function () {
            var _a, _b, _c, _d;
            var scrollableElement = (_b = (_a = _this.dragDroppableUI) === null || _a === void 0 ? void 0 : _a.currentElement) === null || _b === void 0 ? void 0 : _b.current;
            if (!scrollableElement) {
                return;
            }
            ;
            var _e = scrollableElement.getBoundingClientRect(), top = _e.top, bottom = _e.bottom;
            var speedRate = 20;
            var edgeRate = 0.05;
            var edgeSize = scrollableElement.offsetHeight * edgeRate;
            var viewportY = (_d = (_c = _this.operation) === null || _c === void 0 ? void 0 : _c.y) === null || _d === void 0 ? void 0 : _d.value;
            if (!viewportY) {
                return;
            }
            var isInBottomEdge = bottom - edgeSize < viewportY;
            var isInTopEdge = top + edgeSize > viewportY;
            var canScrollUp = scrollableElement.scrollTop > 0;
            var canScrollDown = scrollableElement.scrollTop + scrollableElement.offsetHeight < scrollableElement.scrollHeight;
            if (isInBottomEdge && canScrollDown) {
                scrollableElement.scrollTo({ top: scrollableElement.scrollTop + speedRate });
            }
            else if (isInTopEdge && canScrollUp) {
                scrollableElement.scrollTo({ top: scrollableElement.scrollTop - speedRate });
            }
        };
        this.onDragEnd = function (event) {
            var index = cellFromEvent(event).rowIndex;
            if (index >= 0 && _this.options.onDragEnd) {
                _this.options.onDragEnd(event);
            }
            _this.dragDroppableUI.removeOverlay("drag-source-item");
            _this.dragImageData = undefined;
        };
        this.onDragStart = function (event) {
            if (event.detail.dataTransfer) {
                var index = cellFromEvent(event).rowIndex;
                if (index >= 0) {
                    if (_this.options.onDragStart) {
                        _this.options.onDragStart(event);
                    }
                    if (event.detail.dataTransfer.effectAllowed !== DragDropEffect.none) {
                        _this.dragDroppableUI.addOverlay("drag-source-item", index, _this.renderDragSourceItemOverlay);
                        if (_this.dragImageData === undefined) {
                            _this.dragImageData = {
                                image: _this.options.renderDragImage(event)
                            };
                        }
                    }
                }
            }
            else {
                event.stopPropagation();
                event.preventDefault();
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
        this.options = options;
    }
    ListDragSourceBehavior.prototype.componentDidUpdate = function (props) {
        this.itemProvider = props.itemProvider;
    };
    ListDragSourceBehavior.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        (_a = this.eventDispatch) === null || _a === void 0 ? void 0 : _a.removeEventListener("pointerdown", this.onPointerDown);
        (_b = this.eventDispatch) === null || _b === void 0 ? void 0 : _b.removeEventListener("dragstart", this.onDragStart);
        (_c = this.eventDispatch) === null || _c === void 0 ? void 0 : _c.removeEventListener("dragend", this.onDragEnd);
        (_d = this.eventDispatch) === null || _d === void 0 ? void 0 : _d.removeEventListener("dragover", this.onDragging);
    };
    ListDragSourceBehavior.prototype.beginDrag = function (event) {
        var index = cellFromEvent(event).rowIndex;
        if (this.itemProvider && index >= 0) {
            var item = this.itemProvider.value[index];
            this.operation = beginDragOperation(event, {
                data: item,
                dropEffect: DragDropEffect.none,
                secondaryData: { index: index, sourceId: this.options.id },
                setDragImage: this.setDragImage,
                type: this.options.type
            });
        }
    };
    return ListDragSourceBehavior;
}());
export { ListDragSourceBehavior };
