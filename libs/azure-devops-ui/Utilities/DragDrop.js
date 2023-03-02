import * as React from "react";
import { ObservableValue } from '../Core/Observable';
import { Observer } from '../Observer';
import { Portal } from '../Portal';
import { css, getPointByEventType, Pointer } from "../Util";
import { distance } from "./Position";
/**
 * Represents the end result of a drag / drop operation.
 */
export var DragDropEffect;
(function (DragDropEffect) {
    /**
     * If the drop where to happen at this point, it would be a no-op.
     */
    DragDropEffect["none"] = "none";
    /**
     * The data should be moved from the drag source to the drop target.
     */
    DragDropEffect["move"] = "move";
    /**
     * The data should be copied from the drag source to the drop target.
     */
    DragDropEffect["copy"] = "copy";
})(DragDropEffect || (DragDropEffect = {}));
var DragDropManager = /** @class */ (function () {
    function DragDropManager() {
        var _this = this;
        this.onEventCaptured = function (event) {
            // Handle the pointerup and pointermove events
            var type = event.type;
            if (type === "pointermove") {
                // For pointermove events, if there is no drag in progress, we need to check to see if the pointer
                // has moved far enough to meet our threshold for triggering a drag/drop operation.
                if (!_this.dragInProgress) {
                    if (_this.potentialDragInProgress) {
                        var coordinates = getPointByEventType(event);
                        if (distance(_this.initialCoordinates, coordinates) > _this.minimumPixelsForDrag) {
                            // The position of the pointer is far enough away from our threshold to trigger a drag event.
                            // Fire the dragstart event to give the drag source an opportunity to cancel the operation
                            dispatchCustomDragEvent("dragstart", _this.dragSourceElement, event, _this.dataTransfer);
                            if (_this.dataTransfer.effectAllowed === DragDropEffect.none) {
                                _this.potentialDragInProgress = false;
                                _this.endDrag();
                            }
                            else {
                                _this.dragInProgress = true;
                            }
                            event.preventDefault();
                        }
                    }
                    // If there isn't the potential for a drag, that means a consumer has already
                    // indicated that we should cancel this drag event, so there is no need to continue to
                    // check anything about this event.
                }
                else {
                    // If there is a drag in progress, treat this as a dragover event.
                    var target = _this.getTargetFromEvent(event);
                    if (target) {
                        var coordinates = getPointByEventType(event);
                        _this.operation.x.value = coordinates.x;
                        _this.operation.y.value = coordinates.y;
                        dispatchCustomDragEvent("dragover", target, event, _this.dataTransfer);
                        event.preventDefault();
                    }
                }
            }
            else if (type === "pointerup") {
                if (_this.dragInProgress) {
                    var target = _this.getTargetFromEvent(event);
                    // Always fire the dragend event when we get a pointerup, if there was a drag in progress.
                    dispatchCustomDragEvent("dragend", _this.dragSourceElement, event, _this.dataTransfer);
                    if (target && _this.dataTransfer.dropEffect !== DragDropEffect.none) {
                        // Only fire a drop event if the dropEffect allows it.
                        dispatchCustomDragEvent("drop", target, event, _this.dataTransfer);
                    }
                }
                _this.endDrag();
            }
        };
        this.onPointerLeave = function (event) {
            // The pointer has left the bounds of the body element, so a drop is not
            // viable at this point.
            _this.dataTransfer.dropEffect = DragDropEffect.none;
        };
        this.onPointerOut = function (event) {
            if (event.target) {
                // The pointer has left an element, so we need to set the dropEffect to none.
                // The dragover event will fire, giving a new drop target the chance to
                // reset the effect.
                _this.dataTransfer.dropEffect = DragDropEffect.none;
                dispatchCustomDragEvent("dragexit", event.target, event, _this.dataTransfer);
            }
        };
        this.onPointerOver = function (event) {
            if (event.target) {
                // The pointer has entered an element, so we need to set the dropEffect to none.
                // The dragover event will fire, giving a new drop target the chance to
                // reset the effect.
                _this.dataTransfer.dropEffect = DragDropEffect.none;
                dispatchCustomDragEvent("dragenter", event.target, event, _this.dataTransfer);
            }
        };
    }
    DragDropManager.prototype.beginDragOperation = function (event, dataTransfer, minimumPixelsForDrag) {
        if (minimumPixelsForDrag === void 0) { minimumPixelsForDrag = 4; }
        this.operation = undefined;
        // Something (typically a pointdown on a drag source) has indicated that there is the potential
        // for a drag operation. If there is a drag operation already in progress, do nothing.
        if (!this.dragInProgress) {
            // If there is no drag operation in progress, we should set up the event handlers to detect pointer
            // operations that could lead us to actually start the drag / drop operation.
            if (event.type === "pointerdown") {
                this.startDrag(event, minimumPixelsForDrag, dataTransfer);
                this.initialCoordinates = {
                    x: event.clientX,
                    y: event.clientY
                };
                Pointer.setCapture(this.onEventCaptured);
                document.body.addEventListener("pointerout", this.onPointerOut, true);
                document.body.addEventListener("pointerover", this.onPointerOver, true);
                document.body.addEventListener("pointerleave", this.onPointerLeave);
                this.operation = {
                    x: new ObservableValue(undefined),
                    y: new ObservableValue(undefined)
                };
            }
        }
        return this.operation;
    };
    Object.defineProperty(DragDropManager.prototype, "isDragInProgress", {
        get: function () {
            return this.dragInProgress;
        },
        enumerable: false,
        configurable: true
    });
    DragDropManager.prototype.endDrag = function () {
        document.body.removeEventListener("pointerout", this.onPointerOut);
        document.body.removeEventListener("pointerover", this.onPointerOver);
        document.body.removeEventListener("pointerleave", this.onPointerLeave);
        this.dragInProgress = false;
    };
    DragDropManager.prototype.getTargetFromEvent = function (event) {
        return event.target;
    };
    DragDropManager.prototype.startDrag = function (event, minimumPixelsForDrag, dataTransfer) {
        this.potentialDragInProgress = true;
        this.dragSourceElement = event.target;
        this.minimumPixelsForDrag = minimumPixelsForDrag;
        this.dataTransfer = dataTransfer;
    };
    return DragDropManager;
}());
var dragDropManager = new DragDropManager();
export function beginDragOperation(event, dataTransfer, minimumPixelsForDrag) {
    return dragDropManager.beginDragOperation(event, dataTransfer, minimumPixelsForDrag);
}
export function dispatchCustomDragEvent(eventType, target, event, dataTransfer) {
    var customEvent = new CustomEvent(eventType, {
        bubbles: true,
        detail: { dataTransfer: dataTransfer, nativeEvent: event }
    });
    target.dispatchEvent(customEvent);
    return customEvent;
}
export function getDragInProgress() {
    return dragDropManager.isDragInProgress;
}
export var DragImage = function (props) {
    var className = props.className, operation = props.operation, _a = props.xOffset, xOffset = _a === void 0 ? 5 : _a, _b = props.yOffset, yOffset = _b === void 0 ? 5 : _b;
    return (React.createElement(Portal, { className: "bolt-drag-image-portal" },
        React.createElement(Observer, { x: operation.x, y: operation.y }, function (observedProps) {
            return observedProps.x !== undefined && observedProps.y !== undefined ? (React.createElement("div", { className: css(className, "bolt-drag-image depth-16 absolute flex-row flex-center scroll-hidden justify-center"), style: { left: observedProps.x + xOffset + "px", top: observedProps.y + yOffset + "px" } }, props.children)) : null;
        })));
};
