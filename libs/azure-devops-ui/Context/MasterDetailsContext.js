import * as React from "react";
import { ObservableValue } from '../Core/Observable';
var BaseMasterDetailsContext = /** @class */ (function () {
    function BaseMasterDetailsContext(initialLayer, onExit) {
        var _this = this;
        this.hideDetailsPanel = new ObservableValue(false);
        this.getCurrentLayer = function () {
            return _this.payload;
        };
        this.getStack = function () {
            return _this.payloadStack;
        };
        this.push = function (newLayer) {
            _this.payloadStack.push(newLayer);
            if (newLayer.onPushed) {
                newLayer.onPushed(_this);
            }
            _this.payload.value = _this.payloadStack[_this.payloadStack.length - 1];
        };
        this.pop = function () {
            var returnVal = _this.payloadStack.pop();
            if (returnVal && returnVal.onPopped) {
                returnVal.onPopped(_this);
            }
            if (_this.payloadStack.length > 0) {
                _this.payload.value = _this.payloadStack[_this.payloadStack.length - 1];
            }
            else {
                _this.onExit();
            }
            return returnVal;
        };
        this.setDetailsPanelVisbility = function (visible) {
            _this.hideDetailsPanel.value = !visible;
        };
        this.payload = new ObservableValue(initialLayer);
        this.payloadStack = [initialLayer];
        this.onExit = onExit;
        if (initialLayer.onPushed) {
            initialLayer.onPushed(this);
        }
    }
    return BaseMasterDetailsContext;
}());
export { BaseMasterDetailsContext };
export var MasterDetailsContext = React.createContext(new BaseMasterDetailsContext({
    key: "",
    masterPanelContent: {},
    detailsContent: { renderContent: function () { return React.createElement("div", null); } },
    selectedMasterItem: new ObservableValue(null)
}, function () { return undefined; }));
/**
 * Binds a selection, for things like Tree and List, to an Observable (usually IMasterDetailsLayer.selectedMasterItem)
 * When selection changes, it will update the observable
 * Will set selection to current payload item if it exists; works nicely with createChildPayload when drilling down
 * Supports single-select only
 */
export function bindSelectionToObservable(selection, itemProvider, observable) {
    var assignFunction = function (selectedRanges) {
        if (selectedRanges[0]) {
            var index = selectedRanges[0].beginIndex;
            observable.value = itemProvider.value[index];
        }
    };
    // Do this before we subscribe so we don't accidentally call assignFunction
    var matchingIndex = itemProvider.value.findIndex(function (x) { return x === observable.value; });
    if (matchingIndex >= 0) {
        selection.select(matchingIndex);
    }
    selection.subscribe(assignFunction);
}
/**
 * Creates a layer that's a logical child of an existing layer
 * Useful for drill-down scenarios
 * Ensures correct typing of the child layer for common scenarios
 * @param key Unique identifier for the child layer
 * @param masterPanelDetails Master panel details for the child layer
 * @param detailsContent Detail rendering info for the child layer
 * @param initialSelectedItem Usually the clicked item from your current layer's detail view
 * @param parentLayer The parent layer, usually the currently displayed layer
 */
export function createChildLayer(key, masterPanelDetails, detailsContent, initialSelectedItem, parentLayer, onPushed, ariaLabel) {
    return {
        key: key,
        masterPanelContent: masterPanelDetails,
        detailsContent: detailsContent,
        selectedMasterItem: new ObservableValue(initialSelectedItem),
        parentItem: parentLayer.selectedMasterItem.value,
        onPushed: onPushed,
        ariaLabel: ariaLabel
    };
}
