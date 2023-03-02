/**
 * Causes screen readers to read the given message.
 * @param message
 * @param assertive if true, the screen reader will read the announcement immediately, instead of waiting for "the next graceful opportunity"
 */
export declare function announce(message: string | undefined, assertive?: boolean, pause?: number): void;
export interface ProgressAnnouncerOptions {
    /**
     * The amount of time to wait after the operation has begun before announcing the start (in
     * milliseconds).
     */
    announceStartDelay?: number;
    /**
     * The message to announce to the user at the start of the operation. Leave blank or undefined
     * for no announcement.
     */
    announceStartMessage?: string;
    /**
     * The message to announce to the user at the end of the operation. Leave blank or undefined
     * for no announcement.
     */
    announceEndMessage?: string;
    /**
     * The message to announce to the user if the operation fails. Leave blank or undefined for no
     * announcement.
     */
    announceErrorMessage?: string;
}
/**
 * Class for announcing, through a screen reader, when a single operation begins and ends. Supports
 * a delay before the starting announcement so that quick operations don't trigger announcements.
 *
 * To use, create a ProgressAnnouncer, and call completed()
 */
export declare class ProgressAnnouncer {
    /**
     * Create a ProgressAnnouncer for a promise that will announce promise start and completion/rejection.
     * @param promise
     * @param options
     */
    static forPromise<T>(promise: Promise<T>, options: ProgressAnnouncerOptions): ProgressAnnouncer;
    private _options;
    private _startAnnounced;
    private _completed;
    constructor(options: ProgressAnnouncerOptions);
    /**
     * Call this method when the operation has completed. This will cause the end message to be
     * announced if the start message was announced.
     */
    announceCompleted(): void;
    /**
     * Call this method if the operation completes with an error. This will cause the error message
     * to be announced regardless of whether or not the start message was announced.
     */
    announceError(): void;
    /**
     * Call this method to stop any announcements from being made
     */
    cancel(): void;
    private _start;
}
