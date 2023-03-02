import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ObservableArray, ObservableLike, ObservableValue } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { format } from '../../Core/Util/String';
import { FilteredListSelection, renderListCell } from '../../List';
import { getListBoxItemsValue, getUnselectableRanges, ListBoxItemType, wrapListBoxItems } from '../../ListBox';
import { ItemsObserver, Observer } from '../../Observer';
import * as Resources from '../../Resources.Dropdown';
import { SimpleTableCell } from '../../Table';
import { css } from '../../Util';
import { DropdownSelection } from '../../Utilities/DropdownSelection';
import { getItemsValue } from '../../Utilities/Provider';
import { DropdownCallout } from "./DropdownCallout";
import { DropdownExpandableTextField } from "./DropdownExpandableTextField";
var Dropdown = /** @class */ (function (_super) {
    __extends(Dropdown, _super);
    function Dropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.expandable = React.createRef();
        _this.expandableContainer = React.createRef();
        _this.filterText = new ObservableValue("");
        _this.collapse = function () {
            if (_this.expandable.current) {
                _this.expandable.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.expandable.current) {
                _this.expandable.current.expand();
            }
        };
        _this.onDismiss = function () {
            if (_this.expandable.current) {
                _this.expandable.current.collapse();
            }
        };
        _this.onExpand = function () {
            if (_this.props.onExpand) {
                _this.props.onExpand();
            }
            _this.updateFilteredItems();
            _this.state.expanded.value = true;
        };
        _this.onCollapse = function () {
            if (_this.props.onCollapse) {
                _this.props.onCollapse();
            }
            _this.state.expanded.value = false;
        };
        _this.onActivate = function (event, item) {
            if (!event.defaultPrevented && event.type === "keydown") {
                var multiSelect = _this.props.enforceSingleSelect ? false : _this.state.filteredSelection.multiSelect;
                if (multiSelect) {
                    _this.state.filteredSelection.toggle(_this.state.filteredItems.value.indexOf(item), _this.state.filteredSelection.alwaysMerge, multiSelect);
                }
                else {
                    _this.state.filteredSelection.select(_this.state.filteredItems.value.indexOf(item), 1, _this.state.filteredSelection.alwaysMerge, multiSelect);
                }
                _this.onSelect(event, item);
            }
        };
        _this.onFilterTextChanged = function (e, newValue) {
            _this.filterText.value = newValue;
            _this.debouncedUpdateFilteredItems();
        };
        _this.onSelect = function (event, item) {
            var _a = _this.props, dismissOnSelect = _a.dismissOnSelect, onSelect = _a.onSelect;
            var selection = _this.parentSelection;
            if (onSelect) {
                onSelect(event, item);
            }
            if (dismissOnSelect !== undefined
                ? dismissOnSelect
                : selection.value.length > 0 && !(_this.props.enforceSingleSelect ? false : selection.multiSelect) && !selection.selectOnFocus) {
                _this.onDismiss();
            }
        };
        _this.selectionChanged = function (value, action) {
            _this.state.filteredSelection.selectionChanged(value, action);
            return true;
        };
        _this.renderCallout = function (dropdown, dropdownId, anchorElement, anchorOffset, anchorOrigin, anchorPoint, dropdownOrigin) {
            var _a;
            var _b = _this.props, actions = _b.actions, calloutContentClassName = _b.calloutContentClassName, columns = _b.columns, containerClassName = _b.containerClassName, filterPlaceholderText = _b.filterPlaceholderText, filteredNoResultsText = _b.filteredNoResultsText, getUnselectableRanges = _b.getUnselectableRanges, items = _b.items, loading = _b.loading, noItemsText = _b.noItemsText, onToggle = _b.onToggle, renderItem = _b.renderItem, renderBeforeContent = _b.renderBeforeContent, searching = _b.searching, showFilterBox = _b.showFilterBox, showItemsWhileSearching = _b.showItemsWhileSearching, showTree = _b.showTree, userFilteredItems = _b.userFilteredItems;
            var width = _this.props.width;
            if (width === undefined && _this.expandableContainer.current) {
                var minWidth = (_a = _this.props.minCalloutWidth) !== null && _a !== void 0 ? _a : 100;
                width = Math.max(_this.expandableContainer.current.clientWidth, minWidth);
            }
            var _c = _this.state, filteredItems = _c.filteredItems, filterText = _c.filterText, filteredSelection = _c.filteredSelection;
            var calloutProps = {
                actions: actions,
                anchorElement: anchorElement,
                anchorOffset: anchorOffset,
                anchorOrigin: anchorOrigin,
                anchorPoint: anchorPoint,
                calloutContentClassName: calloutContentClassName,
                columns: columns,
                containerClassName: containerClassName,
                dropdownOrigin: dropdownOrigin,
                filteredItems: filteredItems,
                filteredNoResultsText: filteredNoResultsText,
                selection: filteredSelection,
                filterPlaceholderText: filterPlaceholderText,
                filterText: filterText,
                getUnselectableRanges: getUnselectableRanges,
                id: dropdownId,
                items: items,
                loading: loading,
                noItemsText: noItemsText,
                onActivate: _this.onActivate,
                onFilterTextChanged: _this.onFilterTextChanged,
                onDismiss: _this.onDismiss,
                onSelect: _this.onSelect,
                onToggle: onToggle,
                renderBeforeContent: renderBeforeContent,
                renderItem: renderItem,
                searching: searching,
                showItemsWhileSearching: showItemsWhileSearching,
                showFilterBox: showFilterBox,
                showTree: showTree,
                updateFilteredItems: _this.updateFilteredItems,
                userFilteredItems: userFilteredItems,
                width: width
            };
            return _this.props.renderCallout(calloutProps);
        };
        _this.updateFilteredItems = function () {
            updateFilteredItems(_this.props, _this.state);
            return true;
        };
        _this.debouncedUpdateFilteredItems = function () {
            updateFilteredItems(_this.props, _this.state);
        };
        _this.parentSelection = props.selection || new DropdownSelection();
        // string items are wrapped once here.  Only use a string array in the simple case where the items are not changing.
        var wrappedItems = wrapListBoxItems(props.items);
        var itemsValue = getListBoxItemsValue(wrappedItems || props.items);
        _this.timerManagement = new TimerManagement();
        _this.state = {
            expanded: new ObservableValue(false),
            filteredItems: new ObservableArray(__spreadArrays(itemsValue)),
            filteredSelection: new FilteredListSelection(_this.parentSelection),
            filterText: _this.filterText,
            props: props,
            wrappedItems: wrappedItems
        };
        return _this;
    }
    Dropdown.getDerivedStateFromProps = function (props, state) {
        if (props.userFilteredItems !== state.props.userFilteredItems || props.items !== state.props.items) {
            updateFilteredItems(props, state);
        }
        return __assign(__assign({}, state), { props: props, wrappedItems: wrapListBoxItems(props.items) });
    };
    Dropdown.prototype.componentDidMount = function () {
        if (this.props.filterThrottleWait) {
            this.debouncedUpdateFilteredItems = this.timerManagement.debounce(this.debouncedUpdateFilteredItems, this.props.filterThrottleWait);
        }
    };
    Dropdown.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, autoSelect = _a.autoSelect, className = _a.className, disabled = _a.disabled, enforceSingleSelect = _a.enforceSingleSelect, excludeTabStop = _a.excludeTabStop, inputId = _a.inputId, items = _a.items, placeholder = _a.placeholder, renderExpandable = _a.renderExpandable, renderSelectedItems = _a.renderSelectedItems, showPrefix = _a.showPrefix, required = _a.required;
        var selectionObservable = { observableValue: this.parentSelection, filter: this.selectionChanged };
        return (React.createElement(ItemsObserver, { getUnselectableRanges: this.props.getUnselectableRanges, items: items, selection: this.parentSelection },
            React.createElement(Observer, { selection: selectionObservable }, function () {
                return renderExpandable({
                    ariaLabel: ariaLabel,
                    ariaLabelledBy: ariaLabelledBy,
                    autoSelect: autoSelect,
                    className: css(className, "bolt-dropdown-expandable"),
                    containerRef: _this.expandableContainer,
                    disabled: disabled,
                    enforceSingleSelect: enforceSingleSelect,
                    excludeTabStop: excludeTabStop,
                    inputId: inputId,
                    placeholder: placeholder,
                    onCollapse: _this.onCollapse,
                    onExpand: _this.onExpand,
                    expandableRef: _this.expandable,
                    renderCallout: _this.renderCallout,
                    items: getListBoxItemsValue(_this.state.wrappedItems || items),
                    renderSelectedItems: renderSelectedItems,
                    selection: _this.parentSelection,
                    showPrefix: showPrefix,
                    required: required
                });
            })));
    };
    Dropdown.prototype.focus = function () {
        if (this.expandable.current) {
            this.expandable.current.focus();
        }
    };
    Dropdown.defaultProps = {
        filterByText: true,
        filterItem: filterItemByText,
        getUnselectableRanges: getUnselectableRanges,
        renderCallout: DropdownCallout,
        renderExpandable: DropdownExpandableTextField,
        renderSelectedItems: renderDropdownSelectedItemText
    };
    return Dropdown;
}(React.Component));
export { Dropdown };
export function filterItemByText(filterText, item) {
    if (item.text && item.type !== ListBoxItemType.Header && item.type !== ListBoxItemType.Divider && item.type !== ListBoxItemType.Loading) {
        return item.text.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
    }
    return false;
}
export function renderDropdownSelectedItemText(selection, items) {
    var firstSelectedItem = items[selection.value[0].beginIndex];
    var text = (firstSelectedItem && firstSelectedItem.text) || "";
    if (selection.selectedCount > 1) {
        text = text + " (+" + (selection.selectedCount - 1) + ")";
    }
    return text;
}
function updateFilteredItems(props, state) {
    var filteredSelection = state.filteredSelection, filterText = state.filterText;
    var filteredIndexMap = [];
    var items = getListBoxItemsValue(state.wrappedItems || props.items);
    var filteredItems = items;
    if (props.userFilteredItems) {
        filteredItems = getItemsValue(props.userFilteredItems);
        var userFilteredItemsIndexMap = props.userFilteredItemsIndexMap && props.userFilteredItemsIndexMap.value;
        if (userFilteredItemsIndexMap) {
            filteredIndexMap = userFilteredItemsIndexMap;
        }
        else {
            var _loop_1 = function (filteredIndex) {
                var index = items.findIndex(function (listItem) { return listItem.id === filteredItems[filteredIndex].id; });
                if (false) {
                    if (index === -1) {
                        console.error("filteredItems contains an item not in items. " +
                            "Selection cannot be maintained unless filteredItems is a subset of items. " +
                            "Check item in filteredItems at index " +
                            filteredIndex);
                    }
                }
                filteredIndexMap.push(index);
            };
            for (var filteredIndex = 0; filteredIndex < props.userFilteredItems.length; filteredIndex++) {
                _loop_1(filteredIndex);
            }
        }
    }
    if (props.filterByText && filterText.value) {
        var filterItemsResults = filterItems(filteredItems, filterText.value, filteredIndexMap, props.filterItem);
        filteredItems = filterItemsResults.filteredItems;
        filteredIndexMap = filterItemsResults.filteredIndexMap;
    }
    // Remove the first item if it's a divider
    while (filteredItems.length && filteredItems[0].type === ListBoxItemType.Divider) {
        filteredItems.shift();
        filteredIndexMap.shift();
    }
    if (!ObservableLike.getValue(props.searching) && !ObservableLike.getValue(props.loading) && state.expanded.value) {
        if (filterText.value) {
            var noResultsText = Resources.NoFilterResults;
            if (props.filteredNoResultsText) {
                noResultsText = ObservableLike.getValue(props.filteredNoResultsText);
            }
            Utils_Accessibility.announce(filteredItems.length > 0 ? format(Resources.AnnounceFilterResultCount, filteredItems.length) : noResultsText, true);
        }
        else if (filteredItems.length === 0 && props.noItemsText) {
            Utils_Accessibility.announce(props.noItemsText, true);
        }
        else if (filteredItems.length > 0) {
            Utils_Accessibility.announce(format(Resources.AnnounceItemCount, filteredItems.length));
        }
    }
    filteredSelection.updateFilteredSelection(filteredIndexMap, props.enforceSingleSelect ? false : undefined);
    state.filteredItems.value = filteredItems;
    return true;
}
export function filterItems(items, filterTextValue, currentFilteredIndexMap, filterItem) {
    if (currentFilteredIndexMap === void 0) { currentFilteredIndexMap = []; }
    if (filterItem === void 0) { filterItem = filterItemByText; }
    var filteredItems = [];
    var filteredIndexMap = [];
    var filterMatches = [];
    if (filterTextValue) {
        var lastHeader = void 0;
        var lastHeaderIndex = -1;
        var lastDivider = void 0;
        var lastDividerIndex = -1;
        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];
            var itemIndex = currentFilteredIndexMap.length ? currentFilteredIndexMap[i] : i;
            // Add Dividers and Headers only if they have an item from their group showing.
            if (item.type === ListBoxItemType.Header) {
                lastHeader = item;
                lastHeaderIndex = itemIndex;
            }
            else if (item.type === ListBoxItemType.Divider) {
                lastDivider = item;
                lastDividerIndex = itemIndex;
            }
            else {
                var filterResults = filterItem(filterTextValue, item, items);
                if (filterResults || item.type === ListBoxItemType.Loading) {
                    // Add any divider, then header for this group
                    if (lastDivider && lastDivider.groupId === item.groupId) {
                        filteredItems.push(lastDivider);
                        filteredIndexMap.push(lastDividerIndex);
                        lastDivider = undefined;
                    }
                    if (lastHeader && lastHeader.groupId === item.groupId) {
                        filteredItems.push(lastHeader);
                        filteredIndexMap.push(lastHeaderIndex);
                        lastHeader = undefined;
                    }
                    filteredItems.push(item);
                    filteredIndexMap.push(itemIndex);
                    filterMatches.push(Array.isArray(filterResults) ? filterResults : []);
                }
            }
        }
    }
    return { filteredItems: filteredItems, filteredIndexMap: filteredIndexMap, filterMatches: filterMatches };
}
/**
 * Filter the tree of items using user-entered text. Include all items with text matching
 * the filter and all their predecessors and descendants in the tree.
 * @returns items matching filter and all their predecessors and descendants in the tree, and the index of the first actual match (since we're returning predecessors)
 */
export function filterTreeItems(items, filterText, currentFilteredIndexMap, filterItem, filterMatchedItem) {
    if (currentFilteredIndexMap === void 0) { currentFilteredIndexMap = []; }
    if (filterItem === void 0) { filterItem = filterItemByText; }
    if (filterMatchedItem === void 0) { filterMatchedItem = filterMatchedItemByListboxType; }
    var filterResults = filterItems(items, filterText, currentFilteredIndexMap, filterItem);
    var filteredIndexes = filterResults.filteredIndexMap;
    // find the index of the first actual match to allow calling code to focus it
    var firstMatch = filterResults.filteredItems.find(filterMatchedItem);
    // reconstruct the list of filtered items, adding in descendants of filtered items
    var indexMap = {};
    for (var _i = 0, filteredIndexes_1 = filteredIndexes; _i < filteredIndexes_1.length; _i++) {
        var index = filteredIndexes_1[_i];
        var item = items[index];
        var parent_1 = item.parent;
        while (parent_1) {
            var parentIndex = items.indexOf(parent_1);
            indexMap[parentIndex] = parent_1;
            parent_1.expanded = true;
            parent_1 = parent_1.parent;
        }
        indexMap[index] = item;
    }
    var filteredIndexMap = [];
    var filteredItems = [];
    for (var _a = 0, _b = Object.keys(indexMap); _a < _b.length; _a++) {
        var indexStr = _b[_a];
        var index = Number(indexStr);
        var value = indexMap[index];
        filteredIndexMap.push(index);
        filteredItems.push(value);
    }
    var firstMatchIndex = firstMatch ? items.indexOf(firstMatch) : -1;
    return [{ filteredIndexMap: filteredIndexMap, filteredItems: filteredItems, filterMatches: [] }, firstMatchIndex];
}
export function filterMatchedItemByListboxType(item) {
    return !item.type || item.type === ListBoxItemType.Row;
}
export function renderHighlightedText(rowIndex, columnIndex, tableColumn, tableItem, filterResults) {
    var item = tableItem;
    if (filterResults && tableItem.text) {
        item = __assign(__assign({}, tableItem), { textNode: getHighlightedText(tableItem.text, filterResults) });
    }
    return (React.createElement(SimpleTableCell, { className: css(tableColumn.className, tableItem.className, tableItem.type === ListBoxItemType.Header && "bolt-list-box-header"), columnIndex: columnIndex, key: columnIndex, tableColumn: tableColumn },
        React.createElement("div", { id: tableItem.type === ListBoxItemType.Header ? "header-" + tableItem.id : undefined, "aria-label": tableItem.type === ListBoxItemType.Header ? format(Resources.HeaderAriaLabel, tableItem.text) : undefined }, renderListCell(item))));
}
export function getHighlightedText(text, matchingIndices, className) {
    var splitText = [];
    var splitTextIndex = -1;
    // Split text into bold and non-bold sections
    for (var i = 0; i < text.length; i++) {
        if (matchingIndices.indexOf(i) !== -1) {
            if (splitText && splitText[splitText.length - 1] && splitText[splitText.length - 1].bold) {
                splitText[splitTextIndex].text += text.charAt(i);
            }
            else {
                splitText[++splitTextIndex] = { text: text.charAt(i), bold: true };
            }
        }
        else {
            if (splitText && splitText[splitText.length - 1] && !splitText[splitText.length - 1].bold) {
                splitText[splitTextIndex].text += text.charAt(i);
            }
            else {
                splitText[++splitTextIndex] = { text: text.charAt(i), bold: false };
            }
        }
    }
    var formattedText = [];
    for (var i = 0; i < splitText.length; i++) {
        var substring = splitText[i];
        substring.bold
            ? formattedText.push(React.createElement("span", { className: "font-weight-heavy", key: text + "-" + i }, substring.text))
            : formattedText.push(substring.text);
    }
    return React.createElement("span", { className: className }, formattedText);
}
