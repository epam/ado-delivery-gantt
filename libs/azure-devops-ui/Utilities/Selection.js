import { __extends, __spreadArrays } from "tslib";
import { ObservableValue } from '../Core/Observable';
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection(options) {
        var _this = _super.call(this, []) || this;
        _this.selectedRanges = [];
        _this.lockCount = 0;
        _this.unselectableRangesValue = [];
        _this.selectedCount = 0;
        _this.unselectableCount = 0;
        _this.onItemsChanged = function (change, action) {
            var index = change.index;
            var removedUnselectableRange, unselectedRange;
            if (action === "change") {
                return;
            }
            // Unselect any items that were removed from the underlying item collection.
            if (change.removedItems && change.removedItems.length) {
                removedUnselectableRange = _this.removeUnselectableInternal(index, change.removedItems.length);
                unselectedRange = _this.unselectInternal(index, change.removedItems.length);
            }
            // Offset any selection by the items added.
            if (change.addedItems || change.removedItems) {
                var adjustCount = (change.addedItems ? change.addedItems.length : 0) - (change.removedItems ? change.removedItems.length : 0);
                var adjustedSelectionRanges = adjustRanges(index, adjustCount, _this.selectedRanges);
                var adjustedUnselectableRanges = adjustRanges(index, adjustCount, _this.unselectableRanges);
                if (adjustedSelectionRanges.length) {
                    _this.notify(adjustedSelectionRanges, "set");
                }
                if (adjustedUnselectableRanges.length) {
                    _this.notify(adjustedUnselectableRanges, "setUnselectable");
                }
            }
            if (removedUnselectableRange) {
                _this.notify([removedUnselectableRange], "removeUnselectable");
            }
            if (unselectedRange) {
                _this.notify([unselectedRange], "unselect");
            }
        };
        if (typeof options === "boolean" || options === undefined) {
            _this.multiSelect = !!options || false;
        }
        else {
            _this.alwaysMerge = !!options.alwaysMerge;
            _this.multiSelect = !!options.multiSelect;
            _this.unselectableRanges = options.unselectableRanges || [];
            _this.value = options.selectedRanges || [];
        }
        return _this;
    }
    Object.defineProperty(Selection.prototype, "value", {
        get: function () {
            return this.selectedRanges;
        },
        set: function (ranges) {
            var _this = this;
            this.selectedCount = 0;
            this.selectedRanges = ranges.map(function (range) {
                _this.selectedCount += range.endIndex - range.beginIndex + 1;
                return { beginIndex: range.beginIndex, endIndex: range.endIndex };
            });
            this.notify(ranges, "set");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "unselectableRanges", {
        get: function () {
            return this.unselectableRangesValue;
        },
        set: function (ranges) {
            var _this = this;
            this.unselectableCount = 0;
            this.unselectableRangesValue = ranges.map(function (range) {
                _this.unselectableCount += range.endIndex - range.beginIndex + 1;
                return { beginIndex: range.beginIndex, endIndex: range.endIndex };
            });
            this.notify(ranges, "setUnselectable");
        },
        enumerable: false,
        configurable: true
    });
    Selection.prototype.clear = function () {
        var selectedRanges = this.clearSelectedRanges();
        if (selectedRanges) {
            // Go through and notify any observers of the change.
            this.notify(selectedRanges, "unselect");
        }
    };
    Selection.prototype.clearUnselectable = function () {
        var unselectableRanges = __spreadArrays(this.unselectableRangesValue);
        this.unselectableRanges = [];
        this.unselectableCount = 0;
        this.notify(unselectableRanges, "removeUnselectable");
    };
    Selection.prototype.selectable = function (index) {
        return !indexWithinRanges(index, this.unselectableRanges);
    };
    Selection.prototype.selected = function (index) {
        return indexWithinRanges(index, this.selectedRanges);
    };
    Selection.prototype.addUnselectable = function (index, count) {
        var updatedRanges = false;
        var beginIndex = index;
        var endIndex = index + (count || 1) - 1;
        // If no count is specified we will add a single item.
        count = count || 1;
        for (; count > 0; count--) {
            if (!this.selectable(index)) {
                index++;
                continue;
            }
            var rangeIndex = 0;
            var updatedRange = void 0;
            // Determine if there is a range we can add this unselectable item to.
            for (; rangeIndex < this.unselectableRanges.length; rangeIndex++) {
                var unselectableRange = this.unselectableRanges[rangeIndex];
                // Check if this unselectable item occurs before this unselectableRange.
                if (index < unselectableRange.beginIndex) {
                    if (index === unselectableRange.beginIndex - 1) {
                        updatedRange = unselectableRange;
                        updatedRange.beginIndex--;
                    }
                    break;
                }
                // If this index is directly after this range we will extend it.
                else if (index === unselectableRange.endIndex + 1) {
                    // If there is a gap of 1 number we will merge the two ranges.
                    if (rangeIndex < this.unselectableRanges.length - 1 && index === this.unselectableRanges[rangeIndex + 1].beginIndex - 1) {
                        updatedRange = unselectableRange;
                        updatedRange.endIndex = this.unselectableRanges[rangeIndex + 1].endIndex;
                        // Remove the second range since it is merged into the previous range.
                        this.unselectableRanges.splice(rangeIndex + 1, 1);
                    }
                    else {
                        updatedRange = unselectableRange;
                        updatedRange.endIndex++;
                    }
                    break;
                }
            }
            // If there was no range to merge with, add a new one.
            if (!updatedRange) {
                updatedRange = { beginIndex: index, endIndex: index };
                this.unselectableRanges.splice(rangeIndex, 0, updatedRange);
            }
            updatedRanges = true;
            this.unselectableCount++;
            index++;
        }
        // Notify observers of the added item.
        if (updatedRanges) {
            this.notify([{ beginIndex: beginIndex, endIndex: endIndex }], "addUnselectable");
        }
    };
    Selection.prototype.removeUnselectable = function (index, count) {
        var removedRange = this.removeUnselectableInternal(index, count);
        if (removedRange) {
            this.notify([removedRange], "removeUnselectable");
        }
    };
    Selection.prototype.select = function (index, count, merge, multiSelect) {
        if (merge === void 0) { merge = this.alwaysMerge; }
        if (multiSelect === void 0) { multiSelect = this.multiSelect; }
        if (!this.lockCount) {
            var beginIndex = index;
            var endIndex = beginIndex + (count || 1) - 1;
            var updatedRanges = false;
            var unselectedRanges = void 0;
            if (!multiSelect) {
                if (!this.selected(index) && this.selectable(index)) {
                    unselectedRanges = this.clearSelectedRanges();
                    var updatedRange = { beginIndex: index, endIndex: index };
                    this.selectedRanges.push(updatedRange);
                    this.selectedCount++;
                    updatedRanges = true;
                }
            }
            else {
                if (!merge) {
                    unselectedRanges = this.clearSelectedRanges();
                }
                // If no count is specified we will use a single item selection.
                count = count || 1;
                // @TODO: Implement a more optimal multi-count selection
                for (; count > 0; count--) {
                    if (this.selected(index) || !this.selectable(index)) {
                        index++;
                        continue;
                    }
                    var rangeIndex = 0;
                    var updatedRange = void 0;
                    // Determine if there is a range we can add this selection to.
                    for (; rangeIndex < this.selectedRanges.length; rangeIndex++) {
                        var selectionRange = this.selectedRanges[rangeIndex];
                        // Check if this selection occurs before this selectionRange.
                        if (index < selectionRange.beginIndex) {
                            if (index === selectionRange.beginIndex - 1) {
                                updatedRange = selectionRange;
                                updatedRange.beginIndex--;
                            }
                            break;
                        }
                        // If this index is directly after this range we will extend it.
                        else if (index === selectionRange.endIndex + 1) {
                            // If there is a gap of 1 number we will merge the two ranges.
                            if (rangeIndex < this.selectedRanges.length - 1 && index === this.selectedRanges[rangeIndex + 1].beginIndex - 1) {
                                updatedRange = selectionRange;
                                updatedRange.endIndex = this.selectedRanges[rangeIndex + 1].endIndex;
                                // Remove the second range since it is merged into the previous range.
                                this.selectedRanges.splice(rangeIndex + 1, 1);
                            }
                            else {
                                updatedRange = selectionRange;
                                updatedRange.endIndex++;
                            }
                            break;
                        }
                    }
                    // If there was no range to merge with, add a new one.
                    if (!updatedRange) {
                        updatedRange = { beginIndex: index, endIndex: index };
                        this.selectedRanges.splice(rangeIndex, 0, updatedRange);
                    }
                    this.selectedCount++;
                    index++;
                    updatedRanges = true;
                }
            }
            if (unselectedRanges) {
                this.notify(unselectedRanges, "unselect");
            }
            // Notify observers of the added selection.
            if (updatedRanges) {
                this.notify([{ beginIndex: beginIndex, endIndex: endIndex }], "select");
            }
        }
    };
    Selection.prototype.toggle = function (index, merge, multiSelect) {
        if (merge === void 0) { merge = this.alwaysMerge; }
        if (multiSelect === void 0) { multiSelect = this.multiSelect; }
        if (this.selected(index)) {
            this.unselect(index);
        }
        else {
            this.select(index, 1, merge, multiSelect);
        }
    };
    Selection.prototype.unselect = function (index, count) {
        var unselectedRange = this.unselectInternal(index, count);
        if (unselectedRange) {
            this.notify([unselectedRange], "unselect");
        }
    };
    Selection.prototype.lock = function () {
        this.lockCount++;
    };
    Selection.prototype.unlock = function () {
        this.lockCount--;
    };
    Selection.prototype.removeUnselectableInternal = function (index, count) {
        var beginIndex = index;
        var endIndex = beginIndex + (count || 1) - 1;
        var updatedRanges = false;
        // If no count is specified we will use a single item selection.
        count = count || 1;
        // @TODO: Implement a more optimal multi-count selection
        for (; count > 0; count--) {
            if (this.selectable(index)) {
                index++;
                continue;
            }
            // Determine the range we are unselecting the item from.
            for (var rangeIndex = 0; rangeIndex < this.unselectableRanges.length; rangeIndex++) {
                var unselectableRange = this.unselectableRanges[rangeIndex];
                // If this index if before this range move on to the next one.
                if (index < unselectableRange.beginIndex) {
                    continue;
                }
                // Determine whether or not this index falls into this range.
                if (index >= unselectableRange.beginIndex && index <= unselectableRange.endIndex) {
                    // If the index is on the start or end of the range, we will just shrink it.
                    // Otherwise we will have to split it.
                    if (index === unselectableRange.beginIndex) {
                        unselectableRange.beginIndex++;
                    }
                    else if (index === unselectableRange.endIndex) {
                        unselectableRange.endIndex--;
                    }
                    else {
                        this.unselectableRanges.splice(rangeIndex + 1, 0, {
                            beginIndex: index + 1,
                            endIndex: unselectableRange.endIndex
                        });
                        unselectableRange.endIndex = index - 1;
                    }
                    // Shrinking may have created an empty range, we need to remove it.
                    if (unselectableRange.beginIndex > unselectableRange.endIndex) {
                        this.unselectableRanges.splice(rangeIndex, 1);
                    }
                    this.unselectableCount--;
                    updatedRanges = true;
                    break;
                }
            }
            index++;
        }
        if (updatedRanges) {
            return { beginIndex: beginIndex, endIndex: endIndex };
        }
    };
    Selection.prototype.unselectInternal = function (index, count) {
        var updatedRanges = false;
        var beginIndex = index;
        var endIndex = beginIndex + (count || 1) - 1;
        if (!this.lockCount) {
            // If no count is specified we will use a single item selection.
            count = count || 1;
            // @TODO: Implement a more optimal multi-count selection
            for (; count > 0; count--) {
                if (!this.selected(index)) {
                    index++;
                    continue;
                }
                // Determine the range we are unselecting the item from.
                for (var rangeIndex = 0; rangeIndex < this.selectedRanges.length; rangeIndex++) {
                    var selectionRange = this.selectedRanges[rangeIndex];
                    // If this index if before this range move on to the next one.
                    if (index < selectionRange.beginIndex) {
                        continue;
                    }
                    // Determine whether or not this index falls into this range.
                    if (index >= selectionRange.beginIndex && index <= selectionRange.endIndex) {
                        // If the index is on the start or end of the range, we will just shrink it.
                        // Otherwise we will have to split it.
                        if (index === selectionRange.beginIndex) {
                            selectionRange.beginIndex++;
                        }
                        else if (index === selectionRange.endIndex) {
                            selectionRange.endIndex--;
                        }
                        else {
                            this.selectedRanges.splice(rangeIndex + 1, 0, {
                                beginIndex: index + 1,
                                endIndex: selectionRange.endIndex
                            });
                            selectionRange.endIndex = index - 1;
                        }
                        // Shrinking may have created an empty range, we need to remove it.
                        if (selectionRange.beginIndex > selectionRange.endIndex) {
                            this.selectedRanges.splice(rangeIndex, 1);
                        }
                        this.selectedCount--;
                        updatedRanges = true;
                        break;
                    }
                }
                index++;
            }
        }
        if (updatedRanges) {
            return { beginIndex: beginIndex, endIndex: endIndex };
        }
    };
    Selection.prototype.clearSelectedRanges = function () {
        if (!this.lockCount && this.selectedRanges.length > 0) {
            // Save the current selection ranges for notification.
            var selectedRanges = __spreadArrays(this.selectedRanges);
            // Reset the selection to an empty selection.
            this.selectedRanges = [];
            this.selectedCount = 0;
            return selectedRanges;
        }
    };
    return Selection;
}(ObservableValue));
export { Selection };
export function indexWithinRanges(index, ranges) {
    if (ranges) {
        for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
            var range = ranges_1[_i];
            if (index >= range.beginIndex && index <= range.endIndex) {
                return true;
            }
        }
    }
    return false;
}
function adjustRanges(index, adjustCount, ranges) {
    var adjustedRanges = [];
    for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
        var range = ranges[rangeIndex];
        // If the added items are before the range shift it down.
        if (index <= range.beginIndex) {
            // If this adjustment will create a continuous range with the previous range
            // we merge the ranges.
            if (rangeIndex > 0 && range.beginIndex + adjustCount === ranges[rangeIndex - 1].endIndex + 1) {
                ranges[rangeIndex - 1].endIndex = range.endIndex + adjustCount;
                ranges.splice(rangeIndex--, 1);
                adjustedRanges.push(ranges[rangeIndex]);
            }
            else {
                range.beginIndex += adjustCount;
                range.endIndex += adjustCount;
                adjustedRanges.push(range);
            }
        }
        else if (index > range.beginIndex && index <= range.endIndex) {
            // Create the new split selection range.
            var splitRange = {
                beginIndex: index + adjustCount,
                endIndex: range.endIndex + adjustCount
            };
            ranges.splice(++rangeIndex, 0, splitRange);
            adjustedRanges.push(splitRange);
            // If the added items are in the middle of range we need to split the range.
            range.endIndex = index - 1;
            adjustedRanges.push(range);
        }
    }
    return adjustedRanges;
}
/**
 * return an array describing the difference of two sets of selection ranges.  Postive values in the array are indices in second
 * that are not in first.  Negative values in the array are indices that are in first that are not in second.
 * @param firstRanges the first set of values to use in the comparison.
 * @param secondRanges the second set of values to use in the comparison.
 */
export function compareSelectionRanges(firstRanges, secondRanges) {
    var difference = [];
    for (var rangeIndex = 0; rangeIndex < firstRanges.length; rangeIndex++) {
        var range = firstRanges[rangeIndex];
        for (var selectionIndex = range.beginIndex; selectionIndex <= range.endIndex; selectionIndex++) {
            if (!indexWithinRanges(selectionIndex, secondRanges)) {
                difference.push(selectionIndex * -1);
            }
        }
    }
    for (var rangeIndex = 0; rangeIndex < secondRanges.length; rangeIndex++) {
        var range = secondRanges[rangeIndex];
        for (var selectionIndex = range.beginIndex; selectionIndex <= range.endIndex; selectionIndex++) {
            if (!indexWithinRanges(selectionIndex, firstRanges)) {
                difference.push(selectionIndex);
            }
        }
    }
    return difference;
}
