import { __awaiter, __generator } from "tslib";
import * as React from "react";
/**
 * makeCancelable is used to wrap an existing promise and support canceling
 * the promise. This doesnt actually stop the promise from completing, instead
 * it will send an isCanceled value to the resolve and reject methods when
 * the promise is canceled.
 */
export var makeCancelable = function (promise) {
    var isCanceled = false;
    var wrappedPromise = new Promise(function (resolve, reject) {
        var rejectIfCanceled = function () {
            if (isCanceled) {
                // Add an empty reject handler to avoid browser console errors
                // every time a promise is canceled.
                wrappedPromise.catch(function () { });
                reject({ isCanceled: true });
            }
            return isCanceled;
        };
        promise.then(function (val) { return rejectIfCanceled() || resolve(val); });
        promise.catch(function (error) { return rejectIfCanceled() || reject(error); });
    });
    return {
        promise: wrappedPromise,
        cancel: function () {
            isCanceled = true;
        }
    };
};
/**
 * Returns a promise that, if the given promise resolves in less than timeoutMs, resolves to the
 * resolution (or rejection) of the given promise. If the given promise does not resolve in less
 * than timeoutMs, reject with the given message.
 * @param promise
 * @param timeoutMs
 * @param message message to send with the rejection when the timeout expires
 */
export function timeout(promise, timeoutMs, message) {
    return new Promise(function (resolve, reject) {
        var timeoutHandle = setTimeout(function () {
            reject(message == null ? "Timed out after " + timeoutMs + " ms." : message);
        }, timeoutMs);
        // Maybe use finally when it's available.
        promise.then(function (result) {
            resolve(result);
            clearTimeout(timeoutHandle);
        }, function (reason) {
            reject(reason);
            clearTimeout(timeoutHandle);
        });
    });
}
/**
 * Returns a promise that resolves after timeoutMs.
 * @param timeoutMs
 */
export function wait(timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, timeoutMs);
                })];
        });
    });
}
/**
 * Return a promise that resolves at least delayMs from now. Rejection happens immediately.
 */
export function delay(promise, delayMs) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([promise, wait(delayMs)])];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
}
/**
 * Returns a promise that resolves after all given promises have either resolved or rejected.
 * @deprecated just use Promise.allSettled() now.
 */
export function allSettled(promises) {
    var results = new Array(promises.length);
    return new Promise(function (resolve) {
        var count = 0;
        var _loop_1 = function (i) {
            var promise = promises[i];
            promise
                .then(function (result) {
                results[i] = {
                    state: "fulfilled",
                    value: result
                };
            }, function (reason) {
                results[i] = {
                    state: "rejected",
                    reason: reason
                };
            })
                .then(function () {
                if (++count === promises.length) {
                    resolve(results);
                }
            });
        };
        for (var i = 0; i < promises.length; ++i) {
            _loop_1(i);
        }
    });
}
/**
 * Custom hook to cancel promises when the component unmounts
 *
 * Example:
 * ```
 * const { trackPromise } = usePromise();
 *
 * useEffect(() => {
 *  const x: Promise<number> = svc.doSomethingAsync();
 *  trackPromise(x).then(() => ...);
 * });
 * ```
 */
export function usePromise() {
    var promises = React.useRef([]);
    React.useEffect(function () {
        // Called when the component unmounts to cancel all pending promises
        return function () {
            if (promises.current) {
                promises.current.forEach(function (p) { return p.cancel(); });
                promises.current = null;
            }
        };
    }, []);
    var trackPromise = React.useCallback(function (originalPromise) {
        var cancelablePromise = makeCancelable(originalPromise);
        if (!promises.current) {
            throw new Error("usePromise hook: `trackPromise` called after using component was unmounted.");
        }
        promises.current.push(cancelablePromise);
        return cancelablePromise.promise;
    }, []);
    return {
        trackPromise: trackPromise
    };
}
