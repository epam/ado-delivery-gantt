import { __extends, __spreadArrays } from "tslib";
import { Selection } from '../../Utilities/Selection';
var ListSelection = /** @class */ (function (_super) {
    __extends(ListSelection, _super);
    function ListSelection(options) {
        var _this = _super.call(this, typeof options === "boolean" || options === undefined
            ? options
            : {
                alwaysMerge: options.alwaysMerge,
                multiSelect: options.multiSelect,
                unselectableRanges: options.unselectableRanges,
                selectedRanges: options.selectedRanges
            }) || this;
        _this.selectOnFocus = true;
        if (typeof options !== "boolean" && options !== undefined) {
            _this.selectOnFocus = options.selectOnFocus === undefined ? true : options.selectOnFocus;
        }
        return _this;
    }
    return ListSelection;
}(Selection));
export { ListSelection };
var FilteredListSelection = /** @class */ (function (_super) {
    __extends(FilteredListSelection, _super);
    function FilteredListSelection(selection) {
        var _this = _super.call(this, {
            alwaysMerge: selection.alwaysMerge,
            multiSelect: selection.multiSelect,
            unselectableRanges: selection.unselectableRanges,
            selectedRanges: selection.value,
            selectOnFocus: selection.selectOnFocus
        }) || this;
        _this.filteredIndexMap = [];
        _this.updateFilteredSelection = function (filteredIndexMap, multiSelect) {
            if (multiSelect === void 0) { multiSelect = _this.selection.multiSelect; }
            if (filteredIndexMap.length === 0) {
                _this.value = __spreadArrays(_this.selection.value);
                _this.unselectableRanges = __spreadArrays(_this.selection.unselectableRanges);
            }
            else {
                var newSelection_1 = new Selection(multiSelect);
                filteredIndexMap.map(function (mappedIndex, index) {
                    if (_this.selection.selected(mappedIndex)) {
                        newSelection_1.select(index, 1, true, multiSelect);
                    }
                    if (!_this.selection.selectable(mappedIndex)) {
                        newSelection_1.addUnselectable(index);
                    }
                });
                _this.value = __spreadArrays(newSelection_1.value);
                _this.unselectableRanges = __spreadArrays(newSelection_1.unselectableRanges);
            }
            _this.filteredIndexMap = filteredIndexMap;
        };
        _this.selectionChanged = function (value, action) {
            switch (action) {
                case "addUnselectable":
                    for (var rangeIndex = 0; rangeIndex < value.length; rangeIndex++) {
                        for (var unselectableIndex = value[rangeIndex].beginIndex; unselectableIndex <= value[rangeIndex].endIndex; unselectableIndex++) {
                            var index = _this.filteredIndexMap.length > 0 ? _this.filteredIndexMap.indexOf(unselectableIndex) : unselectableIndex;
                            if (_this.selectable(index)) {
                                _this.addUnselectable(index, 1);
                            }
                        }
                    }
                    break;
                case "removeUnselectable":
                    for (var rangeIndex = 0; rangeIndex < value.length; rangeIndex++) {
                        for (var unselectableIndex = value[rangeIndex].beginIndex; unselectableIndex <= value[rangeIndex].endIndex; unselectableIndex++) {
                            var index = _this.filteredIndexMap.length > 0 ? _this.filteredIndexMap.indexOf(unselectableIndex) : unselectableIndex;
                            if (!_this.selectable(index)) {
                                _this.removeUnselectable(index, 1);
                            }
                        }
                    }
                    break;
                case "setUnselectable":
                case "set":
                    _this.updateFilteredSelection(_this.filteredIndexMap);
                    break;
                case "select":
                    for (var rangeIndex = 0; rangeIndex < value.length; rangeIndex++) {
                        for (var selectionIndex = value[rangeIndex].beginIndex; selectionIndex <= value[rangeIndex].endIndex; selectionIndex++) {
                            var index = _this.filteredIndexMap.length > 0 ? _this.filteredIndexMap.indexOf(selectionIndex) : selectionIndex;
                            if (index > -1 && !_this.selected(index)) {
                                _this.select(index, 1, true);
                            }
                        }
                    }
                    break;
                case "unselect":
                    for (var rangeIndex = 0; rangeIndex < value.length; rangeIndex++) {
                        for (var selectionIndex = value[rangeIndex].beginIndex; selectionIndex <= value[rangeIndex].endIndex; selectionIndex++) {
                            var index = _this.filteredIndexMap.length > 0 ? _this.filteredIndexMap.indexOf(selectionIndex) : selectionIndex;
                            if (_this.selected(index)) {
                                _this.unselect(index, 1);
                            }
                        }
                    }
                    break;
            }
        };
        _this.selection = selection;
        return _this;
    }
    FilteredListSelection.prototype.select = function (index, count, merge, multiSelect) {
        _super.prototype.select.call(this, index, count, merge, multiSelect);
        if (this.filteredIndexMap.length > 0) {
            if (!merge) {
                this.clear();
            }
            count = count || 1;
            for (var i = 0; i < count; i++) {
                this.selection.select(this.filteredIndexMap[index + i], 1, true, multiSelect);
            }
        }
        else {
            this.selection.select(index, count, merge, multiSelect);
        }
    };
    FilteredListSelection.prototype.unselect = function (index, count) {
        _super.prototype.unselect.call(this, index, count);
        if (this.filteredIndexMap.length > 0) {
            count = count || 1;
            for (var i = 0; i < count; i++) {
                this.selection.unselect(this.filteredIndexMap[index + i], 1);
            }
        }
        else {
            this.selection.unselect(index, count);
        }
    };
    FilteredListSelection.prototype.clear = function () {
        _super.prototype.clear.call(this);
        if (this.filteredIndexMap.length > 0) {
            for (var i = 0; i < this.filteredIndexMap.length; i++) {
                this.selection.unselect(this.filteredIndexMap[i]);
            }
        }
        else {
            this.selection.clear();
        }
    };
    return FilteredListSelection;
}(ListSelection));
export { FilteredListSelection };
