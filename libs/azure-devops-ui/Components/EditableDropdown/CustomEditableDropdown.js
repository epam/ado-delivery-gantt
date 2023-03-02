import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./EditableDropdown.css";
import * as React from "react";
import { ObservableArray, ObservableLike, ObservableValue } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { equals, startsWith } from '../../Core/Util/String';
import { Dropdown, DropdownCallout, DropdownExpandableTextField, filterItems } from '../../Dropdown';
import { isListBoxItemVisible, ListBoxItemType, renderListBoxCell } from '../../ListBox';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Dropdown';
import { css, KeyCode } from '../../Util';
import { DropdownSelection } from '../../Utilities/DropdownSelection';
import { EditableDropdownItemProvider } from '../../Utilities/EditableDropdownItemProvider';
import { filterTreeItems, renderHighlightedText } from "../Dropdown/Dropdown";
var CustomEditableDropdown = /** @class */ (function (_super) {
    __extends(CustomEditableDropdown, _super);
    function CustomEditableDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.dropdown = React.createRef();
        _this.listBox = React.createRef();
        _this.filteredIndexMap = new ObservableValue([]);
        _this.filterMatches = [];
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
        _this.renderItem = function (rowIndex, columnIndex, tableColumn, tableItem) {
            return _this.wrapWithFocusedIndexObserver(rowIndex, columnIndex, tableColumn, tableItem, function (rowIndex, columnIndex, tableColumn, tableItem) {
                var item = tableItem;
                var column = tableColumn;
                var filterMatches = _this.filterMatches[rowIndex];
                if (!item.render && filterMatches && filterMatches.length) {
                    item.render = function (rowIndex, columnIndex, tableColumn, tableItem) {
                        return renderHighlightedText(rowIndex, columnIndex, tableColumn, tableItem, filterMatches);
                    };
                }
                return _this.props.renderItem(rowIndex, columnIndex, column, item);
            });
        };
        _this.wrapWithFocusedIndexObserver = function (rowIndex, columnIndex, tableColumn, tableItem, render) {
            return (React.createElement(Observer, { focusedIndex: {
                    observableValue: _this.focusedIndex,
                    filter: function () {
                        var itemIndex = _this.filteredIndexMap.value[rowIndex];
                        return itemIndex === _this.focusedIndex.value || itemIndex === _this.previousFocusedIndex;
                    }
                }, key: "focused-observer-" + rowIndex + "-" + columnIndex }, function () {
                var _a;
                var item = _this.filteredIndexMap.value[rowIndex] === _this.focusedIndex.value &&
                    ((_a = tableItem) === null || _a === void 0 ? void 0 : _a.type) !== ListBoxItemType.Loading
                    ? __assign(__assign({}, tableItem), { className: css(tableItem.className, "bolt-editable-dropdown-focused-item") }) : __assign({}, tableItem);
                return render(rowIndex, columnIndex, tableColumn, item);
            }));
        };
        _this.onCollapse = function () {
            var _a, _b;
            var _c = _this.props, allowFreeform = _c.allowFreeform, autoAccept = _c.autoAccept, onCollapse = _c.onCollapse, onValueChange = _c.onValueChange, showTree = _c.showTree, text = _c.text;
            if (onCollapse) {
                onCollapse();
            }
            if (!_this.selectedItemInList) {
                var items = _this.itemProvider.value;
                // If the text matches an item in the list, select that item.
                var index = items.findIndex(function (item, index) { return _this.selection.selectable(index) && item.text === ObservableLike.getValue(text || ""); });
                if (index > -1) {
                    _this.selectIndex(index);
                }
            }
            var lastIndex = _this.itemProvider.length - 1;
            // If collapsing with the freeform item in the list, if the last value is selected or no value is selected, select the value in the textField.
            if (allowFreeform &&
                (!_this.selection.value.length || _this.selection.value[0].beginIndex === lastIndex || !_this.selectedItemInList) &&
                _this.itemProvider.hasExtraItem) {
                if (autoAccept || _this.selectedItemInList || _this.selectedFreeform) {
                    var selectedText = _this.itemProvider.value[lastIndex].id;
                    if (onValueChange) {
                        onValueChange({ id: selectedText, text: selectedText });
                    }
                }
                _this.selectedFreeform = false;
                _this.selection.clear();
            }
            else if (showTree && _this.lastSelectedItem) {
                // tree items may be collapsed, so selection index isn't guaranteed to be accurate
                if (onValueChange) {
                    onValueChange(_this.lastSelectedItem);
                }
            }
            else if (_this.selection.value.length) {
                var selectedItem = _this.itemProvider.value[_this.selection.value[0].beginIndex];
                if (onValueChange) {
                    onValueChange(selectedItem);
                }
            }
            // Clear the filter text, showing the selected item.
            (_b = (_a = _this.props).onTextChange) === null || _b === void 0 ? void 0 : _b.call(_a, null, "");
            _this.isExpanded = false;
            _this.selectedItemInList = false;
            _this.lastSelectedItem = undefined;
            if (showTree) {
                _this.focusedIndex.value = -1;
            }
        };
        _this.onItemsChange = function (value, action) {
            if (!_this.isExpanded) {
                return;
            }
            // Update the filtered set if items were added or removed.
            if (action !== "change") {
                _this.filterItems();
            }
            _this.selectSelectedTextItem();
        };
        _this.selectSelectedTextItem = function () {
            if (_this.props.selectedText) {
                var selectedText_1 = ObservableLike.getValue(_this.props.selectedText);
                if (selectedText_1) {
                    var selectedIndex = _this.itemProvider.value.findIndex(function (item) { return item.text === selectedText_1; });
                    if (selectedIndex > -1) {
                        _this.selection.select(selectedIndex);
                    }
                }
            }
        };
        _this.onSelect = function (event, item) {
            // Set to true when an explicit selection is made.  If false, it means a user is making a freeform selection by blurring.
            _this.selectedItemInList = true;
            _this.lastSelectedItem = item;
        };
        _this.renderExpandable = function (props) {
            return (React.createElement(Observer, { focusedIndex: _this.focusedIndex, selectedText: _this.props.selectedText, text: _this.props.text }, function (observerProps) {
                var _a, _b;
                var _c = _this.props, allowTextSelection = _c.allowTextSelection, inputId = _c.inputId;
                var selectedText = observerProps.selectedText, text = observerProps.text;
                var focusedIndex = _this.getFocusedIndex();
                var activeId;
                if (focusedIndex > -1 && _this.itemProvider.value[focusedIndex]) {
                    activeId = _this.itemProvider.value[focusedIndex].id;
                }
                var value = allowTextSelection && selectedText && !_this.isExpanded ? selectedText : text;
                var expandableProps = __assign(__assign({}, props), { ariaActiveDescendant: activeId, editable: true, showPrefix: text ? false : true, blurDismiss: true, inputId: inputId, onChange: _this.onTextChange, onKeyDown: _this.onKeyDown, value: value });
                return (_b = (_a = _this.props).renderExpandable) === null || _b === void 0 ? void 0 : _b.call(_a, expandableProps);
            }));
        };
        _this.renderCallout = function (props) {
            var calloutProps = __assign(__assign({}, props), { focusOnMount: false, excludeTabStop: true, excludeFocusZone: true, ignoreMouseDown: true, listBoxRef: _this.listBox });
            return _this.props.renderCallout(calloutProps);
        };
        _this.onExpand = function () {
            if (_this.props.onExpand) {
                _this.props.onExpand();
            }
            if (_this.props.filterItems) {
                var filterResult = _this.props.filterItems("", _this.itemProvider.value);
                var selectedIndex = _this.updateFilteredIndexMap(filterResult.filteredIndexMap);
                _this.filteredItems.value = filterResult.filteredItems;
                _this.focusItem(selectedIndex);
            }
            else {
                _this.filteredItems.value = _this.itemProvider.value;
                var focusedIndex = _this.updateFilteredIndexMap(_this.filteredItems.value.map(function (item, index) { return index; }));
                _this.focusItem(focusedIndex);
            }
            _this.isExpanded = true;
        };
        _this.onTextChange = function (event, text) {
            var _a, _b, _c, _d, _e, _f;
            (_b = (_a = _this.props).onTextChange) === null || _b === void 0 ? void 0 : _b.call(_a, event, text);
            if (_this.props.allowFreeform) {
                if (_this.itemProvider.hasExtraItem) {
                    // Remove the freeform item from the filtered set first so we don't
                    // get a warning that the filtered set is greater than the item set.
                    _this.filteredItems.pop();
                }
                _this.itemProvider.setTextValue(text);
            }
            else if (text === "" && _this.props.allowClear) {
                _this.selection.clear();
                (_d = (_c = _this.props).onValueChange) === null || _d === void 0 ? void 0 : _d.call(_c);
            }
            else {
                var selectedIndex = _this.itemProvider.value.findIndex(function (item) { return item.text === text; });
                if (selectedIndex > -1 && _this.selection.selectable(selectedIndex)) {
                    _this.selection.select(selectedIndex);
                    (_f = (_e = _this.props).onValueChange) === null || _f === void 0 ? void 0 : _f.call(_e, _this.itemProvider.value[selectedIndex]);
                }
            }
            if (_this.isExpanded) {
                _this.filterItems();
            }
            return false;
        };
        _this.filterItems = function () {
            var items = _this.itemProvider.value;
            var text = ObservableLike.getValue(_this.props.text || "");
            var filterResult;
            var firstMatchIndex;
            if (_this.props.filterItems) {
                filterResult = _this.props.filterItems(text, items);
            }
            else if (text) {
                if (_this.props.showTree) {
                    var _a = filterTreeItems(items, text, [], _this.props.filterItem, _this.props.filterMatchedItem), result = _a[0], firstIndex = _a[1];
                    filterResult = result;
                    firstMatchIndex = firstIndex;
                }
                else {
                    filterResult = filterItems(items, text, [], _this.props.filterItem);
                    // focus the first full or partial match in the list of filter results
                    firstMatchIndex = items.findIndex(function (item) { var _a; return equals((_a = item.text) !== null && _a !== void 0 ? _a : "", text, true); });
                    if (firstMatchIndex < 0) {
                        firstMatchIndex = items.findIndex(function (item) { var _a; return startsWith((_a = item.text) !== null && _a !== void 0 ? _a : "", text, true); });
                    }
                }
            }
            else {
                filterResult = {
                    filteredItems: items,
                    filteredIndexMap: items.map(function (item, index) { return index; }),
                    filterMatches: []
                };
            }
            _this.filterMatches = filterResult.filterMatches;
            var selectedIndex = _this.updateFilteredIndexMap(filterResult.filteredIndexMap);
            _this.filteredItems.value = filterResult.filteredItems;
            // if a tree is being filtered, we want to focus the first actual match in the list (as opposed to ancestor of that match)
            var indexToSelect = firstMatchIndex && firstMatchIndex > -1 ? firstMatchIndex : selectedIndex;
            _this.focusItem(indexToSelect);
        };
        _this.onKeyDown = function (ev) {
            var keyCode = ev.which;
            var initiallyExpanded = _this.isExpanded;
            switch (keyCode) {
                case KeyCode.escape:
                    if (_this.isExpanded) {
                        _this.collapse();
                        ev.preventDefault();
                    }
                    break;
                case KeyCode.enter:
                    if (!_this.isExpanded) {
                        _this.expand();
                        ev.preventDefault();
                    }
                case KeyCode.tab:
                    if (initiallyExpanded && !ev.shiftKey && (_this.filteredItems.length || _this.props.allowFreeform)) {
                        var focusedIndex = _this.getFocusedIndex();
                        if (focusedIndex >= 0) {
                            _this.selectIndex(focusedIndex);
                        }
                        else {
                            _this.selectedFreeform = true;
                        }
                        _this.collapse();
                        ev.preventDefault();
                    }
                    break;
                case KeyCode.upArrow:
                    if (_this.isExpanded) {
                        _this.focusPreviousItem();
                        if (_this.listBox.current) {
                            _this.listBox.current.scrollIntoView(_this.filteredIndexMap.value.indexOf(_this.focusedIndex.value), {
                                block: "nearest"
                            });
                        }
                    }
                    ev.preventDefault();
                    break;
                case KeyCode.rightArrow:
                    if (_this.isExpanded && _this.props.showTree) {
                        var focusedIndex = _this.getFocusedIndex();
                        var item = _this.itemProvider.value[focusedIndex];
                        if (!item.expanded) {
                            _this.props.onToggle && _this.props.onToggle(ev, item);
                            /** Kinda hacky but this is the only way to get the items to properly update */
                            _this.focusNextItem();
                            _this.focusPreviousItem();
                            if (_this.listBox.current) {
                                _this.listBox.current.scrollIntoView(_this.filteredIndexMap.value.indexOf(focusedIndex), {
                                    block: "nearest"
                                });
                            }
                        }
                    }
                    break;
                case KeyCode.downArrow:
                    if (_this.isExpanded) {
                        _this.focusNextItem();
                        if (_this.listBox.current) {
                            _this.listBox.current.scrollIntoView(_this.filteredIndexMap.value.indexOf(_this.focusedIndex.value), {
                                block: "nearest"
                            });
                        }
                    }
                    else if (!_this.isExpanded) {
                        _this.expand();
                    }
                    ev.preventDefault();
                    break;
                case KeyCode.leftArrow:
                    if (_this.isExpanded && _this.props.showTree) {
                        var focusedIndex = _this.getFocusedIndex();
                        var item = _this.itemProvider.value[focusedIndex];
                        if (item.expanded) {
                            _this.props.onToggle && _this.props.onToggle(ev, item);
                            /** Kinda hacky but this is the only way to get the items to properly update */
                            _this.focusPreviousItem();
                            _this.focusNextItem();
                            if (_this.listBox.current) {
                                _this.listBox.current.scrollIntoView(_this.filteredIndexMap.value.indexOf(focusedIndex), {
                                    block: "nearest"
                                });
                            }
                        }
                    }
                    break;
                case KeyCode.delete:
                case KeyCode.backspace:
                    if (_this.props.allowClear && !ObservableLike.getValue(_this.props.text || "")) {
                        _this.selection.clear();
                        if (_this.props.onValueChange) {
                            _this.props.onValueChange();
                        }
                    }
                    else {
                        _this.expand();
                    }
                    break;
                case KeyCode.ctrl:
                    // The Ctrl key is used for most screen readers to stop speech.
                    // Ignore Ctrl key down.
                    break;
                default:
                    _this.expand();
            }
        };
        _this.selection = props.selection || new DropdownSelection();
        _this.itemProvider = new EditableDropdownItemProvider(props.items, _this.selection);
        _this.filteredItems = new ObservableArray(__spreadArrays(_this.itemProvider.value));
        _this.focusedIndex = new ObservableValue(-1);
        _this.previousFocusedIndex = -1;
        _this.timerManagement = new TimerManagement();
        _this.filteredIndexMap.value = _this.itemProvider.value.map(function (item, index) { return index; });
        _this.selectSelectedTextItem();
        if (false && _this.selection.multiSelect) {
            console.warn("multiselect selection is being used, EditableDropdown does not support multiselect");
        }
        if (_this.props.columns) {
            // copy columns and wrap the render function of each column to get focus treatment
            _this.columns = _this.props.columns.map(function (col) {
                return __assign(__assign({}, col), { renderCell: function (rowIndex, columnIndex, treeColumn, treeItem) {
                        return _this.wrapWithFocusedIndexObserver(rowIndex, columnIndex, treeColumn, treeItem, col.renderCell);
                    } });
            });
        }
        return _this;
    }
    CustomEditableDropdown.prototype.render = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, allowTextSelection = _a.allowTextSelection, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, autoSelect = _a.autoSelect, calloutContentClassName = _a.calloutContentClassName, className = _a.className, disabled = _a.disabled, filterByText = _a.filterByText, getUnselectableRanges = _a.getUnselectableRanges, inputId = _a.inputId, noItemsText = _a.noItemsText, onToggle = _a.onToggle, selectedText = _a.selectedText, showTree = _a.showTree, text = _a.text, minCalloutWidth = _a.minCalloutWidth;
        return (React.createElement(Observer, { text: text, items: { observableValue: this.itemProvider, filter: this.onItemsChange }, selection: this.selection, selectedText: selectedText }, function (props) {
            var placeholder = _this.props.placeholder;
            if (!allowTextSelection) {
                if (props.selectedText) {
                    placeholder = props.selectedText;
                }
                else if (props.selection.length) {
                    var selectedIndex = props.selection[0].beginIndex;
                    if (selectedIndex > -1) {
                        placeholder = _this.itemProvider.value[selectedIndex].text;
                    }
                }
            }
            return (React.createElement(Dropdown, { ariaLabelledBy: ariaLabelledBy, actions: actions, ariaLabel: ariaLabel, autoSelect: autoSelect !== null && autoSelect !== void 0 ? autoSelect : false, calloutContentClassName: calloutContentClassName, className: css("bolt-editable-dropdown", (props.selection.length > 0 || !!props.selectedText) && "bolt-editable-dropdown-with-selection", className), columns: _this.columns, disabled: disabled, getUnselectableRanges: getUnselectableRanges, filterByText: filterByText, inputId: inputId, items: _this.itemProvider, noItemsText: noItemsText || Resources.NoItemsFound, onCollapse: _this.onCollapse, onExpand: _this.onExpand, onSelect: _this.onSelect, onToggle: onToggle, placeholder: placeholder, ref: _this.dropdown, renderCallout: _this.renderCallout, renderExpandable: _this.renderExpandable, renderItem: _this.renderItem, selection: _this.selection, showFilterBox: false, showTree: showTree, userFilteredItems: _this.filteredItems, userFilteredItemsIndexMap: _this.filteredIndexMap, minCalloutWidth: minCalloutWidth }));
        }));
    };
    CustomEditableDropdown.prototype.componentDidMount = function () {
        if (this.props.filterThrottleWait) {
            this.filterItems = this.timerManagement.debounce(this.filterItems, this.props.filterThrottleWait);
        }
    };
    CustomEditableDropdown.prototype.focus = function () {
        if (this.dropdown.current) {
            this.dropdown.current.focus();
        }
    };
    CustomEditableDropdown.prototype.selectIndex = function (index) {
        if (index > -1) {
            this.selection.select(index);
            this.selectedItemInList = true;
        }
    };
    CustomEditableDropdown.prototype.focusItem = function (index) {
        if (index !== undefined && index > -1 && this.isFocusable(index)) {
            this.previousFocusedIndex = this.focusedIndex.value;
            this.focusedIndex.value = index;
        }
    };
    CustomEditableDropdown.prototype.updateFilteredIndexMap = function (filteredIndexMap) {
        var _this = this;
        // Try to maintain the focused index relative to what's being filtered.
        var prevFilteredFocusedIndex = this.filteredIndexMap.value.indexOf(this.focusedIndex.value);
        this.filteredIndexMap.value = filteredIndexMap;
        var focusedIndex = filteredIndexMap[prevFilteredFocusedIndex];
        if (!focusedIndex ||
            focusedIndex < 0 ||
            !this.selection.selectable(focusedIndex) ||
            this.filteredIndexMap.value.indexOf(focusedIndex) === -1) {
            // If unable to maintain the focused index, focus the first selectable item.
            focusedIndex = !this.props.showTree ? this.filteredIndexMap.value.find(function (item) { return _this.selection.selectable(item); }) : -1;
        }
        return focusedIndex;
    };
    CustomEditableDropdown.prototype.focusNextItem = function () {
        var nextIndex;
        var filteredFocusedIndex = this.filteredIndexMap.value.indexOf(this.focusedIndex.value);
        for (var i = filteredFocusedIndex + 1; i < this.filteredIndexMap.value.length; i++) {
            if (this.selection.selectable(this.filteredIndexMap.value[i])) {
                nextIndex = this.filteredIndexMap.value[i];
                break;
            }
        }
        this.focusItem(nextIndex);
    };
    CustomEditableDropdown.prototype.focusPreviousItem = function () {
        var prevIndex;
        var filteredFocusedIndex = this.filteredIndexMap.value.indexOf(this.focusedIndex.value);
        for (var i = filteredFocusedIndex - 1; i >= 0; i--) {
            if (this.selection.selectable(this.filteredIndexMap.value[i])) {
                prevIndex = this.filteredIndexMap.value[i];
                break;
            }
        }
        this.focusItem(prevIndex);
    };
    CustomEditableDropdown.prototype.getFocusedIndex = function () {
        if (!this.props.showTree) {
            return this.focusedIndex.value;
        }
        // get the correct focusedIndex by increasing the current index by the number of collapsed rows that come before it
        var currentFocusedIndex = this.focusedIndex.value;
        for (var i = 0; i <= Math.min(currentFocusedIndex, this.itemProvider.value.length - 1); i++) {
            if (!isListBoxItemVisible(this.itemProvider.value[i])) {
                currentFocusedIndex++;
            }
        }
        return currentFocusedIndex;
    };
    CustomEditableDropdown.prototype.isFocusable = function (index) {
        if (!this.props.showTree) {
            return true;
        }
        var visibleItems = this.itemProvider.value.filter(function (item) { return isListBoxItemVisible(item); });
        return index < visibleItems.length;
    };
    CustomEditableDropdown.defaultProps = {
        allowClear: true,
        autoAccept: true,
        renderExpandable: DropdownExpandableTextField,
        renderCallout: DropdownCallout,
        renderItem: renderListBoxCell
    };
    return CustomEditableDropdown;
}(React.Component));
export { CustomEditableDropdown };
