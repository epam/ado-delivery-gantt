/**
 * String comparer (to use for sorting) which is case-sensitive
 *
 * @param a First string to compare
 * @param b Second string to compare
 */
export declare function localeComparer(a: string, b: string): number;
/**
 * String comparer (to use for sorting) which is case-insensitive
 *
 * @param a First string to compare
 * @param b Second string to compare
 */
export declare function localeIgnoreCaseComparer(a: string, b: string): number;
/**
 * Compares 2 strings for equality.
 *
 * @param a First string to compare
 * @param b Second string to compare
 * @param ignoreCase If true, do a case-insensitive comparison.
 */
export declare function equals(a: string, b: string, ignoreCase?: boolean): boolean;
/**
 * Checks whether the given string starts with the specified prefix.
 *
 * @param str String to check
 * @param prefix Substring that the {str} argument must start with in order to return true
 * @param ignoreCase If true, do a case insensitive comparison
 */
export declare function startsWith(str: string, prefix: string, ignoreCase?: boolean): boolean;
/**
 * Checks whether the given string ends with the specified suffix.
 *
 * @param str String to check
 * @param suffix Substring that the {str} argument must end with in order to return true
 * @param ignoreCase If true, do a case insensitive comparison
 */
export declare function endsWith(str: string, suffix: string, ignoreCase?: boolean): boolean;
/**
 * Performs a case-insensitive contains operation
 *
 * @param str String to check if it contains {subStr}
 * @param subStr The string that the {str} argument must contain in order to return true
 */
export declare function caseInsensitiveContains(str: string, subStr: string): boolean;
/**
 * Generate a string using a format string and arguments.
 *
 * @param format Format string
 * @param args Arguments to use as replacements
 */
export declare function format(format: string, ...args: any[]): string;
/**
 * Generate a string using a format string and arguments, using locale-aware argument replacements.
 *
 * @param format Format string
 * @param args Arguments to use as replacements
 */
export declare function localeFormat(format: string, ...args: any[]): string;
/**
 * Converts a date to a string, optionally using the locale formatter
 *
 * @param value date to convert to a string
 * @param useLocale use the locale formatter when converting to a string
 */
export declare function dateToString(value: Date, useLocale?: boolean | string): string;
/**
 * String representation of the empty guid
 */
export declare const EmptyGuidString = "00000000-0000-0000-0000-000000000000";
/**
 * Is the given string in the format of a GUID
 *
 * @param str String to check
 */
export declare function isGuid(str: string): boolean;
/**
 * Returns a GUID such as xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 * @return New GUID.(UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
 * @notes Disclaimer: This implementation uses non-cryptographic random number generator so absolute uniqueness is not guarantee.
 */
export declare function newGuid(): string;
export declare function containsControlChars(str: string): boolean;
export declare function containsMismatchedSurrogateChars(str: string): boolean;
export declare function numberToString(value: number, useLocale?: boolean, format?: string): string;
