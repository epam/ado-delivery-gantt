import { __spreadArrays } from "tslib";
/**
 * The TimerManagement class is used to track a set of timers.
 */
var TimerManagement = /** @class */ (function () {
    function TimerManagement(parent) {
        this.disposed = false;
        this.immediateIds = null;
        this.intervals = [];
        this.timeouts = [];
        this.parent = parent || null;
    }
    /**
     * clearAllTimers is used to clear any active timers in the object.
     */
    TimerManagement.prototype.clearAllTimers = function () {
        for (var _i = 0, _a = this.intervals; _i < _a.length; _i++) {
            var intervalId = _a[_i];
            window.clearInterval(intervalId);
        }
        for (var _b = 0, _c = this.timeouts; _b < _c.length; _b++) {
            var timeoutId = _c[_b];
            window.clearTimeout(timeoutId);
        }
        this.intervals.splice(0, this.intervals.length);
        this.timeouts.splice(0, this.timeouts.length);
    };
    /**
     * Clears the immediate.
     * @param id - Id to cancel.
     */
    TimerManagement.prototype.clearImmediate = function (id) {
        if (this.immediateIds && this.immediateIds[id]) {
            window.clearTimeout(id);
            delete this.immediateIds[id];
        }
    };
    /**
     * clearInterval is used to stop the series of callbacks that was setup through setInterval.
     *
     * @param intervalId - The id returned from eh setInterval call that you want stopped.
     */
    TimerManagement.prototype.clearInterval = function (intervalId) {
        window.clearInterval(intervalId);
        this.removeInterval(intervalId);
    };
    /**
     * clearTimeout is used to stop a timeout callback that was setup through setTimeout.
     *
     * @param timeoutId - The id returned from the setTimeout call that you want stopped.
     */
    TimerManagement.prototype.clearTimeout = function (timeoutId) {
        window.clearTimeout(timeoutId);
        this.removeTimeout(timeoutId);
    };
    /**
     * SetImmediate override, which will auto cancel the immediate during dispose.
     * @param callback - Callback to execute.
     * @returns The setTimeout id.
     */
    TimerManagement.prototype.setImmediate = function (callback) {
        var _this = this;
        var immediateId = 0;
        if (!this.disposed) {
            if (!this.immediateIds) {
                this.immediateIds = {};
            }
            var setImmediateCallback = function () {
                // Time to execute the timeout, enqueue it as a foreground task to be executed.
                try {
                    // Now delete the record and call the callback.
                    if (_this.immediateIds) {
                        delete _this.immediateIds[immediateId];
                    }
                    callback.apply(_this.parent);
                }
                catch (e) { }
            };
            immediateId = window.setTimeout(setImmediateCallback, 0);
            this.immediateIds[immediateId] = true;
        }
        return immediateId;
    };
    /**
     * setInterval is used to setup a callback that is called on an interval.
     *
     * @param callback - The callback that should be called each interval time period.
     *
     * @param milliseconds - The number of milliseconds between each callback.
     *
     * @param args - Optional variable argument list passed to the callback.
     *
     * @returns - returns a handle to the interval, this can be used to cancel through clearInterval method.
     */
    TimerManagement.prototype.setInterval = function (callback, milliseconds) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // Create the timer, and add a method to track the completion so we can
        // remove our tracked reference.
        var intervalId = window.setInterval.apply(window, __spreadArrays([callback, milliseconds], args));
        this.intervals.push(intervalId);
        return intervalId;
    };
    /**
     * setTimeout is used to setup a onetime callback that is called after the specified timeout.
     *
     * @param callback - The callback that should be called when the time period has elapsed.
     *
     * @param milliseconds - The number of milliseconds before the callback should be called.
     *  Even if a timeout of 0 is used the callback will be executed asynchronouly.
     *
     * @param args - Optional variable argument list passed to the callback.
     *
     * @returns - returns a handle to the timeout, this can be used to cancel through clearTimeout method.
     */
    TimerManagement.prototype.setTimeout = function (callback, milliseconds) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timeoutId = 0;
        // Create the timer, and add a method to track the completion so we can
        // remove our tracked reference.
        timeoutId = window.setTimeout.apply(window, __spreadArrays([function () {
                _this.removeTimeout(timeoutId);
                callback.apply(void 0, args);
            }, milliseconds], args));
        this.timeouts.push(timeoutId);
        return timeoutId;
    };
    TimerManagement.prototype.dispose = function () {
        this.disposed = true;
        this.parent = null;
        this.clearAllTimers();
        // Clear immediates.
        if (this.immediateIds) {
            for (var id in this.immediateIds) {
                if (this.immediateIds.hasOwnProperty(id)) {
                    this.clearImmediate(parseInt(id, 10));
                }
            }
        }
        this.immediateIds = null;
    };
    /**
     * Creates a function that will delay the execution of func until after wait milliseconds have
     * elapsed since the last time it was invoked. Provide an options object to indicate that func
     * should be invoked on the leading and/or trailing edge of the wait timeout. Subsequent calls
     * to the debounced function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the the debounced function is invoked more than once during the wait
     * timeout.
     *
     * @param func - The function to debounce.
     * @param wait - The number of milliseconds to delay.
     * @param options - The options object.
     * @returns The new debounced function.
     */
    TimerManagement.prototype.debounce = function (func, wait, options) {
        var _this = this;
        if (this.disposed) {
            var noOpFunction = (function () {
                /** Do nothing */
            });
            noOpFunction.cancel = function () {
                return;
            };
            noOpFunction.flush = (function () { return null; });
            noOpFunction.pending = function () { return false; };
            return noOpFunction;
        }
        var waitMS = wait || 0;
        var leading = false;
        var trailing = true;
        var maxWait = null;
        var lastCallTime = 0;
        var lastExecuteTime = new Date().getTime();
        var lastResult;
        var lastArgs;
        var timeoutId = null;
        if (options) {
            leading = options.leading || false;
            trailing = options.trailing || true;
            maxWait = options.maxWait || null;
        }
        var markExecuted = function (time) {
            if (timeoutId) {
                _this.clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastExecuteTime = time;
        };
        var invokeFunction = function (time) {
            markExecuted(time);
            lastResult = func.apply(null, lastArgs);
        };
        var callback = function (userCall) {
            var now = new Date().getTime();
            var executeImmediately = false;
            if (userCall) {
                if (leading && now - lastCallTime >= waitMS) {
                    executeImmediately = true;
                }
                lastCallTime = now;
            }
            var delta = now - lastCallTime;
            var waitLength = waitMS - delta;
            var maxWaitDelta = now - lastExecuteTime;
            var maxWaitExpired = false;
            if (maxWait !== null) {
                // maxWait only matters when there is a pending callback
                if (maxWaitDelta >= maxWait && timeoutId) {
                    maxWaitExpired = true;
                }
                else {
                    waitLength = Math.min(waitLength, maxWait - maxWaitDelta);
                }
            }
            if (delta >= waitMS || maxWaitExpired || executeImmediately) {
                invokeFunction(now);
            }
            else if ((timeoutId === null || !userCall) && trailing) {
                timeoutId = _this.setTimeout(callback, waitLength);
            }
            return lastResult;
        };
        var pending = function () {
            return !!timeoutId;
        };
        var cancel = function () {
            if (pending()) {
                // Mark the debounced function as having executed
                markExecuted(new Date().getTime());
            }
        };
        var flush = function () {
            if (pending()) {
                invokeFunction(new Date().getTime());
            }
            return lastResult;
        };
        // tslint:disable-next-line:no-any
        var resultFunction = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            lastArgs = args;
            return callback(true);
        });
        resultFunction.cancel = cancel;
        resultFunction.flush = flush;
        resultFunction.pending = pending;
        return resultFunction;
    };
    /**
     * Creates a function that, when executed, will only call the func function at most once per
     * every wait milliseconds. Provide an options object to indicate that func should be invoked
     * on the leading and/or trailing edge of the wait timeout. Subsequent calls to the throttled
     * function will return the result of the last func call.
     *
     * Note: If leading and trailing options are true func will be called on the trailing edge of
     * the timeout only if the the throttled function is invoked more than once during the wait timeout.
     *
     * @param func - The function to throttle.
     * @param wait - The number of milliseconds to throttle executions to. Defaults to 0.
     * @param options - The options object.
     * @returns The new throttled function.
     */
    TimerManagement.prototype.throttle = function (func, wait, options) {
        var _this = this;
        if (this.disposed) {
            var noOpFunction = (function () {
                /** Do nothing */
            });
            noOpFunction.cancel = function () {
                return;
            };
            noOpFunction.flush = (function () { return null; });
            noOpFunction.pending = function () { return false; };
            return noOpFunction;
        }
        var waitMS = wait || 0;
        var leading = true;
        var trailing = true;
        var lastExecuteTime = 0;
        var lastResult;
        // tslint:disable-next-line:no-any
        var lastArgs;
        var timeoutId = null;
        if (options && typeof options.leading === "boolean") {
            leading = options.leading;
        }
        if (options && typeof options.trailing === "boolean") {
            trailing = options.trailing;
        }
        var callback = function (userCall) {
            var now = new Date().getTime();
            var delta = now - lastExecuteTime;
            var waitLength = leading ? waitMS - delta : waitMS;
            if (delta >= waitMS && (!userCall || leading)) {
                lastExecuteTime = now;
                if (timeoutId) {
                    _this.clearTimeout(timeoutId);
                    timeoutId = null;
                }
                lastResult = func.apply(null, lastArgs);
            }
            else if (timeoutId === null && trailing) {
                timeoutId = _this.setTimeout(callback, waitLength);
            }
            return lastResult;
        };
        // tslint:disable-next-line:no-any
        var resultFunction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            lastArgs = args;
            return callback(true);
        };
        return resultFunction;
    };
    TimerManagement.prototype.removeInterval = function (intervalId) {
        var index = this.intervals.indexOf(intervalId);
        if (index >= 0) {
            this.intervals.splice(index, 1);
        }
    };
    TimerManagement.prototype.removeTimeout = function (timeoutId) {
        var index = this.timeouts.indexOf(timeoutId);
        if (index >= 0) {
            this.timeouts.splice(index, 1);
        }
    };
    return TimerManagement;
}());
export { TimerManagement };
