import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerDropdown.css";
import * as React from "react";
import * as Resources from '../../Resources.IdentityPicker';
import { FocusWithin } from '../../FocusWithin';
import { makeCancelable } from '../../Core/Util/Promise';
import { Icon, IconSize } from '../../Icon';
import { KeyCode, css } from '../../Util';
import { ObservableArray, ObservableLike, ObservableValue } from '../../Core/Observable';
import { Persona, PersonaSize } from '../../Persona';
import { IdentityPickerSuggestionItem } from "../IdentityPickerSuggestionsList/IdentityPickerSuggestionItem";
import { IdentityPickerSuggestionsList } from "../IdentityPickerSuggestionsList/IdentityPickerSuggestionsList";
import { Location } from '../../Utilities/Position';
import { Measure } from '../../Measure';
import { Observer } from '../../Observer';
import { TextField } from '../../TextField';
import { TimerManagement } from '../../Core/TimerManagement';
import { format } from '../../Core/Util/String';
import { shouldShowIdentityCard } from "./IdentityPickerUtils";
var textFieldId = 1;
var CustomIdentityPickerDropdown = /** @class */ (function (_super) {
    __extends(CustomIdentityPickerDropdown, _super);
    function CustomIdentityPickerDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.focusWithin = React.createRef();
        _this.inputElement = React.createRef();
        _this.itemRefs = {};
        _this.openedIdentityCard = new ObservableValue(undefined);
        _this.outerElement = React.createRef();
        _this.suggestionsLoading = new ObservableValue(false);
        _this.isEditing = new ObservableValue(false);
        _this.selectedIndex = new ObservableValue(-1);
        _this.suggestions = new ObservableArray([]);
        _this.textFieldId = "identity-picker-downdown-textfield-" + textFieldId++;
        _this.onPickerDismiss = function () {
            _this.props.onSuggestionsVisibleChanged(false);
        };
        _this.renderSuggestionItem = function (suggestion) {
            return (React.createElement("div", { className: "flex-row flex-grow scroll-hidden", onKeyDown: _this.onKeyDownSuggestionItem },
                React.createElement(IdentityPickerSuggestionItem, __assign({}, suggestion, { onOpenPersonaCard: _this.openPersonaCard, ref: function (itemRef) { return (_this.itemRefs[suggestion.item.entityId] = itemRef); }, renderSuggestion: _this.props.renderCustomIdentitySuggestion && _this.renderCustomSuggestionItem }))));
        };
        _this.renderCustomSuggestionItem = function (suggestion) {
            return _this.props.renderCustomIdentitySuggestion && _this.props.renderCustomIdentitySuggestion(suggestion.item);
        };
        _this.renderPersonaCoin = function (className) {
            return (React.createElement(Observer, { selectedIdentity: _this.props.value, isEditing: _this.isEditing }, function (props) {
                return props.selectedIdentity && !props.isEditing ? (React.createElement(Persona, { className: css("flex-row flex-center justify-center", className), identity: props.selectedIdentity, size: PersonaSize.size24 })) : (React.createElement(Icon, { className: css("flex-row flex-center justify-center", className), iconName: "Contact", size: IconSize.medium }));
            }));
        };
        _this.openPersonaCard = function (identity) {
            if (shouldShowIdentityCard(identity)) {
                _this.openedIdentityCard.value = identity;
            }
        };
        _this.closePersonaCard = function () {
            _this.openedIdentityCard.value = undefined;
            if (_this.inputElement.current) {
                _this.inputElement.current.focus();
                var suggestionsVisible = ObservableLike.getValue(_this.props.suggestionsVisible);
                if (!suggestionsVisible) {
                    _this.props.onSuggestionsVisibleChanged(true);
                }
            }
        };
        _this.completeSuggestion = function () {
            var selectedIdentity;
            if (_this.suggestions.value.length > 0 && ObservableLike.getValue(_this.props.suggestionsVisible) && _this.selectedIndex.value !== -1) {
                selectedIdentity = _this.suggestions.value[_this.selectedIndex.value];
            }
            else {
                _this.selectedIndex.value = -1;
                selectedIdentity =
                    _this.props.resolveUnrecognizedIdentity && _this.props.resolveUnrecognizedIdentity(ObservableLike.getValue(_this.props.textValue));
            }
            _this.selectedPersonaChanged(selectedIdentity);
            if (selectedIdentity) {
                _this.props.onSuggestionsVisibleChanged(false);
            }
            return Boolean(selectedIdentity);
        };
        _this.onBlur = function () {
            _this.props.onSuggestionsVisibleChanged(false);
            if (!_this.openedIdentityCard.value) {
                ObservableLike.getValue(_this.props.textValue) === "" && _this.selectedPersonaChanged();
                _this.props.onBlur && _this.props.onBlur();
            }
        };
        _this.onClearClicked = function (ev) {
            _this.clear();
            ev.preventDefault();
        };
        _this.onClearKeyDown = function (ev) {
            if (ev.which === KeyCode.enter) {
                _this.clear();
                ev.preventDefault();
            }
        };
        _this.clear = function () {
            var _a;
            _this.props.onClear && _this.props.onClear();
            _this.props.onChange(undefined);
            _this.lastPickedIdentity = undefined;
            _this.suggestions.value = [];
            (_a = _this.inputElement.current) === null || _a === void 0 ? void 0 : _a.focus();
        };
        _this.onClick = function () {
            if ((ObservableLike.getValue(_this.props.textValue) === "" && _this.props.pickerProvider.onEmptyInputFocus) ||
                (ObservableLike.getValue(_this.props.value) && _this.suggestions.length === 0)) {
                _this.updateSuggestionsList(_this.props.pickerProvider.onEmptyInputFocus());
                _this.props.onSuggestionsVisibleChanged(!ObservableLike.getValue(_this.props.suggestionsVisible));
            }
            else {
                _this.props.onSuggestionsVisibleChanged(!ObservableLike.getValue(_this.props.suggestionsVisible));
            }
            _this.inputElement.current.select();
        };
        _this.onFocus = function (e) {
            var onFocus = _this.props.onFocus;
            if (ObservableLike.getValue(_this.props.textValue) === "" &&
                _this.props.pickerProvider.onEmptyInputFocus &&
                !ObservableLike.getValue(_this.props.suggestionsVisible)) {
                _this.updateSuggestionsList(_this.props.pickerProvider.onEmptyInputFocus());
            }
            if (onFocus) {
                onFocus(e);
            }
        };
        _this.onKeyDown = function (ev) {
            if (ev.isDefaultPrevented()) {
                return;
            }
            var keyCode = ev.which;
            var suggestionsVisible = ObservableLike.getValue(_this.props.suggestionsVisible);
            var input = _this.inputElement.current && _this.inputElement.current.inputElement.current;
            switch (keyCode) {
                case KeyCode.escape:
                    if (_this.openedIdentityCard.value) {
                        !(_this.suggestions.value && _this.suggestions.value[_this.selectedIndex.value]) && _this.selectedPersonaChanged();
                    }
                    if (suggestionsVisible) {
                        _this.props.onSuggestionsVisibleChanged(false);
                        _this.openedIdentityCard.value = undefined;
                    }
                    break;
                case KeyCode.tab:
                case KeyCode.enter:
                    if (!ev.shiftKey && suggestionsVisible) {
                        if (_this.completeSuggestion()) {
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                    }
                    else if (suggestionsVisible) {
                        _this.completeSuggestion();
                    }
                    else if (keyCode === KeyCode.enter && input && !input.value) {
                        // Enter on an empty input element should behave the same as the clear button
                        _this.selectedPersonaChanged(undefined);
                    }
                    break;
                case KeyCode.rightArrow:
                    if (_this.suggestions.value &&
                        _this.suggestions.value[_this.selectedIndex.value] &&
                        input &&
                        input.value.length === input.selectionEnd) {
                        _this.focusContactCardButton(_this.suggestions.value[_this.selectedIndex.value]);
                        ev.preventDefault();
                    }
                    break;
                case KeyCode.upArrow:
                    if (suggestionsVisible && _this.suggestions.value) {
                        _this.selectedIndex.value = Math.max(0, _this.selectedIndex.value - 1);
                        _this.forceUpdate();
                        ev.preventDefault();
                        ev.stopPropagation();
                    }
                    break;
                case KeyCode.downArrow:
                    if (suggestionsVisible && _this.suggestions.value) {
                        _this.selectedIndex.value = Math.min(_this.suggestions.value.length - 1, _this.selectedIndex.value + 1);
                        _this.forceUpdate();
                        ev.preventDefault();
                        ev.stopPropagation();
                    }
                    else {
                        _this.props.onSuggestionsVisibleChanged(true);
                    }
                    break;
            }
        };
        _this.onKeyDownSuggestionItem = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.leftArrow || event.which === KeyCode.escape || event.which === KeyCode.tab) {
                    if (_this.inputElement.current) {
                        _this.inputElement.current.focus();
                        event.preventDefault();
                    }
                }
            }
        };
        _this.focusContactCardButton = function (tag) {
            if (_this.itemRefs[tag.entityId]) {
                _this.itemRefs[tag.entityId].focus();
            }
        };
        _this.onResolveSuggestions = function (updatedValue) {
            var suggestions = _this.props.pickerProvider.onFilterIdentities(updatedValue.toLocaleLowerCase(), []);
            if (suggestions !== null) {
                _this.updateSuggestionsList(suggestions, updatedValue);
            }
        };
        _this.onSearchChange = function (event, value) {
            if (value.length == 0) {
                var onClear = _this.props.onClear;
                onClear && onClear();
            }
            _this.selectedIndex.value = -1;
            _this.isEditing.value = true;
            _this.props.onInputChange(value);
            _this.updateValue(value);
        };
        _this.onSuggestionClick = function (suggestion) {
            _this.selectedIndex.value = suggestion.index;
            _this.selectedPersonaChanged(suggestion.item);
            _this.props.onSuggestionsVisibleChanged(false);
        };
        _this.onTextFieldChanged = function (newWidth, newHeight) {
            _this.setState({ width: Math.max(newWidth, 296) });
        };
        _this.selectedPersonaChanged = function (persona) {
            if (_this.lastPickedIdentity !== persona) {
                !!persona && !!_this.props.pickerProvider.addIdentitiesToMRU && _this.props.pickerProvider.addIdentitiesToMRU([persona]);
            }
            if (_this.props.onChange(persona) !== false) {
                _this.props.onInputChange(persona ? persona.displayName : "");
                _this.lastPickedIdentity = persona;
            }
            else {
                _this.props.onInputChange("");
                _this.props.onChange(undefined);
                _this.lastPickedIdentity = undefined;
            }
            _this.isEditing.value = false;
        };
        _this.updateValue = function (updatedValue) {
            _this.props.onSuggestionsVisibleChanged(!!updatedValue);
            if (_this.cachedResults[updatedValue]) {
                _this.updateSuggestionsList(_this.cachedResults[updatedValue], updatedValue);
            }
            else {
                _this.onResolveSuggestions(updatedValue);
            }
        };
        _this.cachedResults = {};
        _this.timerManagement = new TimerManagement();
        _this.lastPickedIdentity = ObservableLike.getValue(props.value);
        _this.state = { width: 296 };
        return _this;
    }
    CustomIdentityPickerDropdown.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, autoFocus = _a.autoFocus, disabled = _a.disabled, _b = _a.editPlaceholder, editPlaceholder = _b === void 0 ? Resources.IdentityPickerPlaceholderFocusText : _b, _c = _a.placeholder, placeholder = _c === void 0 ? Resources.IdentityPickerPlaceholderText : _c, required = _a.required;
        return (React.createElement(Observer, { suggestionsVisible: this.props.suggestionsVisible }, function (topProps) {
            return (React.createElement(FocusWithin, { onBlur: _this.onBlur, onFocus: _this.onFocus, ref: _this.focusWithin }, function (focusStatus) {
                return (React.createElement(React.Fragment, null,
                    React.createElement(Observer, { selectedIdentity: _this.props.value, selectedIndex: _this.selectedIndex, suggestionsLoading: _this.suggestionsLoading, textValue: _this.props.textValue }, function (props) {
                        var _a;
                        var ariaActiveDescendantId;
                        if (topProps.suggestionsVisible) {
                            if (props.selectedIndex === -1 || props.suggestionsLoading) {
                                ariaActiveDescendantId = "sug-list-transition";
                            }
                            else if (!_this.suggestions || !_this.suggestions.length) {
                                ariaActiveDescendantId = "sug-list-no-results";
                            }
                            else {
                                ariaActiveDescendantId = "sug-row-" + props.selectedIndex;
                            }
                        }
                        var ariaControlsId = topProps.suggestionsVisible ? "tag-picker-callout" : undefined;
                        var placeholderText = !focusStatus.hasFocus && !props.selectedIdentity ? placeholder : editPlaceholder;
                        return (React.createElement(Measure, { onMeasure: _this.onTextFieldChanged },
                            React.createElement("div", { className: "bolt-identitypickerdropdown flex-row flex-grow", ref: _this.outerElement, onKeyDown: _this.onKeyDown },
                                React.createElement(TextField, { ariaExpanded: topProps.suggestionsVisible, ariaActiveDescendant: ariaActiveDescendantId, ariaAutoComplete: "list", ariaControls: ariaControlsId, autoFocus: autoFocus, ariaHasPopup: "listbox", ariaLabel: ariaLabel ? ariaLabel : props.textValue === "" ? placeholderText : props.textValue, ariaLabelledBy: ariaLabelledBy, className: css(_this.props.className, "bolt-identitypickerdropdown-textField flex-row flex-center", focusStatus.hasFocus && "bolt-identitypickerdropdown-open"), containerClassName: "bolt-identitypickerdropdown-container flex-column flex-grow", inputId: (_a = _this.props.inputId) !== null && _a !== void 0 ? _a : _this.textFieldId, onBlur: focusStatus.onBlur, onChange: _this.onSearchChange, onClick: _this.onClick, onFocus: focusStatus.onFocus, prefixIconProps: { render: _this.renderPersonaCoin }, placeholder: placeholderText, ref: _this.inputElement, required: required, role: "combobox", suffixIconProps: props.textValue && !disabled
                                        ? {
                                            ariaHidden: "false",
                                            iconName: "Clear",
                                            className: "bolt-identity-picker-clearButton fontSize",
                                            role: "button",
                                            ariaLabel: format(Resources.Remove, props.textValue),
                                            onClick: _this.onClearClicked,
                                            onKeyDown: _this.onClearKeyDown,
                                            tabIndex: 0
                                        }
                                        : undefined, value: props.textValue, disabled: disabled }))));
                    }),
                    React.createElement(Observer, { openedIdentityCard: _this.openedIdentityCard, selectedIndex: _this.selectedIndex }, function (props) {
                        return (React.createElement(IdentityPickerSuggestionsList, { calloutProps: {
                                anchorElement: _this.outerElement.current,
                                anchorOrigin: { horizontal: Location.start, vertical: Location.end },
                                calloutOrigin: { horizontal: Location.start, vertical: Location.start },
                                contentShadow: true,
                                id: "tag-picker-callout",
                                onDismiss: _this.onPickerDismiss,
                                role: "presentation"
                            }, suggestionsVisible: topProps.suggestionsVisible || !!props.openedIdentityCard, isLoading: _this.suggestionsLoading, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, onSuggestionClicked: _this.onSuggestionClick, onClosePersonaCard: _this.closePersonaCard, onDismiss: _this.onPickerDismiss, onOpenPersonaCard: _this.openPersonaCard, openedIdentityCard: props.openedIdentityCard, pickerProvider: _this.props.pickerProvider, renderSuggestion: _this.renderSuggestionItem, suggestions: _this.suggestions, suggestionTarget: _this.outerElement.current, selectedIndex: props.selectedIndex, width: _this.state.width }));
                    })));
            }));
        }));
    };
    CustomIdentityPickerDropdown.prototype.componentDidMount = function () {
        this.updateValue = this.timerManagement.debounce(this.updateValue, 250);
        if (this.props.autoFocus) {
            var textValue = ObservableLike.getValue(this.props.textValue);
            if (this.props.pickerProvider.onEmptyInputFocus) {
                this.updateSuggestionsList(this.props.pickerProvider.onEmptyInputFocus());
            }
            else {
                this.updateSuggestionsList(this.props.pickerProvider.onEmptyInputFocus());
            }
            this.inputElement.current && this.inputElement.current.select();
            this.props.onSuggestionsVisibleChanged(true);
        }
        this.setState({ width: this.outerElement.current.clientWidth });
    };
    CustomIdentityPickerDropdown.prototype.componentWillUnmount = function () {
        this.currentPromise && this.currentPromise.cancel();
    };
    CustomIdentityPickerDropdown.prototype.updateSuggestionsList = function (suggestions, initialSearchValue) {
        var _this = this;
        var suggestionsArray = suggestions;
        var suggestionsPromiseLike = suggestions;
        // Check to see if the returned value is an array, if it is then just pass it into the next function.
        // If the returned value is not an array then check to see if it's a promise or PromiseLike. If it is then resolve it asynchronously.
        if (Array.isArray(suggestionsArray)) {
            this.updateSuggestions(suggestionsArray, initialSearchValue);
        }
        else if (suggestionsPromiseLike && suggestionsPromiseLike.then) {
            this.suggestionsLoading.value = true;
            // Ensure that the promise will only use the callback if it was the most recent one.
            var promise_1 = (this.currentPromise = makeCancelable(suggestionsPromiseLike));
            promise_1.promise.then(function (newSuggestions) {
                if (promise_1 === _this.currentPromise) {
                    _this.updateSuggestions(newSuggestions, initialSearchValue);
                    if (!!initialSearchValue && initialSearchValue !== "" && _this.suggestions.value && _this.suggestions.value.length > 0) {
                        _this.cachedResults[initialSearchValue] = newSuggestions;
                    }
                    _this.suggestionsLoading.value = false;
                }
            });
        }
    };
    CustomIdentityPickerDropdown.prototype.setSuggestions = function (suggestions, selectedIndex) {
        var _this = this;
        this.suggestions.value = suggestions;
        // Selected index set after list is updated for screen readers.
        if (this.updateIndexTimer) {
            window.cancelAnimationFrame(this.updateIndexTimer);
        }
        this.updateIndexTimer = window.requestAnimationFrame(function () {
            _this.selectedIndex.value = selectedIndex;
        });
    };
    CustomIdentityPickerDropdown.prototype.updateSuggestions = function (suggestions, initialSearchValue) {
        // Only update the suggestions if the initial search value is the same as the current input
        if (initialSearchValue === undefined || (this.inputElement.current && ObservableLike.getValue(this.props.textValue) === initialSearchValue)) {
            this.setSuggestions(suggestions, ObservableLike.getValue(this.props.textValue) === "" ? -1 : 0);
        }
    };
    return CustomIdentityPickerDropdown;
}(React.Component));
export { CustomIdentityPickerDropdown };
