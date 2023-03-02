import * as Culture from '../../Core/Util/Culture';
function prepareForComparison(value, upperCase) {
    return value ? (upperCase ? value.toLocaleUpperCase() : value) : "";
}
function comparer(a, b, ignoreCase) {
    // Optimization: if the strings are equal no need to convert and perform a locale compare.
    if (a === b) {
        return 0;
    }
    return prepareForComparison(a, ignoreCase).localeCompare(prepareForComparison(b, ignoreCase));
}
/**
 * String comparer (to use for sorting) which is case-sensitive
 *
 * @param a First string to compare
 * @param b Second string to compare
 */
export function localeComparer(a, b) {
    return comparer(a, b, false);
}
/**
 * String comparer (to use for sorting) which is case-insensitive
 *
 * @param a First string to compare
 * @param b Second string to compare
 */
export function localeIgnoreCaseComparer(a, b) {
    return comparer(a, b, true);
}
/**
 * Compares 2 strings for equality.
 *
 * @param a First string to compare
 * @param b Second string to compare
 * @param ignoreCase If true, do a case-insensitive comparison.
 */
export function equals(a, b, ignoreCase) {
    if (ignoreCase) {
        return localeIgnoreCaseComparer(a, b) === 0;
    }
    else {
        return localeComparer(a, b) === 0;
    }
}
/**
 * Checks whether the given string starts with the specified prefix.
 *
 * @param str String to check
 * @param prefix Substring that the {str} argument must start with in order to return true
 * @param ignoreCase If true, do a case insensitive comparison
 */
export function startsWith(str, prefix, ignoreCase) {
    var comparer = ignoreCase ? localeIgnoreCaseComparer : localeComparer;
    return comparer(prefix, str.substr(0, prefix.length)) === 0;
}
/**
 * Checks whether the given string ends with the specified suffix.
 *
 * @param str String to check
 * @param suffix Substring that the {str} argument must end with in order to return true
 * @param ignoreCase If true, do a case insensitive comparison
 */
export function endsWith(str, suffix, ignoreCase) {
    var comparer = ignoreCase ? localeIgnoreCaseComparer : localeComparer;
    return comparer(suffix, str.substr(str.length - suffix.length, suffix.length)) === 0;
}
/**
 * Performs a case-insensitive contains operation
 *
 * @param str String to check if it contains {subStr}
 * @param subStr The string that the {str} argument must contain in order to return true
 */
export function caseInsensitiveContains(str, subStr) {
    return str.toLocaleLowerCase().indexOf(subStr.toLocaleLowerCase()) !== -1;
}
/**
 * Generate a string using a format string and arguments.
 *
 * @param format Format string
 * @param args Arguments to use as replacements
 */
export function format(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return _stringFormat(false, format, args);
}
/**
 * Generate a string using a format string and arguments, using locale-aware argument replacements.
 *
 * @param format Format string
 * @param args Arguments to use as replacements
 */
export function localeFormat(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return _stringFormat(true, format, args);
}
function _stringFormat(useLocale, format, args) {
    var result = "";
    for (var i = 0;;) {
        var open_1 = format.indexOf("{", i);
        var close_1 = format.indexOf("}", i);
        if (open_1 < 0 && close_1 < 0) {
            result += format.slice(i);
            break;
        }
        if (close_1 > 0 && (close_1 < open_1 || open_1 < 0)) {
            if (format.charAt(close_1 + 1) !== "}") {
                throw new Error("The format string contains an unmatched opening or closing brace.");
            }
            result += format.slice(i, close_1 + 1);
            i = close_1 + 2;
            continue;
        }
        result += format.slice(i, open_1);
        i = open_1 + 1;
        if (format.charAt(i) === "{") {
            result += "{";
            i++;
            continue;
        }
        if (close_1 < 0) {
            throw new Error("The format string contains an unmatched opening or closing brace.");
        }
        var brace = format.substring(i, close_1);
        var colonIndex = brace.indexOf(":");
        var argNumber = parseInt(colonIndex < 0 ? brace : brace.substring(0, colonIndex), 10);
        if (isNaN(argNumber)) {
            throw new Error("The format string is invalid.");
        }
        var argFormat = colonIndex < 0 ? "" : brace.substring(colonIndex + 1);
        var arg = args[argNumber];
        if (typeof arg === "undefined" || arg === null) {
            arg = "";
        }
        if (arg.toFormattedString) {
            result += arg.toFormattedString(argFormat);
        }
        else if (typeof arg === "number") {
            result += numberToString(arg, useLocale, argFormat);
        }
        else if (arg instanceof Date) {
            result += dateToString(arg, useLocale);
        }
        else if (arg.format) {
            result += arg.format(argFormat);
        }
        else {
            result += arg.toString();
        }
        i = close_1 + 1;
    }
    return result;
}
var localeFormatters = ("Intl" in window) ? {
    date: new Intl.DateTimeFormat(),
    dateTime: new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    })
} : {};
/**
 * Converts a date to a string, optionally using the locale formatter
 *
 * @param value date to convert to a string
 * @param useLocale use the locale formatter when converting to a string
 */
export function dateToString(value, useLocale) {
    var localeKey = typeof useLocale === "string" ? useLocale : "dateTime";
    if (useLocale) {
        var formatter = localeFormatters[localeKey];
        if (!formatter) {
            if (false) {
                throw new Error("Unknown locale format: " + localeKey + ".");
            }
            else {
                formatter = localeFormatters["dateTime"];
            }
        }
        return formatter.format(value);
    }
    else {
        return value.toString();
    }
}
/**
 * String representation of the empty guid
 */
export var EmptyGuidString = "00000000-0000-0000-0000-000000000000";
/**
 * Is the given string in the format of a GUID
 *
 * @param str String to check
 */
export function isGuid(str) {
    return /^\{?([\dA-F]{8})-?([\dA-F]{4})-?([\dA-F]{4})-?([\dA-F]{4})-?([\dA-F]{12})\}?$/i.test(str);
}
/**
 * Returns a GUID such as xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 * @return New GUID.(UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
 * @notes Disclaimer: This implementation uses non-cryptographic random number generator so absolute uniqueness is not guarantee.
 */
export function newGuid() {
    // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
    var clockSequenceHi = (128 + Math.floor(Math.random() * 64)).toString(16);
    return oct(8) + "-" + oct(4) + "-4" + oct(3) + "-" + clockSequenceHi + oct(2) + "-" + oct(12);
}
var controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;
export function containsControlChars(str) {
    return controlChars.test(str);
}
var surrogateChars = /(^[\uD800-\uDFFF]$)|[^\uD800-\uDBFF](?=[\uDC00-\uDFFF])|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/;
export function containsMismatchedSurrogateChars(str) {
    return surrogateChars.test(str);
}
export function numberToString(value, useLocale, format) {
    if (!format || (format.length === 0) || (format === "i")) {
        if (useLocale) {
            return value.toLocaleString();
        }
        else {
            return value.toString();
        }
    }
    var percentPositivePattern = ["n %", "n%", "%n"];
    var percentNegativePattern = ["-n %", "-n%", "-%n"];
    var numberNegativePattern = ["(n)", "-n", "- n", "n-", "n -"];
    var currencyPositivePattern = ["$n", "n$", "$ n", "n $"];
    var currencyNegativePattern = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
    function zeroPad(str, count, left) {
        for (var l = str.length; l < count; l++) {
            str = (left ? ('0' + str) : (str + '0'));
        }
        return str;
    }
    function expandNumber(numToExpand, precision, groupSizes, separator, decimalChar) {
        var currentSize = groupSizes[0];
        var currentGroupIndex = 1;
        var factor = Math.pow(10, precision);
        var rounded = (Math.round(numToExpand * factor) / factor);
        if (!isFinite(rounded)) {
            rounded = numToExpand;
        }
        numToExpand = rounded;
        var numberString = numToExpand.toString();
        var right = "";
        var exponent;
        var split = numberString.split(/e/i);
        numberString = split[0];
        exponent = (split.length > 1 ? parseInt(split[1]) : 0);
        split = numberString.split('.');
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        if (exponent > 0) {
            right = zeroPad(right, exponent, false);
            numberString += right.slice(0, exponent);
            right = right.substr(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            numberString = zeroPad(numberString, exponent + 1, true);
            right = numberString.slice(-exponent, numberString.length) + right;
            numberString = numberString.slice(0, -exponent);
        }
        if (precision > 0) {
            if (right.length > precision) {
                right = right.slice(0, precision);
            }
            else {
                right = zeroPad(right, precision, false);
            }
            right = decimalChar + right;
        }
        else {
            right = "";
        }
        var stringIndex = numberString.length - 1;
        var ret = "";
        while (stringIndex >= 0) {
            if (currentSize === 0 || currentSize > stringIndex) {
                if (ret.length > 0) {
                    return numberString.slice(0, stringIndex + 1) + separator + ret + right;
                }
                else {
                    return numberString.slice(0, stringIndex + 1) + right;
                }
            }
            if (ret.length > 0) {
                ret = numberString.slice(stringIndex - currentSize + 1, stringIndex + 1) + separator + ret;
            }
            else {
                ret = numberString.slice(stringIndex - currentSize + 1, stringIndex + 1);
            }
            stringIndex -= currentSize;
            if (currentGroupIndex < groupSizes.length) {
                currentSize = groupSizes[currentGroupIndex];
                currentGroupIndex++;
            }
        }
        return numberString.slice(0, stringIndex + 1) + separator + ret + right;
    }
    var numberFormat = useLocale ? Culture.getCurrentCulture().numberFormat : Culture.getInvariantCulture().numberFormat;
    var num;
    if (!format) {
        format = "D";
    }
    var precision = -1;
    if (format.length > 1)
        precision = parseInt(format.slice(1), 10);
    var pattern;
    switch (format.charAt(0)) {
        case "d":
        case "D":
            pattern = 'n';
            if (precision !== -1) {
                num = zeroPad("" + Math.abs(value), precision, true);
                if (value < 0) {
                    num = "-" + num;
                }
            }
            else {
                num = "" + value;
            }
            break;
        case "c":
        case "C":
            if (value < 0) {
                pattern = currencyNegativePattern[numberFormat.CurrencyNegativePattern];
            }
            else {
                pattern = currencyPositivePattern[numberFormat.CurrencyPositivePattern];
            }
            if (precision === -1) {
                precision = numberFormat.CurrencyDecimalDigits;
            }
            num = expandNumber(Math.abs(value), precision, numberFormat.CurrencyGroupSizes, numberFormat.CurrencyGroupSeparator, numberFormat.CurrencyDecimalSeparator);
            break;
        case "n":
        case "N":
            if (value < 0) {
                pattern = numberNegativePattern[numberFormat.NumberNegativePattern];
            }
            else {
                pattern = 'n';
            }
            if (precision === -1) {
                precision = numberFormat.NumberDecimalDigits;
            }
            num = expandNumber(Math.abs(value), precision, numberFormat.NumberGroupSizes, numberFormat.NumberGroupSeparator, numberFormat.NumberDecimalSeparator);
            break;
        case "p":
        case "P":
            if (value < 0) {
                pattern = percentNegativePattern[numberFormat.PercentNegativePattern];
            }
            else {
                pattern = percentPositivePattern[numberFormat.PercentPositivePattern];
            }
            if (precision === -1) {
                precision = numberFormat.PercentDecimalDigits;
            }
            num = expandNumber(Math.abs(value) * 100, precision, numberFormat.PercentGroupSizes, numberFormat.PercentGroupSeparator, numberFormat.PercentDecimalSeparator);
            break;
        default:
            throw new Error("Format specifier was invalid.");
    }
    var regex = /n|\$|-|%/g;
    var ret = "";
    for (;;) {
        var index = regex.lastIndex;
        var ar = regex.exec(pattern);
        ret += pattern.slice(index, ar ? ar.index : pattern.length);
        if (!ar)
            break;
        switch (ar[0]) {
            case "n":
                ret += num;
                break;
            case "$":
                ret += numberFormat.CurrencySymbol;
                break;
            case "-":
                if (/[1-9]/.test(num)) {
                    ret += numberFormat.NegativeSign;
                }
                break;
            case "%":
                ret += numberFormat.PercentSymbol;
                break;
            default:
                throw new Error("Invalid number format pattern");
        }
    }
    return ret;
}
/**
 * Generated non-zero octet sequences for use with GUID generation.
 *
 * @param length Length required.
 * @return Non-Zero hex sequences.
 */
function oct(length) {
    var result = "";
    for (var i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 0x10).toString(16);
    }
    return result;
}
