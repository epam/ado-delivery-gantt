export declare const millisecond = 1;
export declare const second: number;
export declare const minute: number;
export declare const hour: number;
export declare const day: number;
export declare const week: number;
/**
 * Enum for formats of ago representations of time.
 * @readonly
 * @enum {number}
 */
export declare enum AgoFormat {
    /** The compact representation of time in ago format. */
    Compact = 0,
    /** The extended representation time in ago fromat. */
    Extended = 1
}
/**
 * Generate a string indicating how long ago the date is.
 *
 * @param date The Date object to format
 * @param agoFormat The required format
 * @param now The Dateobject of reference time
 * @param locale The current locale
 * @return A friendly string
 */
export declare function ago(date: Date, agoFormat?: AgoFormat, now?: Date, locale?: string): string;
/**
 * Enum for formats of log representation of time.
 * @readonly
 * @enum {number}
 */
export declare enum LogType {
    /** The ISO representation of time. */
    Full = 0,
    /** The date, time and timezone representation of time. */
    Date = 1,
    /** The time and timezone representation of time. */
    Local = 2
}
/**
 * Returns string representation for date to be used in log.
 *
 * @param date The Date object to format
 * @param logType The required format
 * @param locale The current locale
 * @return A string representation of date in requested format
 */
export declare function log(date: Date, logType?: LogType, locale?: string): string;
/**
 * Returns string representation for date to be used in duration.
 *
 * @param startDate The Date object to format
 * @param endDate The Dateobject of reference time
 * @return A string representation of date in requested format
 */
export declare function duration(startDate: Date, endDate?: Date): string;
/**
 * Returns string representation for date to be used as a tooltip for ago and duration.
 *
 * @param date The Date object to format
 * @param locale The current locale
 * @return A string representation of date in requested format
 */
export declare function tooltipString(date: Date, locale?: string): string;
