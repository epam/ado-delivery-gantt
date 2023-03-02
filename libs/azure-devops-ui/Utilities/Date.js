import { format } from '../Core/Util/String';
import * as PlatformResources from '../Resources.Core';
export var millisecond = 1;
export var second = millisecond * 1000;
export var minute = second * 60;
export var hour = minute * 60;
export var day = hour * 24;
export var week = day * 7;
/**
 * Enum for formats of ago representations of time.
 * @readonly
 * @enum {number}
 */
export var AgoFormat;
(function (AgoFormat) {
    /** The compact representation of time in ago format. */
    AgoFormat[AgoFormat["Compact"] = 0] = "Compact";
    /** The extended representation time in ago fromat. */
    AgoFormat[AgoFormat["Extended"] = 1] = "Extended";
})(AgoFormat || (AgoFormat = {}));
var agoFormatters = {};
/**
 * Generate a string indicating how long ago the date is.
 *
 * @param date The Date object to format
 * @param agoFormat The required format
 * @param now The Dateobject of reference time
 * @param locale The current locale
 * @return A friendly string
 */
export function ago(date, agoFormat, now, locale) {
    var agoFormatter = agoFormatters[locale || ""];
    if (!agoFormatter) {
        agoFormatters[locale || ""] = agoFormatter = {};
    }
    if (!now) {
        now = new Date();
    }
    if (!agoFormat) {
        agoFormat = AgoFormat.Compact;
    }
    // Getting the difference in milliseconds between now and the specified date
    var diff = now.getTime() - date.getTime();
    var result = "";
    if (diff < 2 * minute) {
        result = PlatformResources.JustNow;
    }
    else if (agoFormat === AgoFormat.Compact) {
        if (diff < 59 * minute) {
            result = format(PlatformResources.AgoMinutes, Math.round(diff / minute));
        }
        else if (now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
            result = format(PlatformResources.AgoHours, Math.round(diff / hour));
        }
        else if (diff < week && now.getDay() !== date.getDay()) {
            var yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            if (date.getDate() === yesterday.getDate()) {
                result = PlatformResources.Yesterday;
            }
            else {
                result = date.toLocaleString(locale, { weekday: "long" });
            }
        }
        else if (now.getFullYear() === date.getFullYear()) {
            agoFormatter.ctShortFormat = agoFormatter.ctShortFormat || new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
            result = agoFormatter.ctShortFormat.format(date);
        }
        else {
            agoFormatter.ctLongFormat =
                agoFormatter.ctLongFormat || new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", day: "numeric" });
            result = agoFormatter.ctLongFormat.format(date);
        }
    }
    else if (agoFormat === AgoFormat.Extended) {
        var dayPart = "";
        if (now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()) {
            dayPart = PlatformResources.Today;
        }
        else if (diff < week && now.getDay() !== date.getDay()) {
            var yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            if (date.getDate() === yesterday.getDate()) {
                dayPart = PlatformResources.Yesterday;
            }
            else {
                agoFormatter.exWeekFormat = agoFormatter.exWeekFormat || new Intl.DateTimeFormat(locale, { weekday: "short" });
                dayPart = agoFormatter.exWeekFormat.format(date);
            }
        }
        else if (now.getFullYear() === date.getFullYear()) {
            agoFormatter.exMonthFormat = agoFormatter.exMonthFormat || new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
            dayPart = agoFormatter.exMonthFormat.format(date);
        }
        else {
            agoFormatter.exYearFormat =
                agoFormatter.exYearFormat || new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", day: "numeric" });
            dayPart = agoFormatter.exYearFormat.format(date);
        }
        agoFormatter.timeFormat = agoFormatter.timeFormat || new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric" });
        var timePart = agoFormatter.timeFormat.format(date);
        result = format(PlatformResources.DayAtTimeFormat, dayPart, timePart);
    }
    if (!result) {
        result = date.toString();
    }
    return result;
}
/**
 * Enum for formats of log representation of time.
 * @readonly
 * @enum {number}
 */
export var LogType;
(function (LogType) {
    /** The ISO representation of time. */
    LogType[LogType["Full"] = 0] = "Full";
    /** The date, time and timezone representation of time. */
    LogType[LogType["Date"] = 1] = "Date";
    /** The time and timezone representation of time. */
    LogType[LogType["Local"] = 2] = "Local";
})(LogType || (LogType = {}));
var logFormatters = {};
/**
 * Returns string representation for date to be used in log.
 *
 * @param date The Date object to format
 * @param logType The required format
 * @param locale The current locale
 * @return A string representation of date in requested format
 */
export function log(date, logType, locale) {
    var logFormatter = logFormatters[locale || ""];
    if (!logFormatter) {
        logFormatters[locale || ""] = logFormatter = {};
    }
    var result = "";
    if (!logType) {
        logType = LogType.Full;
    }
    if (LogType.Full === logType) {
        result = date.toISOString();
    }
    else if (LogType.Date === logType) {
        logFormatter.dayFormatShort = logFormatter.dayFormatShort || new Intl.DateTimeFormat(locale, { month: "2-digit", day: "2-digit" });
        var dayPart = logFormatter.dayFormatShort.format(date);
        logFormatter.timeFormatShort =
            logFormatter.timeFormatShort ||
                new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" });
        var timePart = logFormatter.timeFormatShort.format(date);
        result = dayPart + " " + timePart;
    }
    else if (LogType.Local === logType) {
        logFormatter.timeFormatLong =
            logFormatter.timeFormatLong ||
                new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "short" });
        result = logFormatter.timeFormatLong.format(date);
    }
    if (!result) {
        result = date.toString();
    }
    return result;
}
/**
 * Returns string representation for date to be used in duration.
 *
 * @param startDate The Date object to format
 * @param endDate The Dateobject of reference time
 * @return A string representation of date in requested format
 */
export function duration(startDate, endDate) {
    if (!endDate) {
        endDate = new Date();
    }
    // Getting the difference in seconds between now and the specified date
    var diff = endDate.getTime() - startDate.getTime();
    var result = "";
    if (diff < second) {
        result = PlatformResources.LessThanASecond;
    }
    else if (diff < minute) {
        result = format(PlatformResources.Seconds, Math.floor(diff / second));
    }
    else {
        var days = Math.floor(diff / day);
        var hours = Math.floor((diff % day) / hour);
        var minutes = Math.floor((diff % hour) / minute);
        var seconds = Math.floor((diff % minute) / second);
        if (diff < hour) {
            result = format(PlatformResources.MinutesSeconds, minutes, seconds);
        }
        else if (diff < day) {
            result = format(PlatformResources.HoursMinutesSeconds, hours, minutes, seconds);
        }
        else {
            result = format(PlatformResources.DaysHoursMinutes, days, hours, minutes);
        }
    }
    return result;
}
var tooltipFormatters = {};
/**
 * Returns string representation for date to be used as a tooltip for ago and duration.
 *
 * @param date The Date object to format
 * @param locale The current locale
 * @return A string representation of date in requested format
 */
export function tooltipString(date, locale) {
    var tooltipFormatter = tooltipFormatters[locale || ""];
    if (!tooltipFormatter) {
        tooltipFormatters[locale || ""] = tooltipFormatter = {};
    }
    // Ensure our formatters are initialized, we lazy initialize them to avoid
    // the startup time. These can be expensive (few milliseconds).
    tooltipFormatter.dayFormat = tooltipFormatter.dayFormat || new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", day: "numeric" });
    tooltipFormatter.timeFormat =
        tooltipFormatter.timeFormat || new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric", timeZoneName: "short" });
    // Return the formatted date/time.
    return format(PlatformResources.DayAtTimeFormat, tooltipFormatter.dayFormat.format(date), tooltipFormatter.timeFormat.format(date));
}
