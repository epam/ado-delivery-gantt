import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { FilterBarItem } from '../../FilterBarItem';
import { ListSelection } from '../../List';
import { getListBoxItemsValue, wrapListBoxItems } from '../../ListBox';
import { Observer, SelectionObserver } from '../../Observer';
import * as Resources from '../../Resources.Dropdown';
import { css } from '../../Util';
import { updateFilterToSelection } from '../../Utilities/DropdownFilter';
import { DropdownSelection } from '../../Utilities/DropdownSelection';
import { compareSelectionRanges } from '../../Utilities/Selection';
import { Dropdown } from "./Dropdown";
import { DropdownExpandableButton } from "./DropdownExpandableButton";
import { ScreenSizeObserver } from '../../Utilities/ScreenSize';
import { ScreenSize } from '../../Core/Util/Screen';
var DropdownFilterBarItemWidth = 256;
var DropdownFilterBarItem = /** @class */ (function (_super) {
    __extends(DropdownFilterBarItem, _super);
    function DropdownFilterBarItem(props) {
        var _this = _super.call(this, props) || this;
        _this.dropdown = React.createRef();
        _this.componentDidMount = function () {
            var _a;
            _super.prototype.componentDidMount.call(_this);
            if (_this.props.filter) {
                var filterState = (_a = _this.props.filter) === null || _a === void 0 ? void 0 : _a.getFilterItemState(_this.props.filterItemKey);
                _this.onFilterChanged(filterState);
            }
        };
        _this.selectDefaultFilterItem = function () {
            if (_this.props.filter) {
                var filterState_1 = _this.props.filter.getFilterItemState(_this.props.filterItemKey);
                if (filterState_1 && filterState_1.value) {
                    var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
                    var newSelection = new ListSelection(_this.selection.multiSelect);
                    var _loop_1 = function (i) {
                        var index = items.findIndex(function (item) {
                            return item.id === filterState_1.value[i] ||
                                item.data === filterState_1.value[i] ||
                                JSON.stringify(item.data) === JSON.stringify(filterState_1.value[i]);
                        });
                        if (index > -1) {
                            newSelection.select(index, 1, true);
                        }
                    };
                    for (var i = 0; i < filterState_1.value.length; i++) {
                        _loop_1(i);
                    }
                    _this.selection.value = newSelection.value;
                }
            }
        };
        _this.onFilterChanged = function (filterState) {
            _super.prototype.onFilterChanged.call(_this, filterState);
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            if (filterState && filterState.value) {
                var newSelection = new ListSelection(_this.selection.multiSelect);
                var _loop_2 = function (i) {
                    var index = items.findIndex(function (item) {
                        return item.id === filterState.value[i] ||
                            item.data === filterState.value[i] ||
                            JSON.stringify(item.data) === JSON.stringify(filterState.value[i]);
                    });
                    if (index > -1) {
                        newSelection.select(index, 1, true);
                    }
                };
                for (var i = 0; i < filterState.value.length; i++) {
                    _loop_2(i);
                }
                var selectionDifference = compareSelectionRanges(_this.selection.value, newSelection.value);
                if (selectionDifference.length) {
                    _this.selection.value = newSelection.value;
                }
            }
            else {
                _this.selection.clear();
            }
        };
        _this.onSelectionChanged = function (values) {
            var items = getListBoxItemsValue(_this.wrappedItems || _this.props.items);
            if (_this.props.filter) {
                updateFilterToSelection(values, items, _this.props.filter, _this.props.filterItemKey);
            }
            return true;
        };
        _this.renderExpandableButton = function (expandableProps) {
            var _a = _this.props, className = _a.className, renderExpandable = _a.renderExpandable;
            var expandableButtonProps = __assign(__assign({}, expandableProps), { className: css(className, "bolt-dropdown-filter-bar-item"), subtle: true, renderSelectedItems: _this.renderSelectedItems });
            if (renderExpandable) {
                return renderExpandable(expandableButtonProps);
            }
            return React.createElement(DropdownExpandableButton, __assign({}, expandableButtonProps));
        };
        _this.onClearClick = function () {
            _this.selection.clear();
            _this.props.toggleFilterBar && _this.props.toggleFilterBar();
            Utils_Accessibility.announce(Resources.AnnounceFilterCleared);
        };
        _this.renderSelectedItems = function (selection, items) {
            var selectedText = items[selection.value[0].beginIndex].text || "";
            if (selection.selectedCount > 1) {
                selectedText = selectedText + " (+" + (selection.selectedCount - 1) + ")";
            }
            var selectedTextSpan = React.createElement("span", { className: "bolt-dropdown-filter-bar-item-selected-text" }, selectedText);
            return _this.props.showPlaceholderAsLabel ? (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "bolt-dropdown-filter-bar-item-placeholder" }, _this.props.placeholder + ": "),
                selectedTextSpan)) : (selectedTextSpan);
        };
        // string items are wrapped once here.  Only use a string array in the simple case where the items are not changing.
        _this.wrappedItems = wrapListBoxItems(props.items);
        _this.selection = props.selection || new DropdownSelection();
        // Select the default items from the filter.
        _this.selectDefaultFilterItem();
        return _this;
    }
    DropdownFilterBarItem.prototype.focus = function () {
        if (this.dropdown.current) {
            this.dropdown.current.focus();
        }
    };
    DropdownFilterBarItem.prototype.render = function () {
        var _this = this;
        return (React.createElement(SelectionObserver, { selection: this.selection, onSelectionChanged: this.onSelectionChanged }, function () {
            var actionsFromProps = ObservableLike.getValue(_this.props.actions || []);
            var actions = __spreadArrays(actionsFromProps);
            if (!_this.props.hideClearAction) {
                actions.push({
                    className: "bolt-dropdown-action-right-button",
                    disabled: _this.selection.selectedCount === 0,
                    iconProps: { iconName: "Clear" },
                    text: Resources.DropdownClearActionText,
                    onClick: _this.onClearClick
                });
            }
            return (React.createElement(Observer, { dropdownItems: { observableValue: _this.props.items, filter: _this.selectDefaultFilterItem } }, function () { return (React.createElement(ScreenSizeObserver, null, function (screenSizeProps) {
                var isXsmall = screenSizeProps.screenSize <= ScreenSize.xsmall;
                return (React.createElement(Dropdown, __assign({ width: isXsmall ? undefined : DropdownFilterBarItemWidth, renderExpandable: _this.renderExpandableButton }, _this.props, { actions: actions, selection: _this.selection, ref: _this.dropdown })));
            })); }));
        }));
    };
    return DropdownFilterBarItem;
}(FilterBarItem));
export { DropdownFilterBarItem };
