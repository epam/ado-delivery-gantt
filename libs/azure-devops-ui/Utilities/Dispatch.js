var EventDispatch = /** @class */ (function () {
    function EventDispatch() {
        this.listeners = {};
    }
    EventDispatch.prototype.addEventListener = function (eventType, callback) {
        if (!(eventType in this.listeners)) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    };
    EventDispatch.prototype.dispatchEvent = function (event, data, type) {
        var delegates = this.listeners[type || event.type];
        if (delegates) {
            var stack = delegates.slice();
            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event, data);
            }
        }
    };
    EventDispatch.prototype.removeEventListener = function (eventType, callback) {
        if (!(eventType in this.listeners)) {
            return;
        }
        var stack = this.listeners[eventType];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
            }
        }
    };
    return EventDispatch;
}());
export { EventDispatch };
