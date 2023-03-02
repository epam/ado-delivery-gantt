import { __extends, __spreadArrays } from "tslib";
import { Observable, ObservableLike } from '../Core/Observable';
/**
 * An AggregateItemProvider takes a set of arrays, ObservableArrays, and ItemProviders and returns listItems from them as if they were a single
 * ItemProvider.
 */
var AggregateItemProvider = /** @class */ (function (_super) {
    __extends(AggregateItemProvider, _super);
    function AggregateItemProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.internalCollections = [];
        _this.items = [];
        return _this;
    }
    Object.defineProperty(AggregateItemProvider.prototype, "length", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AggregateItemProvider.prototype, "value", {
        get: function () {
            return this.items;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AggregateItemProvider.prototype, "collections", {
        get: function () {
            return this.internalCollections;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds an additional collection of items to the end of the array
     *
     * @param collection Array of items or an observable array of items
     */
    AggregateItemProvider.prototype.push = function (collection) {
        var _a;
        var collectionEntry;
        if (ObservableLike.isObservable(collection)) {
            var provider = collection;
            var subscriber = this.getSubscriber(this.internalCollections.length);
            collectionEntry = { items: provider.value, provider: provider, subscriber: subscriber };
            if (this.subscriberCount) {
                ObservableLike.subscribe(collectionEntry.provider, subscriber);
            }
        }
        else if (collection.value) {
            collectionEntry = { items: collection.value, provider: collection };
        }
        else if (collection.length) {
            collectionEntry = { items: collection };
        }
        if (collectionEntry) {
            this.internalCollections.push(collectionEntry);
            if (collectionEntry.items.length) {
                (_a = this.items).push.apply(_a, collectionEntry.items);
                if (this.subscriberCount) {
                    this.notify({ addedItems: collectionEntry.items, index: this.items.length - collectionEntry.items.length }, "push");
                }
            }
        }
    };
    AggregateItemProvider.prototype.getItem = function (index) {
        var count = 0;
        var collectionIndex = 0;
        while (collectionIndex < this.internalCollections.length &&
            count +
                (this.internalCollections[collectionIndex].provider
                    ? this.internalCollections[collectionIndex].provider.length
                    : this.internalCollections[collectionIndex].items.length) <
                index) {
            collectionIndex++;
        }
        if (collectionIndex < this.internalCollections.length) {
            if (this.internalCollections[collectionIndex].provider &&
                this.internalCollections[collectionIndex].provider.getItem) {
                return this.internalCollections[collectionIndex].provider.getItem(index);
            }
            else {
                return this.internalCollections[collectionIndex].items[index];
            }
        }
    };
    AggregateItemProvider.prototype.subscribe = function (observer, action) {
        var _a;
        var subscription = _super.prototype.subscribe.call(this, observer, action);
        if (this.subscriberCount === 1) {
            for (var _i = 0, _b = this.internalCollections; _i < _b.length; _i++) {
                var collection = _b[_i];
                if (collection.subscriber && collection.provider && collection.provider.subscribe) {
                    collection.provider.subscribe(collection.subscriber);
                }
            }
            // Collections may have changed between the time they were pushed and subscribed to.
            // Update the aggregate provider's items to match the current state of its collections.
            var currentItems = [];
            for (var _c = 0, _d = this.internalCollections; _c < _d.length; _c++) {
                var collection = _d[_c];
                currentItems.push.apply(currentItems, collection.items);
            }
            (_a = this.items).splice.apply(_a, __spreadArrays([0, this.items.length], currentItems));
        }
        return subscription;
    };
    AggregateItemProvider.prototype.unsubscribe = function (observer, action) {
        _super.prototype.unsubscribe.call(this, observer, action);
        if (this.subscriberCount === 0) {
            for (var _i = 0, _a = this.internalCollections; _i < _a.length; _i++) {
                var collection = _a[_i];
                if (collection.subscriber && collection.provider && collection.provider.unsubscribe) {
                    collection.provider.unsubscribe(collection.subscriber);
                }
            }
        }
    };
    AggregateItemProvider.prototype.getSubscriber = function (collectionIndex) {
        var _this = this;
        return function (args) {
            var _a, _b;
            // Find the index in our aggregate array
            var index = args.index;
            for (var i = 0; i < collectionIndex; i++) {
                index += _this.internalCollections[i].items.length;
            }
            if (args.changedItems) {
                // Handle change event
                (_a = _this.items).splice.apply(_a, __spreadArrays([index, args.changedItems.length], args.changedItems));
                _this.notify({ changedItems: args.changedItems, index: index }, "change");
            }
            else {
                // Handle splice, push, pop events
                var removedItems = args.removedItems || [];
                var addedItems = args.addedItems || [];
                (_b = _this.items).splice.apply(_b, __spreadArrays([index, removedItems.length], addedItems));
                _this.notify({ removedItems: removedItems, addedItems: addedItems, index: index }, "splice");
            }
        };
    };
    return AggregateItemProvider;
}(Observable));
export { AggregateItemProvider };
