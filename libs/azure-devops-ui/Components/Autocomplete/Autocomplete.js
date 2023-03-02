import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Autocomplete.css";
import * as React from "react";
import { ObservableValue, ObservableLike } from '../../Core/Observable';
import { Callout } from '../../Callout';
import { Label } from "../Label/Label";
import { KeyCode, getSafeId } from '../../Util';
import { Suggestions } from "./Suggestions";
import { Location } from '../../Utilities/Position';
import { FocusZoneContext } from '../../FocusZone';
var Autocomplete = /** @class */ (function (_super) {
    __extends(Autocomplete, _super);
    function Autocomplete(props) {
        var _this = _super.call(this, props) || this;
        _this.currentSelectedColorIndex = new ObservableValue(0);
        _this.inputRef = React.createRef();
        _this.onBlur = function (event) {
            _this.setState({
                displayPlaceholderText: false
            });
        };
        _this.onCheckForExactSuggestionMatches = function (suggestions) {
            return suggestions.findIndex(function (testSuggestion) { return testSuggestion.content === ObservableLike.getValue(_this.props.value); }) != -1;
        };
        _this.onFocus = function (event) {
            _this.props.onFocus && _this.props.onFocus(event);
            _this.setState({
                displayPlaceholderText: true
            });
        };
        _this.onInputChange = function (event) {
            _this.props.onInputValueChange(event.currentTarget.value);
        };
        _this.onKeyDown = function (event) {
            _this.props.onKeyDown && _this.props.onKeyDown(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            var currentInputValue = ObservableLike.getValue(_this.props.value);
            var isCurrentValueInParentGroup = _this.props.onCheckForDuplicateInParent(currentInputValue);
            var currentSuggestion = _this.state.currentSuggestions[_this.state.currentSuggestionIndex];
            // Handle selection in the callout, and tab-complete
            if (_this.state.displayCallout) {
                if (event.which === KeyCode.tab && currentSuggestion) {
                    _this.props.onInputValueChange(currentSuggestion.content);
                    event.preventDefault();
                }
                else if (event.which === KeyCode.downArrow) {
                    // Determine if the New Label row is currently selectable and adjust upper bound accordingly
                    // Then wraparound
                    var upperBound = isCurrentValueInParentGroup ? _this.state.currentSuggestions.length - 1 : _this.state.currentSuggestions.length;
                    var targetIndex = _this.state.currentSuggestionIndex + 1;
                    _this.setState({
                        currentSuggestionIndex: targetIndex > upperBound ? 0 : targetIndex
                    });
                    event.preventDefault();
                }
                else if (event.which === KeyCode.upArrow) {
                    // Determine if the New Label row is currently selectable and adjust wrap-around value accordingly
                    // Then wraparound
                    var finalIndex = isCurrentValueInParentGroup ? _this.state.currentSuggestions.length - 1 : _this.state.currentSuggestions.length;
                    var targetIndex = _this.state.currentSuggestionIndex - 1;
                    _this.setState({
                        currentSuggestionIndex: targetIndex < 0 ? finalIndex : targetIndex
                    });
                    event.preventDefault();
                }
                else if (isCurrentValueInParentGroup) {
                    // Short circuit interaction with New Label row if we're rendering the "already in the group" row
                    return;
                }
                else if (event.which === KeyCode.rightArrow && _this.isNewRowSelected()) {
                    _this.currentSelectedColorIndex.value = Math.min(_this.currentSelectedColorIndex.value + 1, Autocomplete.DEFAULT_COLORS.length - 1);
                    event.preventDefault();
                }
                else if (event.which === KeyCode.leftArrow && _this.isNewRowSelected()) {
                    _this.currentSelectedColorIndex.value = Math.max(_this.currentSelectedColorIndex.value - 1, 0);
                    event.preventDefault();
                }
            }
            // Handle submittal
            var trimmedInputValue = currentInputValue.trim();
            var canBeSubmitted = trimmedInputValue !== "" && _this.props.onSubmit && !isCurrentValueInParentGroup;
            if (event.which === KeyCode.enter && canBeSubmitted) {
                if (currentSuggestion) {
                    _this.submit(currentSuggestion);
                }
                else {
                    _this.submit({
                        content: trimmedInputValue,
                        color: !_this.props.disableColorPicker && Autocomplete.DEFAULT_COLORS[_this.currentSelectedColorIndex.value]
                    });
                }
            }
            else if (event.which === KeyCode.comma) {
                if (canBeSubmitted) {
                    _this.submit({
                        content: trimmedInputValue,
                        color: !_this.props.disableColorPicker && Autocomplete.DEFAULT_COLORS[_this.currentSelectedColorIndex.value]
                    });
                }
                event.preventDefault();
            }
        };
        _this.onPipClick = function (event, color, index) {
            _this.props.onSubmit &&
                _this.props.onSubmit({
                    content: ObservableLike.getValue(_this.props.value),
                    color: color
                });
        };
        _this.onNewLabelClick = function (event) {
            _this.props.onSubmit &&
                _this.props.onSubmit({
                    content: ObservableLike.getValue(_this.props.value)
                });
        };
        _this.onSuggestionClick = function (event, labelModel) {
            _this.submit(labelModel);
        };
        _this.onValueChange = function (newValue) {
            // ALWAYS reset the loading delay
            clearTimeout(_this.loadingDelayTimeoutId);
            if (newValue.trim() === "") {
                // Clear suggestions and hide callout if we erase the whole thing
                _this.setState({
                    displayCallout: false,
                    currentSuggestions: []
                });
            }
            else {
                // Handle Loading timeout logic w/ 200ms delay if the callout isn't up
                // Otherwise change state immediately, unless promise resolves and clears the timeout
                var setStateFunction_1 = function () { return _this.setState({ isLoading: true, displayCallout: true }); };
                if (_this.state.displayCallout) {
                    setStateFunction_1();
                }
                else {
                    _this.loadingDelayTimeoutId = setTimeout(function () {
                        setStateFunction_1();
                    }, 200);
                }
                _this.props.suggestionProvider(newValue).then(function (suggestions) {
                    // Ensure these suggestions aren't outdated
                    if (newValue !== ObservableLike.getValue(_this.props.value)) {
                        return;
                    }
                    // Stop displaying loading timeout
                    clearTimeout(_this.loadingDelayTimeoutId);
                    _this.setState({
                        currentSuggestions: suggestions,
                        isLoading: false,
                        displayCallout: true,
                        displayTypeAhead: true
                    });
                });
            }
            // Never show typeahead when the value changes; wait for suggestions to load
            // Clear suggested item; they need to tab back into the thing
            _this.setState({
                displayTypeAhead: false,
                currentSuggestionIndex: 0,
                currentSuggestions: []
            });
        };
        _this.state = {
            currentSuggestionIndex: 0,
            currentSuggestions: [],
            displayCallout: false,
            displayPlaceholderText: false,
            displayTypeAhead: false,
            isLoading: false
        };
        return _this;
    }
    Autocomplete.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaDescribedBy = _a.ariaDescribedBy, className = _a.className, customColors = _a.customColors, _b = _a.disableColorPicker, disableColorPicker = _b === void 0 ? false : _b, onCheckForDuplicateInParent = _a.onCheckForDuplicateInParent, onDuplicateInParentText = _a.onDuplicateInParentText, placeholder = _a.placeholder, value = _a.value;
        var _c = this.state, currentSuggestions = _c.currentSuggestions, currentSuggestionIndex = _c.currentSuggestionIndex, displayCallout = _c.displayCallout, isLoading = _c.isLoading, displayTypeAhead = _c.displayTypeAhead, displayPlaceholderText = _c.displayPlaceholderText;
        var inputValue = ObservableLike.getValue(value);
        var suggestionValue = currentSuggestions[currentSuggestionIndex] ? currentSuggestions[currentSuggestionIndex].content : "";
        var typeAhead = this.getTypeAheadValue(inputValue, suggestionValue, displayTypeAhead);
        var renderColors = customColors || Autocomplete.DEFAULT_COLORS;
        var selectedSuggestion = this.state.currentSuggestions[this.state.currentSuggestionIndex];
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement("div", { "aria-expanded": displayCallout, "aria-haspopup": "listbox", "aria-owns": getSafeId("autocomplete-listbox"), className: "bolt-label-autocomplete", role: "combobox" },
            React.createElement("input", { "aria-activedescendant": displayCallout && selectedSuggestion && selectedSuggestion.content, "aria-autocomplete": "both", "aria-controls": getSafeId("autocomplete-listbox"), "aria-describedby": getSafeId(ariaDescribedBy), className: className, "data-focuszone": zoneContext.focuszoneId, onBlur: _this.onBlur, onChange: _this.onInputChange, onFocus: _this.onFocus, onKeyDown: _this.onKeyDown, placeholder: displayPlaceholderText ? placeholder : undefined, ref: _this.inputRef, tabIndex: 0, type: "text", value: inputValue }),
            React.createElement("input", { type: "text", className: "suggestion", value: typeAhead, disabled: true }),
            displayCallout && (React.createElement(Callout, { anchorElement: _this.inputRef.current, anchorOffset: { horizontal: 0, vertical: 10 }, anchorOrigin: { horizontal: Location.start, vertical: Location.end }, calloutOrigin: { horizontal: Location.start, vertical: Location.start }, className: "bolt-label-suggestions-callout", contentShadow: true },
                React.createElement(Suggestions, { currentSelectedColorIndex: _this.currentSelectedColorIndex, currentSelectedIndex: currentSuggestionIndex, disableColorPicker: disableColorPicker, inputAlreadyInGroupText: onDuplicateInParentText, isCurrentInputAlreadyInGroup: onCheckForDuplicateInParent(inputValue), isLoading: isLoading, onCheckForExactMatch: _this.onCheckForExactSuggestionMatches, onColorPipClick: _this.onPipClick, onNewLabelClick: _this.onNewLabelClick, onSuggestionClick: _this.onSuggestionClick, suggestedItems: currentSuggestions, swatchPickerColors: renderColors }))))); }));
    };
    // Dealing with observable lifecycles
    Autocomplete.prototype.componentDidMount = function () {
        ObservableLike.subscribe(this.props.value, this.onValueChange);
    };
    Autocomplete.prototype.componentWillUnmount = function () {
        // Don't call setState if we're unmounted
        clearTimeout(this.loadingDelayTimeoutId);
        ObservableLike.unsubscribe(this.props.value, this.onValueChange);
    };
    Autocomplete.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        ObservableLike.unsubscribe(this.props.value, this.onValueChange);
        ObservableLike.subscribe(nextProps.value, this.onValueChange);
    };
    Autocomplete.prototype.focus = function () {
        this.inputRef.current.focus();
    };
    Autocomplete.prototype.getTypeAheadValue = function (inputValue, suggestionValue, displayTypeAhead) {
        if (!displayTypeAhead) {
            return "";
        }
        return inputValue.concat(suggestionValue.substr(inputValue.length));
    };
    Autocomplete.prototype.isNewRowSelected = function () {
        return this.state.currentSuggestionIndex === this.state.currentSuggestions.length && ObservableLike.getValue(this.props.value) != "";
    };
    Autocomplete.prototype.submit = function (labelModel) {
        this.props.onSubmit && this.props.onSubmit(labelModel);
        clearTimeout(this.loadingDelayTimeoutId);
        this.currentSelectedColorIndex.value = 0;
        this.setState({ currentSuggestions: [] });
    };
    Autocomplete.DEFAULT_COLORS = [
        Label.DEFAULT_COLOR,
        { red: 255, green: 255, blue: 0 },
        { red: 235, green: 257, blue: 128 },
        { red: 229, green: 150, blue: 182 },
        { red: 191, green: 165, blue: 221 },
        { red: 168, green: 191, blue: 243 },
        { red: 153, green: 207, blue: 198 } // Green
    ];
    return Autocomplete;
}(React.Component));
export { Autocomplete };
