import "es6-promise/auto";
import "es6-object-assign/auto";
import "es6-string-polyfills";
import "intersection-observer";
import "./Core/find";
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
var global = window;
if (typeof global.false === "undefined") {
    global.false = false;
}
// Polyfill MAX_SAFE_INTEGER and MIN_SAFE_INTEGER
if (!Number.MAX_SAFE_INTEGER) {
    Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
}
if (!Number.MIN_SAFE_INTEGER) {
    Number.MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1);
}
