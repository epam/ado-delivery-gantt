var currentCulture;
var invariantCulture;
/**
 * Get culture settings for the invariant culture
 */
export function getInvariantCulture() {
    if (!invariantCulture) {
        invariantCulture = {
            name: "en-US",
            numberFormat: {
                CurrencyDecimalDigits: 2,
                CurrencyDecimalSeparator: ".",
                CurrencyGroupSizes: [3],
                NumberGroupSizes: [3],
                PercentGroupSizes: [3],
                CurrencyGroupSeparator: ",",
                CurrencySymbol: "$",
                NaNSymbol: "NaN",
                CurrencyNegativePattern: 0,
                NumberNegativePattern: 1,
                PercentPositivePattern: 0,
                PercentNegativePattern: 0,
                NegativeInfinitySymbol: "-Infinity",
                NegativeSign: "-",
                NumberDecimalDigits: 2,
                NumberDecimalSeparator: ".",
                NumberGroupSeparator: ",",
                CurrencyPositivePattern: 0,
                PositiveInfinitySymbol: "Infinity",
                PositiveSign: "+",
                PercentDecimalDigits: 2,
                PercentDecimalSeparator: ".",
                PercentGroupSeparator: ",",
                PercentSymbol: "%",
                PerMilleSymbol: "\u2030",
                NativeDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                DigitSubstitution: 1
            },
            numberShortForm: {
                QuantitySymbols: ["K", "M", "B"],
                NumberGroupSize: 1000,
                ThousandSymbol: "K"
            },
            dateTimeFormat: {
                AMDesignator: "AM",
                Calendar: {
                    MinSupportedDateTime: "@-62135568000000@",
                    MaxSupportedDateTime: "@253402300799999@",
                    AlgorithmType: 1,
                    CalendarType: 1,
                    Eras: [1],
                    TwoDigitYearMax: 2029
                },
                DateSeparator: "/",
                FirstDayOfWeek: 0,
                CalendarWeekRule: 0,
                FullDateTimePattern: "dddd, MMMM dd, yyyy h:mm:ss tt",
                LongDatePattern: "dddd, MMMM dd, yyyy",
                LongTimePattern: "h:mm:ss tt",
                MonthDayPattern: "MMMM dd",
                PMDesignator: "PM",
                RFC1123Pattern: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
                ShortDatePattern: "M/d/yyyy",
                ShortTimePattern: "h:mm tt",
                SortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                TimeSeparator: ":",
                UniversalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                YearMonthPattern: "MMMM, yyyy",
                AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                ShortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                MonthNames: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                    ""
                ],
                NativeCalendarName: "Gregorian Calendar",
                AbbreviatedMonthGenitiveNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                MonthGenitiveNames: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                    ""
                ],
                eras: [1, "A.D.", null, 0]
            }
        };
    }
    return invariantCulture;
}
/**
 * Get culture settings for the current user's preferred culture
 */
export function getCurrentCulture() {
    if (!currentCulture) {
        currentCulture = getInvariantCulture();
    }
    return currentCulture;
}
/**
 * Get the name of the current culture being used on this page
 */
export function getCurrentCultureName() {
    return getCurrentCulture().name;
}
/**
 * Get the number format settings for the current culture
 */
export function getNumberFormat() {
    return getCurrentCulture().numberFormat;
}
/**
 * Get the Number Short Form setting for the current culture
 */
export function getNumberShortForm() {
    return getCurrentCulture().numberShortForm;
}
