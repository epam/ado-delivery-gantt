import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./SuggestionsList.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { FocusWithin } from '../../FocusWithin';
import { Observer } from '../../Observer';
import { Spinner } from '../../Spinner';
import { css, getSafeId, preventDefault } from '../../Util';
var SuggestionsItem = /** @class */ (function (_super) {
    __extends(SuggestionsItem, _super);
    function SuggestionsItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onSuggestionClicked = function (ev) {
            if (!ev.isDefaultPrevented()) {
                _this.props.onClick(_this.props);
                ev.preventDefault();
            }
        };
        return _this;
    }
    SuggestionsItem.prototype.render = function () {
        var _a = this.props, renderSuggestion = _a.renderSuggestion, className = _a.className, isSelected = _a.isSelected;
        return (React.createElement("div", { className: css(className, "bolt-suggestions-item flex-row flex-grow cursor-pointer scroll-hidden", isSelected && "bolt-suggestions-isSuggested") },
            React.createElement("div", { onMouseDown: preventDefault, onClick: this.onSuggestionClicked, className: "bolt-suggestions-item-button flex-row flex-grow scroll-hidden" }, renderSuggestion(this.props))));
    };
    return SuggestionsItem;
}(React.Component));
export { SuggestionsItem };
var SuggestionsList = /** @class */ (function (_super) {
    __extends(SuggestionsList, _super);
    function SuggestionsList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scrollableRegion = React.createRef();
        _this.selectedElement = React.createRef();
        _this.onBlur = function () {
            _this.props.onBlur && _this.props.onBlur();
        };
        _this.onFocus = function (event) {
            _this.props.onFocus && _this.props.onFocus(event);
        };
        return _this;
    }
    SuggestionsList.prototype.render = function () {
        var _a = this.props, className = _a.className, loadingText = _a.loadingText, renderNoResultFound = _a.renderNoResultFound;
        var suggestions = ObservableLike.getValue(this.props.suggestions);
        var isLoading = ObservableLike.getValue(this.props.isLoading);
        // MostRecently Used text should supercede the header text if it's there and available.
        var hasNoSuggestions = (!suggestions || !suggestions.length) && !isLoading;
        return (React.createElement("div", { className: css(className, "bolt-suggestions flex-row flex-grow"), id: getSafeId("suggestions-list"), style: this.props.width && { width: this.props.width } },
            isLoading ? (React.createElement(Spinner, { className: "bolt-suggestions-spinner flex-grow flex-center justify-center", id: "suggestions-spinner", label: loadingText })) : (!hasNoSuggestions && this.renderSuggestions()),
            React.createElement("div", { className: css("bolt-suggestions-none-region", !hasNoSuggestions ? "has-suggestions" : "flex-row flex-grow"), id: getSafeId("sug-list-no-results"), role: "alert" }, hasNoSuggestions && (renderNoResultFound ? renderNoResultFound() : this.noResults())),
            React.createElement("div", { "aria-label": loadingText || "Loading", id: getSafeId("sug-list-transition"), role: "text" })));
    };
    SuggestionsList.prototype.componentDidMount = function () {
        this.scrollSelected();
    };
    SuggestionsList.prototype.componentDidUpdate = function () {
        // Scroll to selected element only in case if selected element changed.
        // Otherwise mouse scroll won't work as it doesn't change selected element.
        if (this.selectedElement.current && this.currentSelectedElement !== this.selectedElement.current) {
            this.scrollSelected();
        }
    };
    SuggestionsList.prototype.noResults = function () {
        var noResultsFoundText = this.props.noResultsFoundText;
        return noResultsFoundText ? React.createElement("div", { className: "bolt-suggestions-none flex-row flex-grow flex-center" }, noResultsFoundText) : null;
    };
    SuggestionsList.prototype.renderSuggestions = function () {
        var _this = this;
        var _a = this.props, createDefaultItem = _a.createDefaultItem, renderSuggestion = _a.renderSuggestion, onSuggestionClicked = _a.onSuggestionClicked, suggestionsItemClassName = _a.suggestionsItemClassName, resultsMaximumNumber = _a.resultsMaximumNumber, selectedIndex = _a.selectedIndex, suggestions = _a.suggestions, suggestionsContainerAriaLabel = _a.suggestionsContainerAriaLabel, width = _a.width;
        return (React.createElement(FocusWithin, { onBlur: this.onBlur, onFocus: this.onFocus }, function (focusStatus) {
            return (React.createElement(Observer, { suggestions: suggestions, selectedIndex: selectedIndex }, function (props) {
                if (resultsMaximumNumber) {
                    props.suggestions = props.suggestions.slice(0, resultsMaximumNumber);
                }
                var sugList = props.suggestions;
                createDefaultItem && sugList.unshift(createDefaultItem(sugList));
                return (React.createElement("div", { "aria-label": suggestionsContainerAriaLabel, className: "bolt-suggestions-container flex-column flex-grow v-scroll-auto h-scroll-hidden", id: getSafeId("suggestion-list"), ref: _this.scrollableRegion, role: "listbox", style: width && { width: width } },
                    React.createElement("div", { className: "bolt-suggestion-spacer", onMouseDown: preventDefault }),
                    props.suggestions.map(function (suggestion, index) {
                        var isSuggested = index === props.selectedIndex;
                        return (React.createElement("div", { className: "flex-noshrink", key: getSafeId("sug-" + index), id: getSafeId("sug-row-" + index), ref: isSuggested ? _this.selectedElement : "", role: "option" },
                            React.createElement(SuggestionsItem, { className: suggestionsItemClassName, id: getSafeId("sug-item" + index), index: index, isSelected: isSuggested, item: suggestion, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, onClick: onSuggestionClicked, renderSuggestion: renderSuggestion })));
                    }),
                    React.createElement("div", { className: "bolt-suggestion-spacer", onMouseDown: preventDefault })));
            }));
        }));
    };
    SuggestionsList.prototype.scrollSelected = function () {
        var _a, _b;
        this.currentSelectedElement = (_a = this.selectedElement) === null || _a === void 0 ? void 0 : _a.current;
        if (this.scrollableRegion.current && ((_b = this.selectedElement) === null || _b === void 0 ? void 0 : _b.current)) {
            // IE11 messes up when scrollIntoView is called in the callout.
            this.scrollableRegion.current.scrollTop = this.selectedElement.current.offsetTop;
        }
    };
    return SuggestionsList;
}(React.Component));
export { SuggestionsList };
