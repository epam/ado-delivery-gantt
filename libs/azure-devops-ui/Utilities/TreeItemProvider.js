import { __spreadArrays } from "tslib";
import { ObservableArray } from '../Core/Observable';
/**
 * A TreeItemProvider is designed to store and manage the state of a tree.
 * As items are added/removed, expanded/collapsed, the providers "value" will
 * represent the current set of ordered items within the tree.
 */
var TreeItemProvider = /** @class */ (function () {
    function TreeItemProvider(rootItems) {
        if (rootItems === void 0) { rootItems = []; }
        // Track a map for each ITreeItem being tracked in the tree to its internal ITreeItemEx.
        this.itemMap = new Map();
        var treeItems = [];
        // Make a copy of the initial root items
        this.rootItems = __spreadArrays(rootItems);
        // Add the root item and its entire sub-tree to the item map and update the items passed to the underlying tree.
        this.addItems(rootItems, undefined, treeItems);
        // Create the underlying observable we use to manage the underlying table items.
        this.tableItems = new ObservableArray(treeItems);
    }
    Object.defineProperty(TreeItemProvider.prototype, "length", {
        get: function () {
            return this.tableItems.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemProvider.prototype, "roots", {
        get: function () {
            return this.rootItems;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemProvider.prototype, "value", {
        get: function () {
            return this.tableItems.value;
        },
        enumerable: false,
        configurable: true
    });
    TreeItemProvider.prototype.subscribe = function (observer, action) {
        return this.tableItems.subscribe(observer, action);
    };
    TreeItemProvider.prototype.unsubscribe = function (observer, action) {
        return this.tableItems.unsubscribe(observer, action);
    };
    /**
     * add can be used to add a single item to the tree at a given location. If the
     * specified parentItem or insertAfter are not in the tree or the insertAfter is not
     * a child of parentItem, the addition will be ignored.
     *
     * @param item The item to add to the tree.
     * @param parentItem The direct parent of the item being added.
     * If this is a rootItem leave the parentItem undefined.
     * @param insertAfter The sibling item this item should be inserted after.
     * If this is the first item within the parent leave insertAfter undefined.
     */
    TreeItemProvider.prototype.add = function (item, parentItem, insertAfter) {
        return this.splice(parentItem, undefined, [
            {
                insertAfter: insertAfter,
                items: [item]
            }
        ]);
    };
    /**
     * clear can be used to reset the provider. This is an optimized way to
     * remove all items from the tree.
     */
    TreeItemProvider.prototype.clear = function () {
        this.tableItems.splice(0, this.tableItems.length);
        this.rootItems.splice(0, this.rootItems.length);
    };
    /**
     * Collapse the node.
     *
     * @param treeItem The item whose state should be collapsed. If the treeItem is
     * not in the tree or if the item is already expanded the method will no-op.
     */
    TreeItemProvider.prototype.collapse = function (treeItem) {
        treeItem.expanded && this.toggle(treeItem);
    };
    /**
     * Expand the node. Optionally expand all parent nodes.
     *
     * @param treeItem The item whose state should be expanded. If the treeItem is
     * not in the tree the method will no-op.
     * @param expandParents If all parent nodes should be expanded. @default false
     */
    TreeItemProvider.prototype.expand = function (treeItem, expandParents) {
        var treeItemEx = this.itemMap.get(treeItem);
        if (!treeItemEx) {
            return;
        }
        var expandNodes = [];
        do {
            if (!treeItemEx.underlyingItem.expanded) {
                expandNodes.push(treeItemEx);
            }
            treeItemEx = treeItemEx.parentItem;
        } while (expandParents && treeItemEx);
        for (var index = expandNodes.length - 1; index >= 0; index--) {
            this.toggle(expandNodes[index].underlyingItem);
        }
    };
    /**
     * Remove the specified item from the tree. If the item doesnt exist the
     * remove will be ignored.
     *
     * @param treeItem The item that should be removed from the tree.
     * @param parentItem The parentItem of the item being removed. If the caller
     * doesnt have the parentItem readily available it will be computed, but this
     * can be expensive. The caller should supply it if they can.
     */
    TreeItemProvider.prototype.remove = function (treeItem, parentItem) {
        if (!parentItem) {
            var itemIndex = this.indexOf(treeItem);
            if ((itemIndex = this.indexOf(treeItem)) === -1) {
                return;
            }
            var removeItem = this.tableItems.value[itemIndex];
            parentItem = removeItem.parentItem && removeItem.parentItem.underlyingItem;
        }
        return this.splice(parentItem, [treeItem]);
    };
    /**
     * spliceItems is used to update the direct children of a given item
     * in the tree. If the parentItem is supplied and not in the tree the
     * changes will be ignored.
     *
     * @NOTE: Adds are processed before removes, this allows the existing
     * elements to be used as an insertAfter for placement. An item can't
     * be in both the add and remove set. This will cause duplication.
     *
     * @param parentItem The item whos children are being updated. If undefined
     * is supplied the updates will modify the root.
     * @param itemsToRemove The set of items that should removed from the parent.
     * @param itemsToAdd The set of items that should be added to the parent.
     */
    TreeItemProvider.prototype.splice = function (parentItem, itemsToRemove, itemsToAdd) {
        var _a;
        var parentItemEx;
        var notifyChange = false;
        var parentIndex = -1;
        var childItems = this.rootItems;
        if (parentItem) {
            parentItemEx = this.itemMap.get(parentItem);
            if (!parentItemEx) {
                return;
            }
            // Find the location in the table items we need splice changes.
            parentIndex = this.indexOf(parentItem);
            childItems = parentItemEx.underlyingItem.childItems || [];
        }
        // Before making any changes make a copy of the removed array, this allows
        // the caller to supply the current childItems to clear them.
        if (itemsToRemove) {
            itemsToRemove = itemsToRemove.slice(0);
        }
        // We will process the adds before the removes.
        if (itemsToAdd) {
            for (var index = 0; index < itemsToAdd.length; index++) {
                var tableItems = !parentItem || (parentIndex >= 0 && parentItem.expanded) ? [] : undefined;
                var itemToAdd = itemsToAdd[index];
                var insertIndex = parentIndex;
                var childIndex = 0;
                // If we are inserting after a specific item find that item. If it
                // isn't found, ignore the add.
                if (itemToAdd.insertAfter) {
                    // Ensure the insertAfter is a child of the parentItem.
                    if ((childIndex = childItems.indexOf(itemToAdd.insertAfter)) === -1) {
                        continue;
                    }
                    // Find the location in the underlying tableItems to insert.
                    var childInsertIndex = this.indexOf(itemToAdd.insertAfter, parentIndex + 1);
                    if (childInsertIndex !== -1) {
                        // Determine the number of elements in table under the insertAfter, we need to insert
                        // after these elements to ensure the inserted element is a sibling of insertAfter.
                        insertIndex = childInsertIndex + this.getTableChildCount(itemToAdd.insertAfter);
                    }
                }
                else {
                    // if we add to the front, childIndex needs to be -1 so when we do the +1 later, it will be 0
                    childIndex--;
                }
                // Add the items to the overall item map and compute the item being sent to the table.
                this.addItems(itemToAdd.items, parentItemEx, tableItems);
                // Update the childItems and if this is the first child update the treeItem.
                // We will notify if we are adding the first child since the state of the item is changing.
                childItems.splice.apply(childItems, __spreadArrays([childIndex + 1, 0], itemToAdd.items));
                if (parentItemEx && !parentItemEx.underlyingItem.childItems) {
                    parentItemEx.underlyingItem.childItems = childItems;
                    notifyChange = true;
                }
                // Add the new items to the set of table items.
                if (tableItems) {
                    (_a = this.tableItems).splice.apply(_a, __spreadArrays([insertIndex + 1, 0], tableItems));
                    notifyChange = true;
                }
            }
        }
        // Now process the removes.
        if (itemsToRemove) {
            for (var index = 0; index < itemsToRemove.length; index++) {
                var itemToRemove = itemsToRemove[index];
                var tableItems = !parentItem || parentItem.expanded ? [] : undefined;
                var childIndex = void 0;
                // Ensure the itemToRemove is a child of the parentItem.
                if ((childIndex = childItems.indexOf(itemToRemove)) === -1) {
                    continue;
                }
                // Remove the items from the underlying map and compute the set of items in the table.
                this.removeItem(itemToRemove, tableItems);
                // Remove the item from this childItem list. Notify if we removed the last child
                // since this is changing the state of the item.
                childItems.splice(childIndex, 1);
                if (childItems.length === 0 && parentItem) {
                    delete parentItem.childItems;
                    notifyChange = true;
                }
                var removeIndex = this.indexOf(itemToRemove, parentIndex + 1);
                if (removeIndex === -1) {
                    continue;
                }
                // Remove the items from the underlying observable.
                if (tableItems) {
                    this.tableItems.splice(removeIndex, tableItems.length);
                    notifyChange = true;
                }
            }
        }
        if (notifyChange && parentItemEx && parentIndex !== -1) {
            this.tableItems.change(parentIndex, parentItemEx);
        }
    };
    /**
     * toggleItem is used to toggle the expand/collapse state of a given tree item.
     *
     * @param treeItem The item whose state should be toggled. If the treeItem is
     * not in the tree the method will no-op.
     */
    TreeItemProvider.prototype.toggle = function (treeItem) {
        var _a;
        var itemIndex = this.indexOf(treeItem);
        // Toggle the expanded state of the treeItem.
        treeItem.expanded = !treeItem.expanded;
        if (itemIndex >= 0) {
            if (treeItem.childItems) {
                var tableItems = [];
                // Get the set of children being added to the underlying array.
                for (var index = 0; index < treeItem.childItems.length; index++) {
                    this.getTableItems(treeItem.childItems[index], tableItems);
                }
                // We need to update the underlying observables items.
                if (treeItem.expanded) {
                    (_a = this.tableItems).splice.apply(_a, __spreadArrays([itemIndex + 1, 0], tableItems));
                }
                else {
                    this.tableItems.splice(itemIndex + 1, tableItems.length);
                }
            }
        }
    };
    TreeItemProvider.prototype.addItems = function (treeItems, parentItem, tableItems) {
        for (var index = 0; index < treeItems.length; index++) {
            var treeItem = treeItems[index];
            var treeItemEx = { depth: parentItem ? parentItem.depth + 1 : 0, parentItem: parentItem, underlyingItem: treeItem };
            // Add this treeItem and computed treeItemEx to the map.
            this.itemMap.set(treeItem, treeItemEx);
            // If the caller requested the set of items that should be given to the table.
            if (tableItems) {
                tableItems.push(treeItemEx);
            }
            // Go through all the children and add them to the map, and if it is expanded
            // we will forward the current tableItems array.
            if (treeItem.childItems) {
                this.addItems(treeItem.childItems, treeItemEx, treeItem.expanded ? tableItems : undefined);
            }
        }
    };
    TreeItemProvider.prototype.getTableItems = function (treeItem, tableItems) {
        var treeItemEx = this.itemMap.get(treeItem);
        if (treeItemEx) {
            tableItems.push(treeItemEx);
            if (treeItem.childItems && treeItem.expanded) {
                for (var _i = 0, _a = treeItem.childItems; _i < _a.length; _i++) {
                    var childItem = _a[_i];
                    this.getTableItems(childItem, tableItems);
                }
            }
        }
    };
    TreeItemProvider.prototype.getTableChildCount = function (treeItem) {
        var count = 0;
        if (treeItem.childItems && treeItem.expanded) {
            for (var index = 0; index < treeItem.childItems.length; index++) {
                count += this.getTableChildCount(treeItem.childItems[index]) + 1;
            }
        }
        return count;
    };
    /**
     * indexOfItem is used to find the index of a source treeItem. The underlying
     * observable indexOf will find instances of ITreeItemEx. This returns the
     * index from the set of items passed to the table.
     *
     * @param treeItem The item to find in the tree.
     * @param fromIndex The index to start the search.
     * @returns If the item is found an index >= 0 is returned, if it is not found -1 is returned.
     */
    TreeItemProvider.prototype.indexOf = function (treeItem, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        // @TODO: Can we come up with a faster method than this.
        for (var index = fromIndex; index < this.tableItems.length; index++) {
            if (treeItem === this.tableItems.value[index].underlyingItem) {
                return index;
            }
        }
        return -1;
    };
    TreeItemProvider.prototype.removeItem = function (treeItem, tableItems) {
        // Add this treeItem and computed treeItemEx to the map.
        this.itemMap.delete(treeItem);
        // If the caller requested the set of items that should be given to the table.
        if (tableItems) {
            tableItems.push(treeItem);
        }
        // Go through all the children and add them to the map, and if it is expanded
        // we will forward the current tableItems array.
        if (treeItem.childItems) {
            for (var childIndex = 0; childIndex < treeItem.childItems.length; childIndex++) {
                this.removeItem(treeItem.childItems[childIndex], treeItem.expanded ? tableItems : undefined);
            }
        }
    };
    return TreeItemProvider;
}());
export { TreeItemProvider };
