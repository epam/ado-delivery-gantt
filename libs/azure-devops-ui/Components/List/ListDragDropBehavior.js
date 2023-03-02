import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import { KeyCode, noop } from '../../Util';
import { dispatchCustomDragEvent, DragDropEffect } from '../../Utilities/DragDrop';
import { cellFromEvent } from "./List";
import { ListDragSourceBehavior } from "./ListDragSourceBehavior";
import { ListDropTargetBehavior } from "./ListDropTargetBehavior";
/**
 * A behavior that combines the ListDragSourceBehavior and ListDropTargetBehavior. If your list
 * is only meant to be a drag source, or only meant to be a drop target, then use those two
 * behaviors individually.
 * In addition to combining the two behaviors for convenience, this single behavior also enhances
 * the list with keyboard drag and drop support.
 */
var ListDragDropBehavior = /** @class */ (function () {
    function ListDragDropBehavior(options) {
        var _this = this;
        this.initialize = function (props, dragDroppableUI, eventDispatch) {
            _this.eventDispatch = eventDispatch;
            _this.itemProvider = props.itemProvider;
            _this.eventDispatch.addEventListener("keydown", _this.onKeyDown);
            _this.dragBehavior.initialize(props, dragDroppableUI, eventDispatch);
            _this.dropBehavior.initialize(props, dragDroppableUI, eventDispatch);
        };
        this.onDragRowKeyDown = function (event) {
            if (event.which === KeyCode.escape) {
                _this.endDrag(event);
            }
            else if (event.which === KeyCode.space) {
                _this.endDrag(event, true);
            }
            else if (event.which === KeyCode.downArrow) {
                _this.focusIndex = Math.min(_this.focusIndex + 1, _this.itemProvider.length);
                _this.fireRowDragEvents(event);
            }
            else if (event.which === KeyCode.upArrow) {
                _this.focusIndex = Math.max(_this.focusIndex - 1, 0);
                _this.fireRowDragEvents(event);
            }
            // We don't want the list itself to have a chance to handle these events, while
            // we are in the middle of a drag operation.
            event.preventDefault();
        };
        this.onKeyDown = function (event) {
            if (!event.defaultPrevented && event.which === KeyCode.space && event.target.tagName !== "INPUT") {
                // The user has hit spacebar on the row, so we should start the drag/drop operation.
                var index = cellFromEvent(event).rowIndex;
                _this.focusIndex = index;
                var item = _this.itemProvider.value[index];
                _this.dataTransfer = {
                    data: item,
                    dropEffect: DragDropEffect.none,
                    secondaryData: { index: index, sourceId: _this.options.id },
                    setDragImage: noop,
                    type: _this.options.type
                };
                // Give the consumer a chance to cancel the drag/drop operation
                dispatchCustomDragEvent("dragstart", event.target, event.nativeEvent, _this.dataTransfer);
                if (_this.dataTransfer.effectAllowed !== DragDropEffect.none) {
                    // As long as the operation was not cancelled, save off the
                    // row element that is being dragged and add a keydown listener.
                    // This listener will get called before the event dispatch for the list
                    // itself and allows us to have a way to no change focus as the user
                    // arrows up and down.
                    _this.dragItemRowElement = event.target;
                    _this.dragItemRowElement.addEventListener("keydown", _this.onDragRowKeyDown);
                }
            }
        };
        this.options = options;
        this.dragBehavior = new ListDragSourceBehavior(options);
        this.dropBehavior = new ListDropTargetBehavior(options);
    }
    ListDragDropBehavior.prototype.componentDidUpdate = function (props) {
        this.itemProvider = props.itemProvider;
        this.dragBehavior.componentDidUpdate(props);
        this.dropBehavior.componentDidUpdate(props);
    };
    ListDragDropBehavior.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.eventDispatch) === null || _a === void 0 ? void 0 : _a.removeEventListener("keydown", this.onKeyDown);
        if (this.dragItemRowElement) {
            this.dragItemRowElement.removeEventListener("keydown", this.onDragRowKeyDown);
        }
        this.dragBehavior.componentWillUnmount();
        this.dropBehavior.componentWillUnmount();
    };
    ListDragDropBehavior.prototype.dispatchEventAtIndex = function (eventType, target, event, index) {
        // To maintain consistency with mouse-based drag and drop, we want a way to have the row itself fire
        // the drag events. Since the row element isn't actually associated with the keyboard event that we get,
        // because the drag row itself is still the source of all of these events, we need a way to find that
        // row. We do this by first finding the list of our drag row, and then finding the row with the correct
        // index within that list.
        var listElement = target;
        while (listElement) {
            // We have hit the root of the list, dont look above this.
            if (listElement.classList.contains("bolt-list")) {
                break;
            }
            listElement = listElement.parentElement;
        }
        if (listElement) {
            var rowTarget = listElement.querySelector("[data-row-index='" + index + "']");
            if (rowTarget) {
                dispatchCustomDragEvent(eventType, rowTarget, event, this.dataTransfer);
            }
        }
    };
    ListDragDropBehavior.prototype.endDrag = function (event, drop) {
        if (drop === void 0) { drop = false; }
        dispatchCustomDragEvent("dragend", event.target, event, this.dataTransfer);
        if (drop) {
            this.dispatchEventAtIndex("drop", event.target, event, this.focusIndex);
        }
        else {
            this.dispatchEventAtIndex("dragexit", event.target, event, this.focusIndex);
        }
        if (this.dragItemRowElement) {
            this.dragItemRowElement.removeEventListener("keydown", this.onDragRowKeyDown);
            this.dragItemRowElement = undefined;
        }
    };
    ListDragDropBehavior.prototype.fireRowDragEvents = function (event) {
        this.dispatchEventAtIndex("dragenter", event.target, event, this.focusIndex);
        this.dispatchEventAtIndex("dragover", event.target, event, this.focusIndex);
    };
    return ListDragDropBehavior;
}());
export { ListDragDropBehavior };
