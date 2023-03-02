import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import * as Resources from '../../Resources.Label';
import { WrappingBehavior } from "./LabelGroup.Props";
import { LabelGroup } from "./LabelGroup";
import { css, getSafeId, KeyCode } from '../../Util';
import { ObservableValue, ObservableArray, ObservableLike } from '../../Core/Observable';
import { Autocomplete } from "../Autocomplete/Autocomplete";
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Observer } from '../../Observer';
var EditableLabelGroup = /** @class */ (function (_super) {
    __extends(EditableLabelGroup, _super);
    function EditableLabelGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.autocompleteRef = React.createRef();
        _this.autocompleteValue = new ObservableValue("");
        // Using a boolean instead of stopPropagation here so that people get the events up the DOM tree
        // if they have onMouseDown bound on wrappers etc.
        _this.isMouseDownEventHandled = false;
        _this.labelGroupRef = React.createRef();
        _this.renderTitleIconFlag = new ObservableValue(false);
        _this.selectedLabelContents = new ObservableArray();
        _this.filterLabelModelAgainstContents = function (testModel) {
            return ObservableLike.getValue(_this.props.labelProps).filter(function (y) { return y.content.toUpperCase() === testModel.content.toUpperCase(); }).length == 0;
        };
        _this.onAddButtonClicked = function () {
            _this.setState({ isInEditMode: true }, function () { return _this.autocompleteRef.current.focus(); });
        };
        _this.onAutocompleteFocus = function (event) {
            _this.selectedLabelContents.removeAll();
        };
        _this.onAutocompleteValueChange = function (newValue) {
            _this.autocompleteValue.value = newValue;
        };
        _this.onBlur = function (event) {
            /**
             * Delay the toggle off; _onFocus will clear the timeout
             */
            _this.focusOutTimeoutId = setTimeout(function () {
                _this.selectedLabelContents.removeAll();
                _this.autocompleteValue.value = "";
                _this.setState({ isInEditMode: false });
                _this.props.onBlur && _this.props.onBlur();
            }, 0); /**/
        };
        _this.onCheckForDuplicates = function (newInput) {
            return (ObservableLike.getValue(_this.props.labelProps).filter(function (testModel) { return testModel.content.trim().toUpperCase() === newInput.trim().toUpperCase(); }).length !== 0);
        };
        // Only for handling keyboard focus
        _this.onFocus = function (event) {
            clearTimeout(_this.focusOutTimeoutId);
            if (!_this.state.isInEditMode) {
                var callbackFunction = function () {
                    _this.renderTitleIconFlag.value = false;
                    _this.autocompleteRef.current.focus();
                };
                _this.setState({ isInEditMode: true }, callbackFunction);
            }
        };
        _this.onGetSuggestions = function (content) {
            if (content === "" || !_this.props.getSuggestedLabels) {
                return new Promise(function (resolve) { return resolve([]); });
            }
            var labelModels = _this.props.getSuggestedLabels(content);
            return Promise.resolve(labelModels).then(function (suggestions) { return suggestions.filter(_this.filterLabelModelAgainstContents); });
        };
        _this.onInnerMouseDOwn = function (event) {
            // Eat the event; allow focus to move and signal that the outer wrapper shouldn't handle it
            if (_this.state.isInEditMode) {
                _this.isMouseDownEventHandled = true;
            }
        };
        _this.onInputKeyDown = function (event) {
            var inputValue = _this.autocompleteValue.value;
            if (event.which === KeyCode.backspace || event.which === KeyCode.delete) {
                if (_this.props.labelProps.length > 0 && inputValue === "") {
                    // Make sure we have an element to remove
                    _this.removeLabel(ObservableLike.getValue(_this.props.labelProps)[_this.props.labelProps.length - 1].content);
                    event.preventDefault();
                }
            }
        };
        _this.onInputSubmit = function (labelModel) {
            _this.props.onLabelSubmit && _this.props.onLabelSubmit(labelModel);
            _this.autocompleteValue.value = "";
            _this.autocompleteRef.current.focus();
        };
        _this.onLabelKeyDown = function (event, model, index) {
            _this.props.onLabelKeyDown && _this.props.onLabelKeyDown(event, model, index);
            if (event.isDefaultPrevented()) {
                return;
            }
            var selectedOrFocusedContents = new Set(__spreadArrays(_this.selectedLabelContents.value, [model.content]));
            if (event.which === KeyCode.backspace || event.which === KeyCode.delete) {
                var nextLabelFocusIndex = -1;
                var minSelectedIndex_1 = 99999;
                selectedOrFocusedContents.forEach(function (content) {
                    var index = ObservableLike.getValue(_this.props.labelProps).findIndex(function (testModel) { return testModel.content === content; });
                    minSelectedIndex_1 = Math.min(minSelectedIndex_1, index);
                });
                // If it's 0, we need to focus the first unselected item in the group
                if (minSelectedIndex_1 === 0) {
                    var selectedNextContent_1 = new Set(selectedOrFocusedContents);
                    nextLabelFocusIndex = ObservableLike.getValue(_this.props.labelProps).findIndex(function (model) { return !selectedNextContent_1.has(model.content); });
                }
                else {
                    // Otherwise focus the one before the earliest deleted
                    nextLabelFocusIndex = minSelectedIndex_1 - 1;
                }
                // If we didn't select a new element, focus the autocomplete
                if (nextLabelFocusIndex === -1) {
                    _this.autocompleteRef.current.focus();
                }
                else {
                    // Otherwise set a timeout
                    _this.labelGroupRef.current.focusLabel(nextLabelFocusIndex);
                }
                selectedOrFocusedContents.forEach(function (content) { return _this.removeLabel(content); });
                _this.selectedLabelContents.removeAll();
            }
            else if (event.which === KeyCode.upArrow ||
                event.which === KeyCode.downArrow ||
                event.which === KeyCode.leftArrow ||
                event.which === KeyCode.rightArrow) {
                _this.selectedLabelContents.removeAll();
            }
        };
        _this.onLabelMouseDown = function (event, model, index) {
            _this.props.onLabelMouseDown && _this.props.onLabelMouseDown(event, model, index);
            if (event.isDefaultPrevented() || !_this.state.isInEditMode) {
                return;
            }
            var selectedContentSet = new Set(_this.selectedLabelContents.value);
            // Handle multiselect
            if (event.ctrlKey) {
                if (selectedContentSet.has(model.content)) {
                    _this.selectedLabelContents.removeAll(function (value) { return value === model.content; });
                }
                else {
                    _this.selectedLabelContents.push(model.content);
                }
            }
            else {
                // Single Select
                _this.selectedLabelContents.value = selectedContentSet.has(model.content) ? [] : [model.content];
            }
        };
        _this.onOuterMouseDown = function (event) {
            // If the inner container handled it, reset and ignore the event
            if (_this.isMouseDownEventHandled) {
                _this.isMouseDownEventHandled = false;
                return;
            }
            // Only go into edit mode if we're not already there
            if (!_this.state.isInEditMode) {
                // Don't deal with mouse-related focus, we'll manage it manually
                event.preventDefault();
                // Focus move here is only good if we didn't eat the event in _innerMouseDown
                // meaning the click was truly on the OUTER containers
                var callbackFunction = function () {
                    _this.renderTitleIconFlag.value = false;
                    _this.autocompleteRef.current.focus();
                };
                _this.setState({ isInEditMode: true }, callbackFunction);
            }
        };
        _this.onWrapperKeyDown = function (event) {
            if (event.which === KeyCode.escape) {
                _this.selectedLabelContents.removeAll();
                _this.autocompleteValue.value = "";
                _this.setState({ isInEditMode: false });
                _this.props.onBlur && _this.props.onBlur();
                event.preventDefault();
            }
        };
        _this.groupId = "editable-label-group-" + EditableLabelGroup.editableGroupCount;
        _this.state = {
            isInEditMode: false
        };
        return _this;
    }
    EditableLabelGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.addButtonText, addButtonText = _b === void 0 ? Resources.AddLabelButtonText : _b, className = _a.className, customColors = _a.customColors, _c = _a.disableColorPicker, disableColorPicker = _c === void 0 ? false : _c, _d = _a.disableMouseFocusOnLabels, disableMouseFocusOnLabels = _d === void 0 ? false : _d, duplicateLabelText = _a.duplicateLabelText, _e = _a.enableHoverStyles, enableHoverStyles = _e === void 0 ? true : _e, labelProps = _a.labelProps, onLabelClick = _a.onLabelClick, _f = _a.shrinkToContents, shrinkToContents = _f === void 0 ? false : _f, title = _a.title, _g = _a.useBlankZeroData, useBlankZeroData = _g === void 0 ? false : _g, _h = _a.watermark, watermark = _h === void 0 ? Resources.AddLabelWatermark : _h;
        var isInEditMode = this.state.isInEditMode;
        var editClassName = isInEditMode ? "edit" : "";
        var actualWrappingBehavior = isInEditMode ? WrappingBehavior.freeFlow : this.props.wrappingBehavior;
        var bodyContent;
        if (labelProps.length > 0 || isInEditMode) {
            bodyContent = (React.createElement("div", { className: css("bolt-labelgroup--editableWrapper", editClassName, !shrinkToContents && "default-padding"), onKeyDown: this.onWrapperKeyDown, onMouseDown: this.onInnerMouseDOwn },
                React.createElement(LabelGroup, __assign({ ref: this.labelGroupRef }, this.props, { className: undefined, id: getSafeId(this.groupId), onLabelMouseDown: this.onLabelMouseDown, onLabelKeyDown: this.onLabelKeyDown, onLabelClick: onLabelClick, selectedLabelContents: this.selectedLabelContents, title: undefined, disableMouseFocusOnLabels: disableMouseFocusOnLabels, enableHoverStyles: enableHoverStyles, wrappingBehavior: actualWrappingBehavior }), isInEditMode && (React.createElement(Autocomplete, { ref: this.autocompleteRef, suggestionProvider: this.onGetSuggestions, value: this.autocompleteValue, placeholder: watermark, onKeyDown: this.onInputKeyDown, onSubmit: this.onInputSubmit, onFocus: this.onAutocompleteFocus, onInputValueChange: this.onAutocompleteValueChange, customColors: customColors, onCheckForDuplicateInParent: this.onCheckForDuplicates, onDuplicateInParentText: duplicateLabelText, disableColorPicker: disableColorPicker, ariaDescribedBy: getSafeId(this.groupId) })))));
        }
        else if (!useBlankZeroData) {
            bodyContent = (React.createElement(Button, { className: "bolt-labelgroup-addButton", text: addButtonText, iconProps: { iconName: "Add" }, onClick: this.onAddButtonClicked }));
        }
        else {
            // If we have zero data and are using the blank one, render nothing at all
            return null;
        }
        return (React.createElement("div", { className: css(className, "bolt-labelgroup-editable flex-column", editClassName), onFocus: this.onFocus, onBlur: this.onBlur, onMouseDown: this.onOuterMouseDown, onMouseEnter: function () { return (_this.renderTitleIconFlag.value = isInEditMode ? false : true); }, onMouseLeave: function () { return (_this.renderTitleIconFlag.value = false); } },
            title && (React.createElement(Observer, { renderIconFlag: this.renderTitleIconFlag }, function (observerProps) { return (React.createElement("div", { className: "bolt-labelgroup-title-wrapper body-m flex-row" },
                React.createElement("div", { className: "bolt-labelgroup-title-content" }, title),
                observerProps.renderIconFlag && React.createElement(Icon, { iconName: "Edit" }))); })),
            bodyContent));
    };
    EditableLabelGroup.prototype.componentWillUnmount = function () {
        // Niche race condition, but let's not setstate on an unmounted component
        clearTimeout(this.focusOutTimeoutId);
    };
    EditableLabelGroup.prototype.focus = function () {
        var _this = this;
        this.setState({ isInEditMode: true }, function () { return _this.autocompleteRef.current && _this.autocompleteRef.current.focus(); });
    };
    EditableLabelGroup.prototype.removeLabel = function (content) {
        this.props.onLabelRemove &&
            this.props.onLabelRemove(ObservableLike.getValue(this.props.labelProps).find(function (testModel) { return testModel.content === content; }));
        this.selectedLabelContents.removeAll(function (x) { return x === content; });
    };
    EditableLabelGroup.editableGroupCount = 0;
    return EditableLabelGroup;
}(React.Component));
export { EditableLabelGroup };
