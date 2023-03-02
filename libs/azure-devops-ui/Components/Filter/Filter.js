import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Filter.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { announce } from '../../Core/Util/Accessibility';
import { ScreenSize } from '../../Core/Util/Screen';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { ContentLocation } from '../../Callout';
import { Dropdown, DropdownCalloutComponent, DropdownExpandableButton, filterItems } from '../../Dropdown';
import { FocusZoneContext } from '../../FocusZone';
import { Icon } from '../../Icon';
import { renderListCell } from '../../List';
import { getListBoxItemsValue, ListBox, ListBoxItemType, wrapListBoxItems } from '../../ListBox';
import { Observer, SelectionObserver, UncheckedObserver } from '../../Observer';
import { Pill, PillSize } from '../../Pill';
import * as Resources from '../../Resources.Filter';
import { TextField } from '../../TextField';
import { css, KeyCode } from '../../Util';
import { updateFilterToSelection } from '../../Utilities/DropdownFilter';
import { DropdownMultiSelection } from '../../Utilities/DropdownSelection';
import { FILTER_CHANGE_EVENT } from '../../Utilities/Filter';
import { Location } from '../../Utilities/Position';
import { ScreenSizeObserver } from '../../Utilities/ScreenSize';
import { compareSelectionRanges, indexWithinRanges } from '../../Utilities/Selection';
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
var FilterCalloutWidth = 320;
var FilterItemPadding = 48;
var Filter = /** @class */ (function (_super) {
    __extends(Filter, _super);
    function Filter(props) {
        var _this = _super.call(this, props) || this;
        _this.dropdown = React.createRef();
        _this.dropdownCallout = React.createRef();
        _this.filterText = new ObservableValue("");
        _this.timerManagement = new TimerManagement();
        _this.collapse = function () {
            if (_this.dropdown.current) {
                _this.dropdown.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.dropdown.current) {
                _this.dropdown.current.expand();
            }
        };
        _this.onDoneClick = function () {
            var filterStore = _this.props.filterStore;
            if (filterStore.usesApplyMode()) {
                filterStore.applyChanges();
            }
            _this.collapse();
        };
        _this.onApplyClick = function () {
            var filterStore = _this.props.filterStore;
            if (filterStore.usesApplyMode()) {
                filterStore.applyChanges();
            }
            _this.clearActiveFilter();
        };
        _this.onExpandClick = function () {
            Utils_Accessibility.announce(_this.props.title || Resources.FilterTitle);
        };
        _this.renderBeforeContent = function () {
            return (React.createElement(Observer, { activeFilter: _this.activeFilter, filterText: _this.filterText, bestHitItem: _this.props.bestHitItem, userFilteredItems: _this.props.userFilteredItems }, function (props) {
                return props.activeFilter
                    ? props.activeFilter.renderBeforeContent
                        ? props.activeFilter.renderBeforeContent(_this.clearActiveFilter)
                        : null
                    : props.filterText
                        ? _this.renderFilteredView()
                        : _this.renderFilterItems();
            }));
        };
        _this.renderFilteredView = function () {
            var items = [];
            if (_this.props.bestHitItem && _this.props.bestHitItem.value) {
                items.push({ id: "best-hit-header", text: Resources.BestHit, type: ListBoxItemType.Header, className: "bolt-filtered-header" });
                items.push(_this.props.bestHitItem.value);
            }
            if (_this.props.userFilteredItems) {
                items.push.apply(items, getListBoxItemsValue(_this.props.userFilteredItems));
            }
            else {
                _this.props.filterItems.forEach(function (filterItem) {
                    var filteredItems = filterItems(getListBoxItemsValue(filterItem.items), _this.filterText.value || "").filteredItems;
                    // Remove all headers and dividers and selected items from results
                    var selectedItems = _this.getSelectedFilterItems(filterItem);
                    filteredItems = filteredItems.filter(function (item) {
                        return (item.type !== ListBoxItemType.Header &&
                            item.type !== ListBoxItemType.Divider &&
                            selectedItems.indexOf(item) === -1 &&
                            (!_this.props.bestHitItem || _this.props.bestHitItem.value !== item));
                    });
                    if (filteredItems.length) {
                        items.push({ id: filterItem.id, text: filterItem.name, type: ListBoxItemType.Header, className: "bolt-filtered-header" });
                        items.push.apply(items, filteredItems.map(function (item) { return (__assign(__assign({}, item), { groupId: filterItem.id })); }));
                    }
                });
                // Add keyword results last
                if (_this.props.filterItems.some(function (filterItem) { return filterItem.id === "keyword-item"; })) {
                    items.push.apply(items, getKeywordSearchResults(_this.filterText.value));
                }
            }
            var numberOfItems = items.filter(function (item) { return item.type !== ListBoxItemType.Header; }).length;
            if (numberOfItems > 0) {
                _this.announceWithDebouncing(format(Resources.AnnounceFilterResultCount, numberOfItems));
            }
            else {
                _this.announceWithDebouncing(Resources.NoFilterResults);
            }
            return (React.createElement(ListBox, { items: items, onSelect: _this.onFilteredItemSelect, onActivate: _this.onFilteredItemSelect, excludeTabStop: true, focuszoneProps: null }));
        };
        _this.renderSelectedItems = function (selection, items) {
            return _this.props.showFilterOnText !== false && _this.filtered() ? Resources.FilterOn : Resources.Filter;
        };
        _this.renderFilterItems = function () {
            var _a = _this.props, filterItems = _a.filterItems, filterStore = _a.filterStore;
            return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
                return filterItems.map(function (filterItem, index) {
                    var selectedItems = _this.getSelectedFilterItems(filterItem);
                    var selectedCount = selectedItems.length;
                    var itemState = filterStore.getFilterItemState(filterItem.filterItemKey);
                    var defaultItemState = filterStore.getDefaultState()[filterItem.filterItemKey];
                    var isDefault = filterStore.filterItemStatesAreEqual(filterItem.filterItemKey, itemState, defaultItemState);
                    return (React.createElement("div", { className: "flex-row flex-center bolt-filter-item", key: filterItem.id, id: "bolt-filter-item-" + filterItem.id, "data-focuszone": zoneContext.focuszoneId, tabIndex: -1, onClick: function () { return _this.onFilterItemSelected(filterItem); }, onKeyDown: function (event) {
                            if (!event.defaultPrevented &&
                                (event.which === KeyCode.enter || event.which === KeyCode.space || event.which === KeyCode.rightArrow)) {
                                _this.onFilterItemSelected(filterItem, event.currentTarget);
                                event.preventDefault();
                            }
                        } },
                        React.createElement("div", { className: css("flex-row flex-center flex-grow bolt-filter-label", itemState && itemState.value && itemState.value.length !== 0 && "bolt-filter-label-selected"), style: { width: _this.props.width - FilterItemPadding } },
                            React.createElement("span", { className: css(isDefault && "secondary-text", !isDefault && "font-weight-semibold") }, filterItem.name),
                            selectedCount > 1 && (React.createElement(Pill, { className: "bolt-filter-selection-pill", excludeFocusZone: true, size: PillSize.compact }, selectedCount)),
                            React.createElement("div", { className: "flex-grow flex-row bolt-filter-selected-item-container" }, filterItem.renderSelectedItems
                                ? filterItem.renderSelectedItems(selectedItems)
                                : renderSelectedFilterItems(selectedItems))),
                        React.createElement(Icon, { iconName: "ChevronRight" })));
                });
            }));
        };
        _this.onFilteredItemSelect = function (event, item) {
            if (item.groupId) {
                var filterStore = _this.props.filterStore;
                var group = _this.props.filterItems.find(function (f) { return f.id === item.groupId; });
                if (group) {
                    var key = group.filterItemKey;
                    var itemState = filterStore.getFilterItemState(key);
                    var newValue = item.data !== undefined ? item.data : item.id;
                    if (key === "keyword") {
                        filterStore.setFilterItemState(key, { value: item.id });
                    }
                    else if (itemState && itemState.value && Array.isArray(itemState.value) && _this.selection.multiSelect) {
                        filterStore.setFilterItemState(item.groupId, { value: __spreadArrays(itemState.value, [newValue]) });
                    }
                    else {
                        filterStore.setFilterItemState(key, { value: [newValue] });
                    }
                }
            }
            _this.filterText.value = "";
            if (_this.dropdownCallout.current) {
                _this.dropdownCallout.current.focus();
            }
        };
        _this.onFilterChanged = function (changedState) {
            var filterState = _this.props.filterStore.getState();
            var newSelection = new DropdownMultiSelection();
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            var _loop_1 = function (key) {
                var itemState = filterState[key];
                if (itemState && itemState.value) {
                    if (key === "keyword") {
                        var index = items.findIndex(function (item) { return item.id === itemState.value; });
                        if (index > -1) {
                            newSelection.select(index, 1, true);
                        }
                    }
                    else {
                        var _loop_2 = function (i) {
                            var index = items.findIndex(function (item) { return item.id === itemState.value[i] || item.data === itemState.value[i]; });
                            if (index > -1) {
                                newSelection.select(index, 1, true);
                            }
                        };
                        for (var i = 0; i < itemState.value.length; i++) {
                            _loop_2(i);
                        }
                    }
                }
            };
            for (var key in filterState) {
                _loop_1(key);
            }
            var selectionDifference = compareSelectionRanges(_this.selection.value, newSelection.value);
            if (selectionDifference.length) {
                _this.selection.value = newSelection.value;
            }
        };
        _this.onSelectionChanged = function (values) {
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            if (_this.props.filterStore && _this.activeFilter.value) {
                var activeFilterSelection_1 = new DropdownMultiSelection();
                var startingIndex_1 = 0;
                for (var i = 0; _this.props.filterItems[i].id !== _this.activeFilter.value.id; i++) {
                    startingIndex_1 += _this.props.filterItems[i].items.length;
                }
                values.forEach(function (value) {
                    for (var i = value.beginIndex; i <= value.endIndex; i++) {
                        if (i >= startingIndex_1 && i < startingIndex_1 + _this.activeFilter.value.items.length) {
                            activeFilterSelection_1.select(i, 1, true);
                        }
                    }
                });
                if (_this.activeFilter.value.filterItemKey === "keyword" && activeFilterSelection_1.value.length === 0) {
                    // Don't clear keyword filter when selection gets empty.
                    // This happens when user edits current text and we don't want to reset his editing text to ""
                    return true;
                }
                updateFilterToSelection(activeFilterSelection_1.value, items, _this.props.filterStore, _this.activeFilter.value.filterItemKey);
            }
            return true;
        };
        _this.onResetClick = function () {
            if (_this.dropdownCallout.current) {
                _this.dropdownCallout.current.focus();
            }
            _this.props.filterStore.reset();
        };
        _this.onResetFilterItemClick = function (key) {
            if (_this.dropdownCallout.current) {
                _this.dropdownCallout.current.focus();
            }
            _this.props.filterStore.resetFilterItemState(key);
        };
        _this.onFilterItemSelected = function (filterItem, triggerElement) {
            if (_this.dropdownCallout.current) {
                _this.dropdownCallout.current.focus();
            }
            if (!_this.props.activeFilter) {
                _this.activeFilter.value = filterItem;
                announce(format(Resources.FilterSelected, filterItem.name));
                _this.activeFilterReturnElementId = triggerElement === null || triggerElement === void 0 ? void 0 : triggerElement.id;
            }
            if (_this.props.onActiveFilterChanged) {
                _this.props.onActiveFilterChanged(filterItem);
            }
        };
        _this.getOnFilterTextChanged = function (props) {
            return function (e, newValue) {
                _this.filterText.value = newValue;
                if (_this.activeFilter.value && props.onFilterTextChanged) {
                    props.onFilterTextChanged(e, newValue);
                    _this.dropdownOnFilterTextChanged = props.onFilterTextChanged;
                }
                if (_this.props.onFilterTextChanged) {
                    _this.props.onFilterTextChanged(e, newValue);
                }
            };
        };
        _this.getFilterStartingIndex = function (filter) {
            if (filter) {
                var filterIndex = _this.props.filterItems.indexOf(filter);
                var itemCount = 0;
                for (var i = 0; i < filterIndex; i++) {
                    itemCount += _this.props.filterItems[i].items.length;
                }
                return itemCount;
            }
            return -1;
        };
        _this.getSelectedFilterItems = function (filter) {
            var selectedItems = [];
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            var startingIndex = _this.getFilterStartingIndex(filter);
            for (var i = startingIndex; i < startingIndex + filter.items.length; i++) {
                if (indexWithinRanges(i, _this.selection.value)) {
                    selectedItems.push(items[i]);
                }
            }
            return selectedItems;
        };
        _this.clearFilterSelection = function () {
            if (_this.activeFilter.value) {
                _this.props.filterStore.setFilterItemState(_this.activeFilter.value.filterItemKey, { value: null });
                _this.activeFilter.value = null;
            }
        };
        _this.clearActiveFilter = function (focusOnDropdown) {
            // Focus on base filter dropdown, when filter is closed to avoid losing of keyboard focus for tabbing
            if (focusOnDropdown) {
                _this.focus();
            }
            else if (_this.dropdownCallout.current) {
                _this.dropdownCallout.current.focus();
                // a11y: Focus back the filter item we selected.
                // We need to give time to re-render so filter items are visible again.
                requestAnimationFrame(function () {
                    if (_this.activeFilterReturnElementId) {
                        var returnElement = document.getElementById(_this.activeFilterReturnElementId);
                        returnElement === null || returnElement === void 0 ? void 0 : returnElement.focus();
                        _this.activeFilterReturnElementId = undefined;
                    }
                });
            }
            if (!_this.props.activeFilter) {
                _this.activeFilter.value = null;
            }
            if (_this.props.onActiveFilterChanged) {
                _this.props.onActiveFilterChanged(null);
            }
            _this.filterText.value = "";
            if (_this.dropdownOnFilterTextChanged) {
                _this.dropdownOnFilterTextChanged(null, "");
            }
        };
        _this.filtered = function () {
            var filterState = _this.props.filterStore.getAppliedState();
            for (var key in filterState) {
                if (filterState[key].value && (!Array.isArray(filterState[key].value) || filterState[key].value.length > 0)) {
                    return true;
                }
            }
            return false;
        };
        _this.announceWithDebouncing = function (message) {
            Utils_Accessibility.announce(message, false, 300);
        };
        _this.state = {};
        _this.selection = props.selection || new DropdownMultiSelection();
        _this.wrappedItems = wrapListBoxItems(props.items);
        _this.activeFilter = props.activeFilter || new ObservableValue(null);
        return _this;
    }
    Filter.prototype.focus = function () {
        if (this.dropdown.current) {
            this.dropdown.current.focus();
        }
    };
    Filter.prototype.componentDidMount = function () {
        this.props.filterStore && this.props.filterStore.subscribe(this.onFilterChanged, FILTER_CHANGE_EVENT);
        this.onFilterChanged(this.props.filterStore.getState());
        this.announceWithDebouncing = this.timerManagement.debounce(this.announceWithDebouncing, 300);
    };
    Filter.prototype.componentWillUnmount = function () {
        this.props.filterStore && this.props.filterStore.unsubscribe(this.onFilterChanged, FILTER_CHANGE_EVENT);
    };
    Filter.prototype.render = function () {
        var _this = this;
        var _a = this.props, filterStore = _a.filterStore, showActiveFilterResetButton = _a.showActiveFilterResetButton, showFilterOnText = _a.showFilterOnText;
        var filterOn = showFilterOnText !== false && this.filtered();
        return (React.createElement(UncheckedObserver, { activeFilter: this.activeFilter, filter: filterStore },
            React.createElement(SelectionObserver, { selection: this.selection, onSelectionChanged: this.onSelectionChanged }, function () {
                var activeFilter = _this.activeFilter.value;
                var actions = [];
                var activeFilterSelectionCount = 0;
                var resetAction = {
                    className: "bolt-filter-reset-button",
                    text: !activeFilter ? Resources.ResetAll : Resources.Reset,
                    subtle: false,
                    onClick: !activeFilter ? _this.onResetClick : function () { return _this.onResetFilterItemClick(activeFilter.filterItemKey); },
                    id: "filter-reset-button"
                };
                if (activeFilter) {
                    var filterItemState = filterStore.getFilterItemState(activeFilter.filterItemKey);
                    activeFilterSelectionCount = _this.getSelectedFilterItems(activeFilter).length;
                    if (showActiveFilterResetButton) {
                        if (filterStore.hasChangesToReset()) {
                            actions.push(resetAction);
                        }
                    }
                    else {
                        actions.push({
                            text: Resources.Clear,
                            disabled: !(filterItemState && filterItemState.value),
                            subtle: false,
                            onClick: _this.clearFilterSelection,
                            id: "filter-clear-button"
                        });
                    }
                    if (filterStore.usesApplyMode()) {
                        actions.push({
                            className: css(!showActiveFilterResetButton && "bolt-filter-apply-button"),
                            disabled: !filterStore.hasChangesToApply(),
                            text: Resources.Apply,
                            primary: true,
                            subtle: false,
                            onClick: _this.onApplyClick,
                            id: "filter-apply-button"
                        });
                    }
                }
                else {
                    if (filterStore.hasChangesToReset()) {
                        actions.push(resetAction);
                    }
                    if (filterStore.usesApplyMode()) {
                        actions.push({
                            disabled: !filterStore.hasChangesToApply(),
                            text: Resources.Apply,
                            primary: true,
                            subtle: false,
                            onClick: _this.onDoneClick,
                            id: "filter-done-button"
                        });
                    }
                }
                return (React.createElement(ScreenSizeObserver, null, function (screenSizeProps) {
                    var fullscreen = screenSizeProps.screenSize === ScreenSize.xsmall;
                    return (React.createElement(Dropdown, { actions: actions, calloutContentClassName: css("bolt-filter-callout", activeFilter && "bolt-active-filter", fullscreen && "absolute-fill"), className: css(_this.props.className, "bolt-filter", filterOn && "bolt-filter-on"), dismissOnSelect: false, enforceSingleSelect: activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.enforceSingleSelect, filterByText: _this.props.filterByText, onExpand: _this.onExpandClick, onCollapse: function () { return _this.clearActiveFilter(true); }, placeholder: filterOn ? Resources.FilterOn : Resources.Filter, ref: _this.dropdown, items: _this.props.items, userFilteredItems: activeFilter ? (_this.props.userFilteredItems ? _this.props.userFilteredItems : activeFilter.items) : [], renderExpandable: function (props) { return (React.createElement(DropdownExpandableButton, __assign({}, props, { iconProps: { iconName: "Filter" }, hideDropdownIcon: true, renderSelectedItems: _this.renderSelectedItems }))); }, renderCallout: function (props) { return (React.createElement(DropdownCalloutComponent, __assign({}, props, { ariaLabel: _this.props.title || Resources.FilterTitle, anchorElement: fullscreen ? undefined : props.anchorElement, anchorOrigin: { horizontal: Location.start, vertical: Location.end }, blurDismiss: !fullscreen, containerClassName: "bolt-filter-listbox-container", contentLocation: fullscreen ? ContentLocation.Center : undefined, dropdownOrigin: { horizontal: Location.start, vertical: Location.start }, enforceSingleSelect: activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.enforceSingleSelect, filterText: _this.filterText, ignoreMouseDown: true, key: activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.id, onFilterTextChanged: _this.getOnFilterTextChanged(props), onFilterKeyDown: function (event) {
                                if (event &&
                                    !event.defaultPrevented &&
                                    event.which === KeyCode.enter &&
                                    _this.props.filterItems.some(function (filterItem) { return filterItem.id === "keyword-item"; }) &&
                                    _this.filterText.value.length > 0) {
                                    filterStore.setFilterItemState("keyword", { value: _this.filterText.value });
                                    _this.filterText.value = "";
                                }
                            }, showCloseButton: true, title: activeFilter ? (React.createElement("div", { className: "flex-row flex-center bolt-filter-title-container" },
                                !_this.props.hideBackButton && (React.createElement(Button, { ariaLabel: Resources.Back, subtle: true, className: "bolt-dropdown-header-button bolt-filter-back-button", iconProps: { iconName: "Back" }, onClick: function () { return _this.clearActiveFilter(); }, tabIndex: -1 })),
                                activeFilter.title || activeFilter.name,
                                activeFilterSelectionCount > 1 && (React.createElement(Pill, { className: "bolt-filter-selection-pill", size: PillSize.compact }, activeFilterSelectionCount)))) : (_this.props.title || Resources.FilterTitle), renderBeforeContent: _this.renderBeforeContent, ref: _this.dropdownCallout }))); }, selection: _this.selection, showFilterBox: activeFilter ? !(activeFilter.showFilterBox === false) : true, width: fullscreen ? -1 : _this.props.width }));
                }));
            })));
    };
    Filter.defaultProps = {
        width: FilterCalloutWidth
    };
    return Filter;
}(React.Component));
export { Filter };
export function getKeywordFilterItem(filter, throttle, items) {
    if (items === void 0) { items = []; }
    var filterItemKey = "keyword";
    var timerManagement = new TimerManagement();
    var updateFilterState = function (newValue) {
        filter.setFilterItemState(filterItemKey, { value: newValue });
        if (!filter.usesApplyMode()) {
            filter.applyChanges();
        }
    };
    var throttledUpdateFilterState = throttle
        ? timerManagement.debounce(updateFilterState, throttle, { leading: false, trailing: true })
        : updateFilterState;
    return {
        items: items,
        renderBeforeContent: function (onEditingComplete) {
            var value = new ObservableValue("");
            var filterState = filter.getFilterItemState(filterItemKey);
            value.value = filterState && filterState.value ? filterState.value : "";
            return (React.createElement(Observer, { filterExpression: {
                    observableValue: filter,
                    filter: function () {
                        var filterState = filter.getFilterItemState(filterItemKey);
                        value.value = filterState && filterState.value ? filterState.value : "";
                    }
                } }, function () {
                return (React.createElement(TextField, { ariaLabel: Resources.Keyword, placeholder: Resources.SearchKeyword, autoFocus: true, className: "bolt-filter-keyword-item", value: value, onChange: function (e, newValue) {
                        value.value = newValue;
                        throttledUpdateFilterState(newValue);
                    }, onKeyDown: function (event) {
                        if (event.which === KeyCode.enter) {
                            onEditingComplete();
                            event.preventDefault();
                        }
                    } }));
            }));
        },
        renderSelectedItems: function () {
            var filterState = filter.getFilterItemState(filterItemKey);
            return filterState && filterState.value ? React.createElement("span", null, "\"" + filterState.value + "\"") : null;
        },
        enforceSingleSelect: true,
        id: "keyword-item",
        filterItemKey: filterItemKey,
        name: Resources.Keyword,
        showFilterBox: false
    };
}
export function getKeywordSearchResults(filterText) {
    var items = [];
    items.push({ id: "keyword-header", text: Resources.Keyword, type: ListBoxItemType.Header, className: "bolt-filtered-header" });
    items.push({ id: filterText, text: format(Resources.KeywordSearchResult, filterText), groupId: "keyword-item" });
    return items;
}
export function renderSelectedFilterItems(selectedItems) {
    var hasIcons = selectedItems.some(function (selectedItem) { return !!selectedItem.iconProps; });
    return (React.createElement(React.Fragment, null, selectedItems.map(function (selectedItem, index) {
        return (React.createElement("div", { className: css("bolt-filter-selected-item flex-row", !hasIcons && "bolt-filter-selected-text-item"), key: selectedItem.id },
            renderListCell(selectedItem),
            !hasIcons && index !== selectedItems.length - 1 && React.createElement("span", null, ", ")));
    })));
}
