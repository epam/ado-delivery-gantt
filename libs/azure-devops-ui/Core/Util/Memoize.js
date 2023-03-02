var emptyObject = { empty: true };
var dictionary = {};
var weakMap = typeof WeakMap === "undefined" ? null : WeakMap;
/**
 *  Test utility for providing a custom weakmap.
 *
 * @internal
 * */
export function setMemoizeWeakMap(weakMap) {
    weakMap = weakMap;
}
/**
 * Memoize decorator to be used on class methods. Note that the "this" reference
 * will be inaccessible within a memoized method, given that a cached method's this
 * would not be instance specific.
 *
 * @public
 */
export function memoize(target, key, descriptor) {
    // We bind to "null" to prevent people from inadvertently pulling values from "this",
    // rather than passing them in as input values which can be memoized.
    var fn = memoizeFunction(descriptor.value && descriptor.value.bind(null));
    return {
        configurable: true,
        get: function () {
            return fn;
        }
    };
}
/**
 * Memoizes a function; when you pass in the same parameters multiple times, it returns a cached result.
 * Be careful when passing in objects, you need to pass in the same INSTANCE for caching to work. Otherwise
 * it will grow the cache unnecessarily. Also avoid using default values that evaluate functions; passing in
 * undefined for a value and relying on a default function will execute it the first time, but will not
 * re-evaluate subsequent times which may have been unexpected.
 *
 * By default, the cache will reset after 100 permutations, to avoid abuse cases where the function is
 * unintendedly called with unique objects. Without a reset, the cache could grow infinitely, so we safeguard
 * by resetting. To override this behavior, pass a value of 0 to the maxCacheSize parameter.
 *
 * @public
 * @param cb - The function to memoize.
 * @param maxCacheSize - Max results to cache. If the cache exceeds this value, it will reset on the next call.
 * @returns A memoized version of the function.
 */
export function memoizeFunction(cb, maxCacheSize) {
    if (maxCacheSize === void 0) { maxCacheSize = 100; }
    var rootNode;
    var cacheSize = 0;
    // Avoid breaking scenarios which don't have weak map.
    if (!weakMap) {
        return cb;
    }
    // tslint:disable-next-line:no-function-expression
    return function memoizedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentNode = rootNode;
        if (rootNode === undefined || (maxCacheSize > 0 && cacheSize > maxCacheSize)) {
            rootNode = createNode();
            cacheSize = 0;
        }
        currentNode = rootNode;
        // Traverse the tree until we find the match.
        for (var i = 0; i < args.length; i++) {
            var arg = normalizeArg(args[i]);
            if (!currentNode.map.has(arg)) {
                currentNode.map.set(arg, createNode());
            }
            currentNode = currentNode.map.get(arg);
        }
        if (!currentNode.hasOwnProperty("value")) {
            currentNode.value = cb.apply(void 0, args);
            cacheSize++;
        }
        return currentNode.value;
    };
}
function normalizeArg(val) {
    if (!val) {
        return emptyObject;
    }
    else if (typeof val === "object") {
        return val;
    }
    else if (!dictionary[val]) {
        dictionary[val] = { val: val };
    }
    return dictionary[val];
}
function createNode() {
    return {
        map: weakMap ? new weakMap() : null
    };
}
