/**
 * When a promise is made cancelable we return a CancelablePromise<T>.
 */
export interface ICancelablePromise<T> {
    promise: Promise<T>;
    cancel: () => void;
}
/**
 * When a cancelable promise is used it may return an ICancelReason or the underlying
 * rejection from the wrapped promise.
 */
export interface ICancelReason {
    isCanceled: boolean;
}
/**
 * makeCancelable is used to wrap an existing promise and support canceling
 * the promise. This doesnt actually stop the promise from completing, instead
 * it will send an isCanceled value to the resolve and reject methods when
 * the promise is canceled.
 */
export declare const makeCancelable: <T>(promise: Promise<T>) => ICancelablePromise<T>;
/**
 * Returns a promise that, if the given promise resolves in less than timeoutMs, resolves to the
 * resolution (or rejection) of the given promise. If the given promise does not resolve in less
 * than timeoutMs, reject with the given message.
 * @param promise
 * @param timeoutMs
 * @param message message to send with the rejection when the timeout expires
 */
export declare function timeout<T>(promise: PromiseLike<T>, timeoutMs: number, message?: string): Promise<T>;
/**
 * Returns a promise that resolves after timeoutMs.
 * @param timeoutMs
 */
export declare function wait(timeoutMs: number): Promise<void>;
/**
 * Return a promise that resolves at least delayMs from now. Rejection happens immediately.
 */
export declare function delay<T>(promise: Promise<T>, delayMs: number): Promise<T>;
export interface IResolvedPromiseResult<T> {
    state: "fulfilled";
    value: T;
}
export interface IRejectedPromiseResult {
    state: "rejected";
    reason: any;
}
export declare type IPromiseResult<T = any> = IResolvedPromiseResult<T> | IRejectedPromiseResult;
/**
 * Returns a promise that resolves after all given promises have either resolved or rejected.
 * @deprecated just use Promise.allSettled() now.
 */
export declare function allSettled<T = any>(promises: PromiseLike<T>[]): Promise<IPromiseResult<T>[]>;
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
export declare function usePromise(): {
    trackPromise: <T>(originalPromise: Promise<T>) => Promise<T>;
};
