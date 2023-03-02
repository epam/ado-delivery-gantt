import { __spreadArrays } from "tslib";
import { ObservableArray } from '../Core/Observable';
import { ListBoxItemType } from '../ListBox';
var GroupedItemProvider = /** @class */ (function () {
    /**
     * Create a Provider that arranges IListBoxItems by their groupId.
     * @param initialItems The initial set of items.  Items will be arranged in group order,
     * and dividers and headers will be moved to the top of each group.
     * @param initialGroups The initial set of groups.  Items will be arranged in the order specified by this set.
     * @param manageHeaders Set to true to have the provider create headers and dividers for groups that don't already have them.
     * Headers created this way will have text matching the group's name.
     */
    function GroupedItemProvider(initialItems, initialGroups, manageHeaders) {
        this.listItems = new ObservableArray();
        this.internalGroups = __spreadArrays(initialGroups);
        // Initialize with one array for the unassigned group.
        this.groupedItems = [[]];
        for (var i = 0; i < this.internalGroups.length; i++) {
            this.groupedItems.push([]);
        }
        this.addItems(initialItems);
        for (var i = 0; i < this.internalGroups.length; i++) {
            if (this.internalGroups[i].loading) {
                this.setGroupLoading(this.internalGroups[i].id, true, this.internalGroups[i].loadingItem);
            }
        }
        if (manageHeaders) {
            // Add headers and didviders to groups that don't already have them.
            this.addHeaders(1, this.groups.length);
        }
        this.manageHeaders = !!manageHeaders;
    }
    Object.defineProperty(GroupedItemProvider.prototype, "groups", {
        /**
         * Get the internal array of groups.
         */
        get: function () {
            return this.internalGroups;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GroupedItemProvider.prototype, "length", {
        /**
         * Get the length of the listItems array.
         */
        get: function () {
            return this.listItems.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GroupedItemProvider.prototype, "value", {
        /**
         * Get the interal array of listItems.
         */
        get: function () {
            return this.listItems.value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe to changes in the underlying set of items.
     * @param observer the delegate to be called when there are updates.
     * @param action the action on the set to observe.
     */
    GroupedItemProvider.prototype.subscribe = function (observer, action) {
        return this.listItems.subscribe(observer, action);
    };
    /**
     * Unsubscribe from changes in the underlying set of items.
     * @param observer the delegate that was used to subscribe.
     * @param action the action that was used to subsribe.
     */
    GroupedItemProvider.prototype.unsubscribe = function (observer, action) {
        return this.listItems.unsubscribe(observer, action);
    };
    /**
     * Add items to the end of whichever group they belong to.
     * @param items a list of items to add.
     */
    GroupedItemProvider.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.addItems(items);
        return items.length;
    };
    /**
     * Add groups to the end of the group list.  If there are items with these group id's already in the
     * item set they will arrange into these new groups.
     * @param groups
     */
    GroupedItemProvider.prototype.pushGroups = function () {
        var groups = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            groups[_i] = arguments[_i];
        }
        this.addGroups.apply(this, __spreadArrays([this.internalGroups.length], groups));
        return this.internalGroups.length;
    };
    /**
     * Remove the last item in the item set and return it.
     */
    GroupedItemProvider.prototype.pop = function () {
        var removedItem = this.listItems.pop();
        if (removedItem) {
            this.removeItems([removedItem]);
        }
        return removedItem;
    };
    /**
     * Remove all items that match the given filter.
     * @param filter the filter function to run on all items.  If this returns true, the item will be deleted.
     */
    GroupedItemProvider.prototype.removeAll = function (filter) {
        var removedItems = this.listItems.removeAll(filter);
        this.removeItems(removedItems, false);
        return removedItems;
    };
    /**
     * Remove and add items from a provided index.  Added items will be arranged by their groupId.
     * @param start the index to start insertion and deletion.
     * @param deleteCount the number of items to delete.
     * @param itemsToAdd the items to insert at the start index.
     */
    GroupedItemProvider.prototype.splice = function (start, deleteCount) {
        var itemsToAdd = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            itemsToAdd[_i - 2] = arguments[_i];
        }
        var removedItems = this.listItems.splice(start, deleteCount);
        this.removeItems(removedItems, false);
        this.addItems(itemsToAdd, true, start);
        return removedItems;
    };
    /**
     * Changes a subsection of the items to a different set of items.  Use over splice if you want to optimize by listening to the change event instead.
     * @param start the index to start the change.
     * @param itemsToAdd the items to replace the current set with.
     */
    GroupedItemProvider.prototype.change = function (start) {
        var _a;
        var items = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            items[_i - 1] = arguments[_i];
        }
        var changedItems = this.listItems.value.slice(start, items.length);
        this.removeItems(changedItems, false);
        this.addItems(items, false);
        (_a = this.listItems).change.apply(_a, __spreadArrays([start], items));
        return items.length;
    };
    /**
     * Remove and add groups from a provided index.  All items in deleted groups will be removed from the item set.
     * @param start the index to start insertion and deletion.
     * @param deleteCount the number of groups to delete.
     * @param groupsToAdd the groups to insert at the start index.
     */
    GroupedItemProvider.prototype.spliceGroups = function (start, deleteCount) {
        var groupsToAdd = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            groupsToAdd[_i - 2] = arguments[_i];
        }
        for (var i = 0; i < deleteCount; i++) {
            var groupIndex = start + i + 1;
            if (this.groupedItems.length > groupIndex) {
                this.removeItems(__spreadArrays(this.groupedItems[groupIndex]));
                if (this.manageHeaders) {
                    // If the first item is now a divider, remove it.
                    var firstGroupWithItemsIndex = this.groupedItems.findIndex(function (items) { return items.length > 0; });
                    if (firstGroupWithItemsIndex > 0 && this.groupedItems[firstGroupWithItemsIndex][0].type === ListBoxItemType.Divider) {
                        this.removeItems([this.groupedItems[firstGroupWithItemsIndex][0]]);
                    }
                }
                this.groupedItems.splice(groupIndex, 1);
            }
        }
        var deletedGroups = this.internalGroups.splice(start, deleteCount);
        this.addGroups.apply(this, __spreadArrays([start], groupsToAdd));
        return deletedGroups;
    };
    /**
     * Set a group's loading status to true or false.  A loading item will be added or removed from the group.
     * @param groupId The group to set the loading status of.
     * @param loading Set to true to add a loading row.  Set to false to remove a loading row.
     * @param loadingItem Provide this to use a custom loading item, otherwise a standard spinner item will be used.
     */
    GroupedItemProvider.prototype.setGroupLoading = function (groupId, loading, loadingItem) {
        var groupIndex = this.groups.findIndex(function (group) { return group.id === groupId; });
        if (groupIndex < 0) {
            if (false) {
                console.warn("Tried to set loading on group " + groupId + " that is not in the group set.");
            }
            return;
        }
        // Increase by 1 for the unassigned group.
        groupIndex++;
        var groupItems = this.groupedItems[groupIndex];
        var loadingItemIndex = groupItems.findIndex(function (item) { return item.type === ListBoxItemType.Loading; });
        if (!loading && groupItems.length && loadingItemIndex > -1) {
            this.removeItems([groupItems[loadingItemIndex]]);
        }
        else if (loading && loadingItemIndex === -1) {
            var newItem = loadingItem || { id: groupId + "-loading", type: ListBoxItemType.Loading, groupId: groupId };
            this.addItems([newItem]);
        }
        this.groups[groupIndex - 1].loading = loading;
    };
    /**
     * Add headers and didvers to groups that don't already have them.
     * @param start the groupMap index to add header/dividers to.
     * This is 1 more than the internalGroup index since there is an unassigned group at index 0.
     * @param count the number of groups that are new and may need headers.
     */
    GroupedItemProvider.prototype.addHeaders = function (start, count) {
        if (count === void 0) { count = 1; }
        var _loop_1 = function (i) {
            var group = this_1.groups[i - 1];
            if (this_1.groupedItems[i].length > 0) {
                if (!this_1.groupedItems[i].find(function (item) { return item.type === ListBoxItemType.Header; })) {
                    this_1.addItems([{ id: group.id + "-header", text: group.name || group.id, type: ListBoxItemType.Header, groupId: group.id }]);
                }
                // If there's a group before us with items, add a divider.
                if (this_1.groupedItems.some(function (items, index) { return index < i && items.length > 0; }) &&
                    !this_1.groupedItems[i].find(function (item) { return item.type === ListBoxItemType.Divider; })) {
                    this_1.addItems([{ id: group.id + "-divider", type: ListBoxItemType.Divider, groupId: group.id }]);
                }
                // If the next group with items doesn't have a divider, add one.
                var nextGroupWithItemsIndex = this_1.groupedItems.findIndex(function (items, index) { return index > i && items.length > 0; });
                if (nextGroupWithItemsIndex > 0 && !this_1.groupedItems[nextGroupWithItemsIndex].find(function (item) { return item.type === ListBoxItemType.Divider; })) {
                    group = this_1.groups[nextGroupWithItemsIndex - 1];
                    this_1.addItems([{ id: group.id + "-divider", type: ListBoxItemType.Divider, groupId: group.id }]);
                }
            }
        };
        var this_1 = this;
        for (var i = start; i < start + count; i++) {
            _loop_1(i);
        }
    };
    /**
     * Add groups to the internal list of groups.  Items from the unsassigned group will be moved to the new groups
     * If they have a matching groupId.
     * @param index the index to add the groups at.
     * @param groups the groups to add.
     */
    GroupedItemProvider.prototype.addGroups = function (index) {
        var _a;
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        (_a = this.internalGroups).splice.apply(_a, __spreadArrays([index, 0], groups));
        var unassignedItemsToAdd = [];
        for (var i = 0; i < groups.length; i++) {
            this.groupedItems.splice(index + i + 1, 0, []);
            // Move all items from the unassigned group to the new group if they have a matching groupId.
            for (var j = this.groupedItems[0].length - 1; j >= 0; j--) {
                if (this.groupedItems[0][j].groupId === groups[i].id) {
                    var unassignedItemToAdd = this.groupedItems[0].splice(j, 1)[0];
                    this.listItems.splice(j, 1);
                    unassignedItemsToAdd.unshift(unassignedItemToAdd);
                }
            }
        }
        this.addItems(unassignedItemsToAdd);
        if (this.manageHeaders) {
            this.addHeaders(index + 1, groups.length);
        }
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].loading) {
                this.setGroupLoading(groups[i].id, true, groups[i].loadingItem);
            }
        }
    };
    /**
     * Add items to the item set, arranging them according to their groupId.
     * @param items the items to add.
     * @param addToListItems set to false to only add to groupedItems and not to full listItems set.
     * @param index the index to try to add the item to.  If the index is out of the bounds of the item's group,
     * it will be added at the closest index.
     */
    GroupedItemProvider.prototype.addItems = function (items, addToListItems, index) {
        if (addToListItems === void 0) { addToListItems = true; }
        // Add in reverse order if we're trying to add at a specific index.
        if (index !== undefined) {
            for (var i = items.length - 1; i >= 0; i--) {
                this.addItem(items[i], index);
            }
        }
        else {
            for (var i = 0; i < items.length; i++) {
                this.addItem(items[i], index);
            }
        }
        if (addToListItems) {
            this.addToListItems();
        }
    };
    /**
     * Diff this.groupedItems and this.listItems and splice in the extra items in as few splices as possible.
     */
    GroupedItemProvider.prototype.addToListItems = function () {
        var _a;
        // Flatten this.groupedItems into a single array so it can be compared to this.listItems.
        var groupedItemsArray = [];
        for (var i = 0; i < this.groupedItems.length; i++) {
            groupedItemsArray.push.apply(groupedItemsArray, this.groupedItems[i]);
        }
        var listItemIndex = 0;
        var listIndexWhereItemsDiffer;
        var indexToItemMapping = {};
        // Iterate through both the groupedItemsArray and this.listItems.  When the items differ, add the new items to a map,
        // keyed off the listItem index where the items will be spliced at.
        for (var groupedItemIndex = 0; groupedItemIndex < groupedItemsArray.length; groupedItemIndex++) {
            if (this.listItems.value[listItemIndex] === groupedItemsArray[groupedItemIndex]) {
                listItemIndex++;
                listIndexWhereItemsDiffer = undefined;
            }
            else {
                // if listIndexWhereItemsDiffer is defined, we are currently in a run of new items. Add the next to item to the same entry in the mapping.
                if (listIndexWhereItemsDiffer !== undefined) {
                    indexToItemMapping[listIndexWhereItemsDiffer].push(groupedItemsArray[groupedItemIndex]);
                }
                else {
                    // We're starting a new run of new items, add an entry to the mapping.
                    listIndexWhereItemsDiffer = listItemIndex;
                    indexToItemMapping[listItemIndex] = [groupedItemsArray[groupedItemIndex]];
                }
            }
        }
        // Iterate through the mapping and add the new items.  This is done in reverse order so the new items don't throw off the indices that come after.
        var keys = Object.keys(indexToItemMapping);
        for (var i = keys.length - 1; i >= 0; i--) {
            (_a = this.listItems).splice.apply(_a, __spreadArrays([parseInt(keys[i]), 0], indexToItemMapping[parseInt(keys[i])]));
        }
    };
    GroupedItemProvider.prototype.addItem = function (item, index) {
        var groupIndex = 0;
        var newItemIndex = 0;
        var groupId = item.groupId;
        if (groupId !== undefined) {
            groupIndex = this.internalGroups.findIndex(function (group) { return group.id === groupId; }) + 1;
        }
        for (var j = 0; j < groupIndex; j++) {
            newItemIndex += this.groupedItems[j].length;
        }
        // Put dividers at the top, followed by headers.
        if (item.type === ListBoxItemType.Divider) {
            this.groupedItems[groupIndex].unshift(item);
        }
        else if (item.type === ListBoxItemType.Header) {
            if (this.groupedItems[groupIndex].length && this.groupedItems[groupIndex][0].type === ListBoxItemType.Divider) {
                this.groupedItems[groupIndex].splice(1, 0, item);
                newItemIndex++;
            }
            else {
                this.groupedItems[groupIndex].unshift(item);
            }
        }
        else {
            var spliceIndex = this.groupedItems[groupIndex].length;
            if (index !== undefined && index >= newItemIndex && index <= newItemIndex + this.groupedItems[groupIndex].length) {
                spliceIndex = index - newItemIndex;
                newItemIndex = index;
            }
            else if (index !== undefined && index < newItemIndex) {
                spliceIndex = 0;
            }
            else {
                newItemIndex += this.groupedItems[groupIndex].length;
            }
            this.groupedItems[groupIndex].splice(spliceIndex, 0, item);
            // If we added an item to an empty group, see if we need to add a header
            if (groupIndex > 0 && this.groupedItems[groupIndex].length === 1 && this.manageHeaders) {
                this.addHeaders(groupIndex);
            }
        }
    };
    /**
     * Removed items from the internal groupedItems lists and optionally from the actual list of items.
     * @param items the items to remove.
     * @param removeFromListItems Whether or not to remove the items from the list of items.
     */
    GroupedItemProvider.prototype.removeItems = function (items, removeFromListItems) {
        if (removeFromListItems === void 0) { removeFromListItems = true; }
        var _loop_2 = function (i) {
            var groupIndex = 0;
            var itemIndex = 0;
            var groupId = items[i].groupId;
            if (groupId !== undefined) {
                groupIndex = this_2.internalGroups.findIndex(function (group) { return group.id === groupId; }) + 1;
            }
            for (var j = 0; j < groupIndex; j++) {
                itemIndex += this_2.groupedItems[j].length;
            }
            var group = this_2.groupedItems[groupIndex];
            var indexInGroup = group.indexOf(items[i]);
            group.splice(indexInGroup, 1);
            if (removeFromListItems) {
                this_2.listItems.splice(itemIndex + indexInGroup, 1);
            }
        };
        var this_2 = this;
        for (var i = 0; i < items.length; i++) {
            _loop_2(i);
        }
    };
    return GroupedItemProvider;
}());
export { GroupedItemProvider };
