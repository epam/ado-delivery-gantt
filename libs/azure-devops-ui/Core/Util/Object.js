var CURRENT_ID_PROPERTY = "__currentIdProp__";
var DEFAULT_ID_STRING = "id__";
var global = (typeof window !== "undefined" && window) || process;
if (global[CURRENT_ID_PROPERTY] === undefined) {
    global[CURRENT_ID_PROPERTY] = 0;
}
function checkProperties(a, b) {
    for (var propName in a) {
        if (a.hasOwnProperty(propName)) {
            if (!b.hasOwnProperty(propName) || b[propName] !== a[propName]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Generates a unique id in the global scope (this spans across duplicate copies of the same library.)
 *
 * @public
 */
export function getId(prefix) {
    var index = global[CURRENT_ID_PROPERTY]++;
    return (prefix || DEFAULT_ID_STRING) + index;
}
/**
 * Resets id counter to an (optional) number.
 *
 * @public
 */
export function resetIds(counter) {
    if (counter === void 0) { counter = 0; }
    global[CURRENT_ID_PROPERTY] = counter;
}
/**
 * Compares a to b and b to a.
 *
 * @public
 */
export function shallowCompare(a, b) {
    // Handle the same object
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return checkProperties(a, b) && checkProperties(b, a);
}
