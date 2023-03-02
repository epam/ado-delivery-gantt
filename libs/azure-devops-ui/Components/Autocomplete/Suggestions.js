import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Autocomplete.css";
import * as React from "react";
import * as Resources from '../../Resources.Label';
import { css, getSafeId } from '../../Util';
import { Spinner, SpinnerSize } from '../../Spinner';
import { Label } from "../Label/Label";
import { ColorPip, ColorSwatchPicker } from '../../Color';
import { Icon } from '../../Icon';
var Suggestions = /** @class */ (function (_super) {
    __extends(Suggestions, _super);
    function Suggestions(props) {
        var _this = _super.call(this, props) || this;
        _this.currentSelectedElementRef = React.createRef();
        _this.onHoverNewRowEnd = function () {
            _this.setState({
                isNewRowHovered: false
            });
        };
        _this.onHoverNewRowStart = function () {
            _this.setState({
                isNewRowHovered: true
            });
        };
        _this.onRenderAlreadyIncludedRow = function () {
            var _a = _this.props.inputAlreadyInGroupText, inputAlreadyInGroupText = _a === void 0 ? Resources.LabelInGroup : _a;
            return (React.createElement("div", { className: "bolt-label-suggestions-row flex-row", key: "included" },
                React.createElement(Icon, { className: "bolt-label-suggestions-icon", iconName: "CheckMark" }),
                React.createElement("div", { className: "bolt-label-suggestions-row--content" }, inputAlreadyInGroupText)));
        };
        _this.onRenderLoadingRow = function () {
            return (React.createElement("div", { className: "bolt-label-suggestions-loading-row", key: "loading" },
                React.createElement(Spinner, { size: SpinnerSize.small, label: Resources.LoadingSuggestions })));
        };
        _this.onRenderNewLabelRow = function (colors) {
            var content;
            if (_this.shouldDisplayColorPicker()) {
                content = (React.createElement(ColorSwatchPicker, { className: css(_this.isNewRowSelected() && "selected"), colors: colors, onPipClick: _this.props.onColorPipClick, selectedIndex: _this.props.currentSelectedColorIndex }));
            }
            else {
                content = (React.createElement("div", { className: css("bolt-label-suggestions-row clickable flex-row", _this.isNewRowSelected() && "selected"), onClick: _this.props.onNewLabelClick, role: "option", tabIndex: -1 },
                    React.createElement(ColorPip, { color: _this.props.disableColorPicker && Label.DEFAULT_COLOR }),
                    React.createElement("div", { className: "bolt-label-suggestions-row--content" }, Resources.NewLabelSuggestionText)));
            }
            return (React.createElement("div", { className: "bolt-label-suggestions-newRow-wrapper", key: "newRow", onMouseEnter: _this.onHoverNewRowStart, onMouseLeave: _this.onHoverNewRowEnd }, content));
        };
        _this.onRenderSuggestionRow = function (labelModel, index) {
            var isSelected = _this.props.currentSelectedIndex === index;
            return (React.createElement("div", { "aria-selected": isSelected, className: css("bolt-label-suggestions-row clickable flex-row", isSelected && "selected"), id: getSafeId(labelModel.content), key: labelModel.content, onClick: function (event) { return _this.props.onSuggestionClick(event, labelModel); }, ref: isSelected && _this.currentSelectedElementRef, role: "option", tabIndex: -1 },
                React.createElement(ColorPip, { color: labelModel.color }),
                React.createElement("div", { className: "bolt-label-suggestions-row--content" },
                    React.createElement("span", null, labelModel.content))));
        };
        _this.state = {
            isNewRowHovered: false
        };
        return _this;
    }
    Suggestions.prototype.render = function () {
        var _a = this.props, isCurrentInputAlreadyInGroup = _a.isCurrentInputAlreadyInGroup, isLoading = _a.isLoading, onCheckForExactMatch = _a.onCheckForExactMatch, suggestedItems = _a.suggestedItems, swatchPickerColors = _a.swatchPickerColors;
        var minWidth = swatchPickerColors.length * 32;
        // Determine items to render
        var calloutItems = [];
        var renderLoadingRow = isLoading;
        var renderIncludedRow = isCurrentInputAlreadyInGroup;
        var renderNewLabelRow = !renderIncludedRow && (onCheckForExactMatch === undefined || !onCheckForExactMatch(suggestedItems));
        if (renderLoadingRow) {
            calloutItems.push(this.onRenderLoadingRow());
        }
        suggestedItems.length > 0 &&
            calloutItems.push(React.createElement("div", { className: "bolt-label-suggestions-list", key: "suggestions" }, suggestedItems.map(this.onRenderSuggestionRow)));
        if (renderIncludedRow) {
            calloutItems.push(this.onRenderAlreadyIncludedRow());
        }
        if (renderNewLabelRow) {
            calloutItems.push(this.onRenderNewLabelRow(swatchPickerColors));
        }
        // Interleave separators as necessary
        var calloutContents = [];
        calloutItems.forEach(function (element, index) {
            index !== 0 && calloutContents.push(React.createElement("div", { className: "bolt-suggestions-separator", key: "separator" + index }));
            calloutContents.push(element);
        });
        return (React.createElement("div", { className: "bolt-label-suggestions-container flex-column", id: getSafeId("autocomplete-listbox"), role: "listbox", style: { minWidth: minWidth } }, calloutContents));
    };
    Suggestions.prototype.componentDidUpdate = function () {
        if (this.currentSelectedElementRef.current && this.currentSelectedElementRef.current !== this.previousSelectedElement) {
            this.currentSelectedElementRef.current.scrollIntoView(false);
            this.previousSelectedElement = this.currentSelectedElementRef.current;
        }
    };
    Suggestions.prototype.isNewRowSelected = function () {
        return this.props.currentSelectedIndex === this.props.suggestedItems.length;
    };
    Suggestions.prototype.shouldDisplayColorPicker = function () {
        var _a = this.props.disableColorPicker, disableColorPicker = _a === void 0 ? false : _a;
        return !disableColorPicker && (this.isNewRowSelected() || this.state.isNewRowHovered);
    };
    return Suggestions;
}(React.Component));
export { Suggestions };
