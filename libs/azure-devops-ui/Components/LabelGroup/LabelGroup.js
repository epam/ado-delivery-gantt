import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { WrappingBehavior } from "./LabelGroup.Props";
import { Label } from "../Label/Label";
import { css, getSafeId } from '../../Util';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { ObservableValue, ObservableLike } from '../../Core/Observable';
import { FocusWithin } from '../../FocusWithin';
import { Observer } from '../../Observer';
var LabelGroup = /** @class */ (function (_super) {
    __extends(LabelGroup, _super);
    function LabelGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.contentSelectionMap = {};
        _this.labelReferences = [];
        _this.onLabelMouseDown = function (event, model, index) {
            var _a = _this.props, _b = _a.disableMouseFocusOnLabels, disableMouseFocusOnLabels = _b === void 0 ? true : _b, onLabelMouseDown = _a.onLabelMouseDown;
            onLabelMouseDown && onLabelMouseDown(event, model, index);
            if (disableMouseFocusOnLabels) {
                event.preventDefault();
            }
        };
        _this.onLabelsChanged = function (changes) {
            var selectedSet = new Set(ObservableLike.getValue(_this.props.selectedLabelContents));
            changes.removedItems &&
                changes.removedItems.forEach(function (model) {
                    _this.contentSelectionMap[model.content] = undefined;
                });
            changes.addedItems &&
                changes.addedItems.forEach(function (model) {
                    _this.contentSelectionMap[model.content] = new ObservableValue(selectedSet.has(model.content));
                });
            return true;
        };
        _this.onSelectedKeysChanged = function (newData) {
            _this.updateKeySelectionMap(newData.addedItems, newData.removedItems);
            return false;
        };
        _this.buildContentSelectionMap(ObservableLike.getValue(props.labelProps), props.selectedLabelContents ? ObservableLike.getValue(props.selectedLabelContents) : []);
        return _this;
    }
    LabelGroup.prototype.focusLabel = function (index) {
        this.labelReferences[index] && this.labelReferences[index].focus();
    };
    LabelGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, _b = _a.defaultFocusElementId, defaultFocusElementId = _b === void 0 ? "label-0" : _b, _c = _a.enableHoverStyles, enableHoverStyles = _c === void 0 ? false : _c, _d = _a.fadeOutOverflow, fadeOutOverflow = _d === void 0 ? false : _d, id = _a.id, labelProps = _a.labelProps, onLabelClick = _a.onLabelClick, onLabelKeyDown = _a.onLabelKeyDown, selectedLabelContents = _a.selectedLabelContents, title = _a.title, _e = _a.wrappingBehavior, wrappingBehavior = _e === void 0 ? WrappingBehavior.oneLine : _e;
        var wrappingClassName = wrappingBehavior == WrappingBehavior.oneLine ? "one-line" : "free-flow";
        return (React.createElement("div", { className: css(className, "flex-column") },
            title && React.createElement("div", { className: "bolt-labelgroup-title-wrapper body-m" }, title),
            React.createElement(FocusZone, { allowArrowOutOfInputs: true, direction: FocusZoneDirection.Horizontal, focusGroupProps: { defaultElementId: defaultFocusElementId } },
                React.createElement("div", { className: css("bolt-labelgroup flex-row", wrappingClassName, fadeOutOverflow && "fade-out"), id: getSafeId(id) },
                    React.createElement(FocusWithin, null, function (focusWithinStatus) { return (React.createElement(React.Fragment, null,
                        React.createElement(Observer, { labelProps: { observableValue: labelProps, filter: _this.onLabelsChanged }, selectedLabelContents: { observableValue: selectedLabelContents, filter: _this.onSelectedKeysChanged } }, function (observerProps) {
                            return observerProps.labelProps &&
                                observerProps.labelProps.map(function (model, index) { return (React.createElement(Label, __assign({}, model, { enableHover: enableHoverStyles, id: "label-" + index, key: model.content, onBlur: focusWithinStatus.onBlur, onClick: function (event) {
                                        return onLabelClick && onLabelClick(event, model, index);
                                    }, onFocus: focusWithinStatus.onFocus, onKeyDown: function (event) {
                                        return onLabelKeyDown && onLabelKeyDown(event, model, index);
                                    }, onMouseDown: function (event) {
                                        return _this.onLabelMouseDown(event, model, index);
                                    }, ref: function (label) { return (_this.labelReferences[index] = label); }, selected: _this.contentSelectionMap[model.content] }))); });
                        }),
                        _this.props.children)); })))));
    };
    LabelGroup.prototype.buildContentSelectionMap = function (labelProps, selectedLabels) {
        var _this = this;
        this.contentSelectionMap = {};
        var selectedSet = new Set(selectedLabels);
        labelProps.forEach(function (model) {
            _this.contentSelectionMap[model.content] = new ObservableValue(selectedSet.has(model.content));
        });
    };
    LabelGroup.prototype.updateKeySelectionMap = function (newlySelectedLabels, noLongerSelectedLabels) {
        var _this = this;
        newlySelectedLabels &&
            newlySelectedLabels.forEach(function (value) {
                if (_this.contentSelectionMap[value]) {
                    _this.contentSelectionMap[value].value = true;
                }
            });
        noLongerSelectedLabels &&
            noLongerSelectedLabels.forEach(function (value) {
                if (_this.contentSelectionMap[value]) {
                    _this.contentSelectionMap[value].value = false;
                }
            });
    };
    return LabelGroup;
}(React.Component));
export { LabelGroup };
