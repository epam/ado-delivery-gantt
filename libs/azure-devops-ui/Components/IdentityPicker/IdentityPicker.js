import { __assign, __awaiter, __extends, __generator } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPicker.css";
import * as React from "react";
import { ObservableArray, ObservableLike, ObservableValue } from '../../Core/Observable';
import { makeCancelable } from '../../Core/Util/Promise';
import { format } from '../../Core/Util/String';
import { IconSize } from '../../Icon';
import { IdentityCard } from '../../IdentityCard';
import { Observer } from '../../Observer';
import { Persona, PersonaSize } from '../../Persona';
import * as Resources from '../../Resources.IdentityPicker';
import { TagPicker } from '../../TagPicker';
import { Tooltip } from '../../TooltipEx';
import { KeyCode } from '../../Util';
import { shouldShowIdentityCard } from "../IdentityPickerDropdown/IdentityPickerUtils";
import { IdentityType } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
import { IdentityPickerSuggestionItem } from "../IdentityPickerSuggestionsList/IdentityPickerSuggestionItem";
var IdentityPicker = /** @class */ (function (_super) {
    __extends(IdentityPicker, _super);
    function IdentityPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.resolveEmailPromises = [];
        _this.itemRefs = {};
        _this.tagPickerRef = React.createRef();
        _this.openedIdentityCard = new ObservableValue(undefined);
        _this.outerElement = React.createRef();
        _this.lastSearchVal = "";
        _this.suggestions = new ObservableArray([]);
        _this.suggestionsLoading = new ObservableValue(false);
        _this._isMounted = false;
        _this.areTagsEqual = function (first, second) {
            return first.entityId === second.entityId;
        };
        _this.renderSuggestionItem = function (suggestion) {
            return (React.createElement("div", { className: "flex-row flex-grow full-width", onKeyDown: _this.onKeyDownSuggestionItem },
                React.createElement(IdentityPickerSuggestionItem, __assign({}, suggestion, { onOpenPersonaCard: _this.onOpenPersonaCard, ref: function (itemRef) { return (_this.itemRefs[suggestion.item.entityId] = itemRef); }, renderSuggestion: _this.props.renderCustomIdentitySuggestion && _this.renderCustomSuggestionItem }))));
        };
        _this.onKeyDownSuggestionItem = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.leftArrow || event.which === KeyCode.escape || event.which === KeyCode.tab) {
                    if (_this.tagPickerRef.current) {
                        _this.tagPickerRef.current.focus();
                        event.preventDefault();
                    }
                }
            }
        };
        _this.createDefaultItem = function (email) {
            return {
                displayName: email,
                originDirectory: "email",
                originId: email,
                entityId: email,
                entityType: IdentityType.Custom
            };
        };
        _this.onOpenPersonaCard = function (identity) {
            if (shouldShowIdentityCard(identity)) {
                _this.openedIdentityCard.value = identity;
            }
        };
        _this.onClosePersonaCard = function () {
            _this.openedIdentityCard.value = undefined;
            _this.tagPickerRef.current.focus();
        };
        _this.shouldBlurClear = function () {
            return _this.openedIdentityCard.value === undefined;
        };
        _this.onEmptyInputFocus = function () {
            _this.updateSuggestionsList(_this.props.pickerProvider.onEmptyInputFocus());
        };
        _this.focusContactCardButton = function (tag) {
            if (_this.itemRefs[tag.entityId]) {
                _this.itemRefs[tag.entityId].focus();
            }
        };
        _this.onAddIdentity = function (identity) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reset the state back to valid as new input should be validated.
                        this.setStateSafe({ error: "" });
                        if (!this.props.pickerProvider.addIdentitiesToMRU) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.props.pickerProvider.addIdentitiesToMRU([identity])];
                    case 2:
                        _a.sent();
                        this.props.onIdentityAdded(identity);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.setStateSafe({ error: error_1.message });
                        // Remove selected identity from the picker and show the error message
                        // as the identity selected from MRU was removed or marked as inactive.
                        this.props.onIdentityRemoved(identity);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.props.onIdentityAdded(identity);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.onDelimitedSearch = function (emailList) {
            var emails = emailList.map(function (email) { return email.trim(); });
            emails.forEach(function (email) {
                _this.updateResolvedEmail(_this.props.pickerProvider.onFilterIdentities(email), email);
                _this.props.onIdentityAdded(_this.createDefaultItem(email));
            });
            _this.tagPickerRef.current && _this.tagPickerRef.current.clearTagPicker();
        };
        _this.renderCustomSuggestionItem = function (suggestion) {
            return _this.props.renderCustomIdentitySuggestion && _this.props.renderCustomIdentitySuggestion(suggestion.item);
        };
        _this.convertItemToPill = function (person, index) {
            var isUnresolvedEmail = person.originDirectory === "email";
            return !!_this.props.convertItemToPill && person.entityType === IdentityType.Custom
                ? _this.props.convertItemToPill(person, index)
                : {
                    className: "bolt-identity-picker-pill flex-row",
                    content: isUnresolvedEmail ? (React.createElement(Tooltip, { text: format(Resources.UnknownUserOrGroup, person.displayName) },
                        React.createElement("div", { className: "bolt-identity-picker-unresolved-email" }, person.displayName))) : (person.displayName || person.mailNickname),
                    onRenderFilledVisual: isUnresolvedEmail
                        ? undefined
                        : function () {
                            return React.createElement(Persona, { ariaLabel: "", className: "flex-row flex-center", identity: person, size: PersonaSize.size20 });
                        }
                };
        };
        _this.onResolveSuggestions = function (updatedValue) {
            // Reset the state back to valid as user started new input.
            _this.setStateSafe({ error: "" });
            _this.lastSearchVal = updatedValue;
            var suggestions = _this.props.pickerProvider.onFilterIdentities(updatedValue, ObservableLike.getValue(_this.props.selectedIdentities));
            if (suggestions !== null) {
                if (_this.cachedResults[updatedValue]) {
                    _this.suggestions.value = _this.cachedResults[updatedValue].filter(function (identity) {
                        return !ObservableLike.getValue(_this.props.selectedIdentities).some(function (selectedIdentity) { return selectedIdentity.entityId === identity.entityId; });
                    });
                }
                else {
                    _this.updateSuggestionsList(suggestions, updatedValue);
                }
            }
        };
        _this.setStateSafe = function (state) {
            if (!_this._isMounted) {
                return;
            }
            _this.setState(state);
        };
        _this.cachedResults = {};
        _this.state = { error: "" };
        return _this;
    }
    IdentityPicker.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: this.props.className, ref: this.outerElement },
            React.createElement(Observer, { openedIdentityCard: this.openedIdentityCard }, function (props) {
                return (React.createElement(React.Fragment, null,
                    React.createElement(TagPicker, { ariaLabel: _this.props.ariaLabel, ariaLabelledBy: _this.props.ariaLabelledBy, suggestionsLoading: _this.suggestionsLoading, areTagsEqual: _this.areTagsEqual, convertItemToPill: _this.convertItemToPill, deliminator: _this.props.onResolveEntity && ";", noResultsFoundText: Resources.IdentityPickerNoResultsText, onBlur: _this.props.onBlur, onDelimitedSearch: _this.props.onResolveEntity && _this.onDelimitedSearch, onEmptyInputFocus: _this.onEmptyInputFocus, onSearchChanged: _this.onResolveSuggestions, onSuggestionExpanded: _this.focusContactCardButton, onTagAdded: _this.onAddIdentity, onTagRemoved: _this.props.onIdentityRemoved, onTagsRemoved: _this.props.onIdentitiesRemoved, placeholderText: _this.props.placeholderText || Resources.MultiIdentityPickerPlaceholderText, prefixIconProps: {
                            className: "bolt-identity-picker-contact-icon secondary-text justify-center flex-center",
                            iconName: "Contact",
                            size: IconSize.medium
                        }, ref: _this.tagPickerRef, renderSuggestionItem: _this.renderSuggestionItem, shouldBlurClear: _this.shouldBlurClear, selectedTags: _this.props.selectedIdentities, suggestions: _this.suggestions, suggestionsLoadingText: Resources.Loading }),
                    props.openedIdentityCard && (React.createElement(IdentityCard, { getEntityFromUniqueAttribute: _this.props.pickerProvider.getEntityFromUniqueAttribute, key: props.openedIdentityCard.entityId, identity: props.openedIdentityCard, displayName: props.openedIdentityCard.displayName, target: _this.outerElement.current, onDismissCallback: _this.onClosePersonaCard, onRequestConnectionInformation: _this.props.pickerProvider.onRequestConnectionInformation })),
                    React.createElement("div", { className: "bolt-identity-picker-error" }, _this.state.error)));
            })));
    };
    IdentityPicker.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    IdentityPicker.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        this.currentPromise && this.currentPromise.cancel();
        for (var _i = 0, _a = this.resolveEmailPromises; _i < _a.length; _i++) {
            var promise = _a[_i];
            promise.cancel();
        }
    };
    IdentityPicker.prototype.updateResolvedEmail = function (suggestions, email) {
        var _this = this;
        var suggestionsArray = suggestions;
        var suggestionsPromiseLike = suggestions;
        if (Array.isArray(suggestionsArray)) {
            this.props.onResolveEntity &&
                suggestionsArray.length === 1 &&
                this.props.onResolveEntity(email, !ObservableLike.getValue(this.props.selectedIdentities).some(function (identity) { return identity.entityId === suggestionsArray[0].entityId; })
                    ? suggestionsArray[0]
                    : null);
        }
        else if (suggestionsPromiseLike && suggestionsPromiseLike.then) {
            var promise = (this.currentPromise = makeCancelable(suggestionsPromiseLike));
            promise.promise.then(function (newSuggestions) {
                _this.props.onResolveEntity &&
                    newSuggestions.length === 1 &&
                    _this.props.onResolveEntity(email, !ObservableLike.getValue(_this.props.selectedIdentities).some(function (identity) { return identity.entityId === newSuggestions[0].entityId; })
                        ? newSuggestions[0]
                        : null);
            });
        }
    };
    IdentityPicker.prototype.updateSuggestionsList = function (suggestions, initialSearchValue) {
        var _this = this;
        var suggestionsArray = suggestions;
        var suggestionsPromiseLike = suggestions;
        // Check to see if the returned value is an array, if it is then just pass it into the next function.
        // If the returned value is not an array then check to see if it's a promise or PromiseLike. If it is then resolve it asynchronously.
        if (Array.isArray(suggestionsArray)) {
            this.suggestions.value = suggestionsArray.filter(function (identity) {
                return !ObservableLike.getValue(_this.props.selectedIdentities).some(function (selectedIdentity) { return selectedIdentity.entityId === identity.entityId; });
            });
        }
        else if (suggestionsPromiseLike && suggestionsPromiseLike.then) {
            this.suggestionsLoading.value = true;
            // Ensure that the promise will only use the callback if it was the most recent one.
            var promise_1 = (this.currentPromise = makeCancelable(suggestionsPromiseLike));
            this.resolveEmailPromises.push(promise_1);
            promise_1.promise.then(function (newSuggestions) {
                _this.resolveEmailPromises = _this.resolveEmailPromises.filter(function (p) { return p !== promise_1; });
                if (promise_1 === _this.currentPromise) {
                    // Only update the suggestion list if the search value hasn't changed
                    if (!initialSearchValue || _this.lastSearchVal === initialSearchValue) {
                        _this.suggestions.value = newSuggestions.filter(function (identity) {
                            return !ObservableLike.getValue(_this.props.selectedIdentities).some(function (selectedIdentity) { return selectedIdentity.entityId === identity.entityId; });
                        });
                    }
                    if (!!initialSearchValue && initialSearchValue !== "" && _this.suggestions.value && _this.suggestions.value.length > 0) {
                        _this.cachedResults[initialSearchValue] = newSuggestions;
                    }
                    _this.suggestionsLoading.value = false;
                }
            }, function () {
                _this.resolveEmailPromises = _this.resolveEmailPromises.filter(function (p) { return p !== promise_1; });
            });
        }
    };
    IdentityPicker.area = "IdentityPicker";
    IdentityPicker.feature = "MRU";
    return IdentityPicker;
}(React.Component));
export { IdentityPicker };
