/**
 * Basic ItemProvider that surfaces an array of items through the IItemProvider
 * interface.
 */
var ArrayItemProvider = /** @class */ (function () {
    function ArrayItemProvider(items) {
        this.items = items;
    }
    Object.defineProperty(ArrayItemProvider.prototype, "length", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrayItemProvider.prototype, "value", {
        get: function () {
            return this.items;
        },
        enumerable: false,
        configurable: true
    });
    return ArrayItemProvider;
}());
export { ArrayItemProvider };
/**
 * Helper function to get the value of a set of items that can be an itemProvider or normal array.
 * @param items the items to retrieve the value from.
 */
export function getItemsValue(items) {
    return Array.isArray(items) ? items : items.value;
}
