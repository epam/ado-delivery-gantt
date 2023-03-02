export interface IDebounceOptions {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}
export declare type ICancelable<T> = {
    flush: () => T;
    cancel: () => void;
    pending: () => boolean;
};
/**
 * The TimerManagement class is used to track a set of timers.
 */
export declare class TimerManagement {
    private disposed;
    private immediateIds;
    private intervals;
    private parent;
    private timeouts;
    constructor(parent?: object);
    /**
     * clearAllTimers is used to clear any active timers in the object.
     */
    clearAllTimers(): void;
    /**
     * Clears the immediate.
     * @param id - Id to cancel.
     */
    clearImmediate(id: number): void;
    /**
     * clearInterval is used to stop the series of callbacks that was setup through setInterval.
     *
     * @param intervalId - The id returned from eh setInterval call that you want stopped.
     */
    clearInterval(intervalId: number): void;
    /**
     * clearTimeout is used to stop a timeout callback that was setup through setTimeout.
     *
     * @param timeoutId - The id returned from the setTimeout call that you want stopped.
     */
    clearTimeout(timeoutId: number): void;
    /**
     * SetImmediate override, which will auto cancel the immediate during dispose.
     * @param callback - Callback to execute.
     * @returns The setTimeout id.
     */
    setImmediate(callback: () => void): number;
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
    setInterval(callback: (...args: any[]) => void, milliseconds: number, ...args: any[]): number;
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
    setTimeout(callback: (...args: any[]) => void, milliseconds?: number, ...args: any[]): number;
    dispose(): void;
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
    debounce<T extends Function>(func: T, wait?: number, options?: IDebounceOptions): ICancelable<T> & (() => void);
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
    throttle<T extends Function>(func: T, wait?: number, options?: {
        leading?: boolean;
        trailing?: boolean;
    }): T | (() => void);
    private removeInterval;
    private removeTimeout;
}
