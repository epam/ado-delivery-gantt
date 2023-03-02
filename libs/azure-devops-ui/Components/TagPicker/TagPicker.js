import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TagPicker.css";
import * as React from "react";
import { ObservableArray, ObservableLike, ObservableValue } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { Callout } from '../../Callout';
import { FocusWithin } from '../../FocusWithin';
import { FormItemContext } from '../../FormItem';
import { Icon, IconSize } from '../../Icon';
import { Measure } from '../../Measure';
import { Observer } from '../../Observer';
import { Pill } from '../../Pill';
import { SuggestionsList } from '../../SuggestionsList';
import { css, getSafeId, KeyCode } from '../../Util';
import { Location } from '../../Utilities/Position';
var TagPicker = /** @class */ (function (_super) {
    __extends(TagPicker, _super);
    function TagPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.inputElement = React.createRef();
        _this.outerElement = React.createRef();
        _this.textValue = new ObservableValue("");
        _this.suggestionsVisible = new ObservableValue(false);
        _this.selectedIndex = new ObservableValue(-1);
        _this.selectableTags = new ObservableArray([]);
        _this.clearTagPicker = function () {
            _this.suggestionsVisible.value = false;
            _this.textValue.value = "";
            _this.selectedIndex.value = -1;
        };
        _this.suggestionsLoaded = function () {
            if (_this.selectedIndex.value === -1 &&
                !ObservableLike.getValue(_this.props.suggestionsLoading) &&
                _this.inputElement.current &&
                _this.inputElement.current.value !== "") {
                // Selected index set after list is updated for screen readers.
                if (_this.updateIndexTimer) {
                    window.cancelAnimationFrame(_this.updateIndexTimer);
                }
                _this.updateIndexTimer = window.requestAnimationFrame(function () {
                    _this.selectedIndex.value = 0;
                });
            }
            return true;
        };
        _this.createGenericItem = function (searchString, list) {
            if (searchString.trim().length === 0) {
                return undefined;
            }
            var defaultItem = _this.props.createDefaultItem && _this.props.createDefaultItem(searchString);
            if (defaultItem) {
                if (list.some(function (selectedTag) { return _this.props.areTagsEqual(defaultItem, selectedTag); })) {
                    return undefined;
                }
            }
            return defaultItem;
        };
        _this.onBlur = function () {
            if (_this.props.shouldBlurClear && !_this.props.shouldBlurClear()) {
                return;
            }
            var previousValue = _this.textValue.value;
            _this.textValue.value = "";
            _this.selectableTags.value = [];
            _this.props.onBlur && _this.props.onBlur(previousValue);
            _this.onSuggestionsDismiss();
        };
        _this.onFocus = function () {
            _this.props.onFocus && _this.props.onFocus();
        };
        _this.onOuterKeyDown = function (ev) {
            var keyCode = ev.which;
            switch (keyCode) {
                case KeyCode.delete:
                case KeyCode.backspace:
                    if (!ev.isDefaultPrevented() && _this.selectableTags.value.length > 0) {
                        _this.props.onTagsRemoved && _this.props.onTagsRemoved(_this.selectableTags.value);
                        _this.selectableTags.value = [];
                        _this.focusInput();
                        ev.preventDefault();
                    }
                    break;
            }
        };
        _this.onKeyDown = function (ev) {
            var keyCode = ev.which;
            var input = _this.inputElement.current;
            var suggestionsVisible = _this.suggestionsVisible.value;
            var suggestions = ObservableLike.getValue(_this.props.suggestions);
            switch (keyCode) {
                case KeyCode.escape:
                    _this.onSuggestionsDismiss();
                    ev.preventDefault();
                    break;
                case KeyCode.tab:
                case KeyCode.enter:
                    if (!ev.shiftKey) {
                        if (suggestionsVisible) {
                            _this.completeSuggestion();
                            ev.preventDefault();
                        }
                        else if (_this.props.createDefaultItem) {
                            var itemToAdd = _this.createGenericItem(_this.textValue.value, ObservableLike.getValue(_this.props.selectedTags));
                            if (itemToAdd) {
                                _this.addItem(itemToAdd);
                                ev.preventDefault();
                            }
                        }
                    }
                    break;
                case KeyCode.upArrow:
                    if (suggestionsVisible) {
                        _this.selectedIndex.value = Math.max(0, _this.selectedIndex.value - 1);
                        ev.preventDefault();
                    }
                    break;
                case KeyCode.downArrow:
                    if (suggestionsVisible) {
                        _this.selectedIndex.value = Math.min(suggestions.length - 1, _this.selectedIndex.value + 1);
                        ev.preventDefault();
                    }
                    else if (_this.textValue.value === "") {
                        _this.props.onEmptyInputFocus && _this.props.onEmptyInputFocus();
                        _this.suggestionsVisible.value = true;
                        ev.preventDefault();
                    }
                    else {
                        _this.suggestionsVisible.value = true;
                        ev.preventDefault();
                    }
                    break;
                case KeyCode.rightArrow:
                    if (suggestionsVisible &&
                        suggestions &&
                        suggestions[_this.selectedIndex.value] &&
                        _this.props.onSuggestionExpanded &&
                        input &&
                        input.value.length === input.selectionEnd) {
                        _this.props.onSuggestionExpanded(suggestions[_this.selectedIndex.value]);
                        ev.preventDefault();
                    }
                    break;
            }
        };
        _this.onInputClick = function (event) {
            if (_this.props.onEmptyInputFocus && _this.textValue.value === "") {
                _this.props.onEmptyInputFocus();
            }
            _this.suggestionsVisible.value = true;
            event && event.preventDefault();
        };
        _this.onInputChange = function (e) {
            _this.textValue.value = e.target.value;
            _this.selectedIndex.value = -1;
            _this.onResolveInput(e);
            e.persist();
            e.preventDefault();
        };
        _this.onResolveInput = function (e) {
            var splitText = _this.props.deliminator && _this.textValue.value.split(_this.props.deliminator);
            if (_this.props.onDelimitedSearch && _this.props.deliminator && splitText && splitText.length > 1) {
                _this.props.onDelimitedSearch(_this.textValue.value.split(_this.props.deliminator).filter(function (identity) { return identity !== ""; }));
            }
            else {
                _this.props.onSearchChanged(e.target.value);
                _this.suggestionsVisible.value = true;
            }
        };
        _this.onTagClicked = function (event, suggestion) {
            if (!event || !event.isDefaultPrevented()) {
                var indexOf = _this.indexOfTag(suggestion, _this.selectableTags.value);
                if (!_this.props.onTagsRemoved) {
                    return;
                }
                if (indexOf < 0) {
                    _this.selectableTags.push(suggestion);
                }
                else {
                    _this.selectableTags.splice(indexOf, 1);
                }
                event && event.preventDefault();
            }
        };
        _this.onTagRemoved = function (suggestion) {
            var indexOf = _this.indexOfTag(suggestion, _this.selectableTags.value);
            // If this is selected, remove the selection before removing the tag from the list
            if (indexOf >= 0) {
                _this.selectableTags.splice(indexOf, 1);
            }
            _this.props.onTagRemoved(suggestion);
            _this.inputElement.current && _this.inputElement.current.focus();
        };
        _this.onTagPickerSizeChanged = function (newWidth, newHeight) {
            _this.setState({ width: newWidth });
        };
        _this.completeSuggestion = function () {
            var suggestionToAdd = ObservableLike.getValue(_this.props.suggestions)[_this.selectedIndex.value];
            !!suggestionToAdd && _this.addItem(suggestionToAdd);
        };
        _this.onSuggestionClick = function (suggestion) {
            _this.addItem(suggestion.item);
        };
        _this.addItem = function (item) {
            _this.suggestionsVisible.value = false;
            _this.props.onTagAdded(item);
            _this.textValue.value = "";
            _this.selectedIndex.value = -1;
            _this.focusInput();
        };
        _this.focusInput = function () {
            if (_this.inputElement.current) {
                _this.inputElement.current.focus();
                _this.inputElement.current.select();
            }
        };
        _this.onSuggestionsDismiss = function () {
            _this.suggestionsVisible.value = false;
        };
        _this.indexOfTag = function (tag, list) {
            return list.findIndex(function (item) {
                return _this.props.areTagsEqual(item, tag);
            });
        };
        _this.state = { width: 296 };
        _this.timerManagement = new TimerManagement();
        return _this;
    }
    TagPicker.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, className = _a.className, convertItemToPill = _a.convertItemToPill, noResultsFoundText = _a.noResultsFoundText, onTagsRemoved = _a.onTagsRemoved, placeholderText = _a.placeholderText, prefixIconProps = _a.prefixIconProps, renderSuggestionItem = _a.renderSuggestionItem, selectedTags = _a.selectedTags, suggestions = _a.suggestions, suggestionsLoading = _a.suggestionsLoading, suggestionsLoadingText = _a.suggestionsLoadingText;
        return (React.createElement(FocusWithin, { onBlur: this.onBlur, onFocus: this.onFocus }, function (focusStatus) {
            return (React.createElement(React.Fragment, null,
                React.createElement(Observer, { suggestionsLoading: { observableValue: suggestionsLoading, filter: _this.suggestionsLoaded }, suggestionsVisible: _this.suggestionsVisible, selectedIndex: _this.selectedIndex, selectableTags: _this.selectableTags, selectedTags: selectedTags, suggestions: { observableValue: suggestions, filter: _this.suggestionsLoaded }, textValue: _this.textValue }, function (props) {
                    var genericItem = _this.createGenericItem(_this.textValue.value, props.suggestions.concat(props.selectedTags));
                    genericItem && props.suggestions.unshift(genericItem);
                    return (React.createElement(Measure, { onMeasure: _this.onTagPickerSizeChanged },
                        React.createElement("div", { className: css("bolt-tag-picker", (focusStatus.hasFocus || props.suggestionsVisible) && "edit", className), ref: _this.outerElement, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, onClick: _this.focusInput },
                            React.createElement("div", { className: "bolt-tag-picker-group flex-center flex-row flex-grow flex-wrap", onKeyDown: onTagsRemoved && _this.onOuterKeyDown },
                                props.selectedTags.length === 0 && prefixIconProps ? (React.createElement(Icon, __assign({}, prefixIconProps, { className: css(prefixIconProps.className, "bolt-tag-picker-prefix-icon") }))) : null,
                                props.selectedTags.map(function (suggestion, index) {
                                    var tagPill = convertItemToPill(suggestion, index);
                                    var indexOf = _this.indexOfTag(suggestion, props.selectableTags);
                                    return (React.createElement(Pill, __assign({}, tagPill, { key: getSafeId("bolt-tag-picker-pill" + index), className: css(tagPill.className, "bolt-tag-picker-pill", onTagsRemoved && "bolt-tag-picker-pill-selectable", indexOf >= 0 && "active"), contentClassName: "text-ellipsis scroll-hidden", onClick: function (ev) {
                                            _this.onTagClicked(ev, suggestion);
                                            tagPill.onClick && tagPill.onClick(ev);
                                        }, onRemoveClick: function (event) {
                                            _this.onTagRemoved(suggestion);
                                            event.preventDefault();
                                        } }), tagPill.content));
                                }),
                                React.createElement(FormItemContext.Consumer, null, function (formItemContext) {
                                    var placeholder = props.selectedTags.length === 0 || focusStatus.hasFocus ? placeholderText : undefined;
                                    var showAddButton = !focusStatus.hasFocus && props.selectedTags.length > 0 && !props.suggestionsVisible;
                                    var ariaActiveDescendantId;
                                    if (props.suggestionsVisible) {
                                        if (props.selectedIndex === -1 || props.suggestionsLoading) {
                                            ariaActiveDescendantId = getSafeId("sug-list-transition");
                                        }
                                        else if (!props.suggestions || !props.suggestions.length) {
                                            ariaActiveDescendantId = getSafeId("sug-list-no-results");
                                        }
                                        else {
                                            ariaActiveDescendantId = getSafeId("sug-row-" + props.selectedIndex);
                                        }
                                    }
                                    var ariaControlsId = props.suggestionsVisible
                                        ? getSafeId("tag-picker-callout")
                                        : undefined;
                                    return (React.createElement("div", { className: "bolt-tag-picker-add-icon-div flex-row flex-grow" },
                                        showAddButton && (React.createElement(Icon, { className: "bolt-tag-picker-add-icon cursor-pointer", iconName: "Add", size: IconSize.small })),
                                        React.createElement("input", { "aria-activedescendant": ariaActiveDescendantId, "aria-autocomplete": "list", "aria-controls": ariaControlsId, "aria-expanded": props.suggestionsVisible, "aria-haspopup": "listbox", "aria-label": ariaLabel || placeholderText, "aria-labelledby": getSafeId(ariaLabelledBy || formItemContext.ariaLabelledById), className: css("bolt-tag-picker-input flex-row flex-grow scroll-hidden", showAddButton && !placeholder && "hide-input"), onBlur: focusStatus.onBlur, onChange: _this.onInputChange, onKeyDown: _this.onKeyDown, onClick: _this.onInputClick, placeholder: placeholder, ref: _this.inputElement, role: "combobox", type: "text", value: props.textValue })));
                                })))));
                }),
                React.createElement(Observer, { suggestionsVisible: _this.suggestionsVisible, suggestionsLoading: suggestionsLoading, selectedIndex: _this.selectedIndex, suggestions: suggestions, textValue: _this.textValue }, function (props) {
                    return props.suggestionsVisible ? (React.createElement(Callout, { anchorElement: _this.outerElement.current || undefined, anchorOrigin: { horizontal: Location.start, vertical: Location.end }, calloutOrigin: { horizontal: Location.start, vertical: Location.start }, contentClassName: "bolt-tag-picker-callout-content scroll-hidden", contentShadow: true, id: "tag-picker-callout", role: "presentation" },
                        React.createElement(SuggestionsList, { isLoading: props.suggestionsLoading, loadingText: suggestionsLoadingText, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, noResultsFoundText: props.textValue ? noResultsFoundText : undefined, onSuggestionClicked: _this.onSuggestionClick, renderSuggestion: renderSuggestionItem, selectedIndex: props.selectedIndex, suggestions: props.suggestions, width: _this.state.width }))) : null;
                })));
        }));
    };
    TagPicker.prototype.componentDidMount = function () {
        this.onResolveInput = this.timerManagement.debounce(this.onResolveInput, this.props.onSearchChangedDebounceWait);
    };
    TagPicker.prototype.focus = function () {
        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }
    };
    TagPicker.defaultProps = {
        onSearchChangedDebounceWait: 250
    };
    return TagPicker;
}(React.Component));
export { TagPicker };
