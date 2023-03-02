/**
 * Culture-related settings
 */
export interface ICultureInfo {
    dateTimeFormat: IDateTimeFormatSettings;
    name: string;
    numberFormat: INumberFormatSettings;
    numberShortForm: INumberShortForm;
}
/**
 * DateTime-format related culture settings
 */
export interface IDateTimeFormatSettings {
    AMDesignator: string;
    Calendar: {
        MinSupportedDateTime: string;
        MaxSupportedDateTime: string;
        AlgorithmType: number;
        CalendarType: number;
        Eras: any[];
        TwoDigitYearMax: number;
        convert?: {
            fromGregorian: (date: Date) => number[];
            toGregorian: (year: number, month: number, day: number) => Date;
        };
    };
    DateSeparator: string;
    FirstDayOfWeek: number;
    CalendarWeekRule: number;
    FullDateTimePattern: string;
    LongDatePattern: string;
    LongTimePattern: string;
    MonthDayPattern: string;
    PMDesignator: string;
    RFC1123Pattern: string;
    ShortDatePattern: string;
    ShortTimePattern: string;
    SortableDateTimePattern: string;
    TimeSeparator: string;
    UniversalSortableDateTimePattern: string;
    YearMonthPattern: string;
    AbbreviatedDayNames: string[];
    ShortestDayNames: string[];
    DayNames: string[];
    AbbreviatedMonthNames: string[];
    MonthNames: string[];
    NativeCalendarName: string;
    AbbreviatedMonthGenitiveNames: string[];
    MonthGenitiveNames: string[];
    eras: any[];
}
/**
 * Number Short form setting
 * it is the same internal class from the ClientCultureInfo.cs
 */
export interface INumberShortForm {
    QuantitySymbols: string[];
    NumberGroupSize: number;
    ThousandSymbol: string;
}
/**
 * Number formatting culture settings
 */
export interface INumberFormatSettings {
    CurrencyDecimalDigits: number;
    CurrencyDecimalSeparator: string;
    CurrencyGroupSizes: number[];
    NumberGroupSizes: number[];
    PercentGroupSizes: number[];
    CurrencyGroupSeparator: string;
    CurrencySymbol: string;
    NaNSymbol: string;
    CurrencyNegativePattern: number;
    NumberNegativePattern: number;
    PercentPositivePattern: number;
    PercentNegativePattern: number;
    NegativeInfinitySymbol: string;
    NegativeSign: string;
    NumberDecimalDigits: number;
    NumberDecimalSeparator: string;
    NumberGroupSeparator: string;
    CurrencyPositivePattern: number;
    PositiveInfinitySymbol: string;
    PositiveSign: string;
    PercentDecimalDigits: number;
    PercentDecimalSeparator: string;
    PercentGroupSeparator: string;
    PercentSymbol: string;
    PerMilleSymbol: string;
    NativeDigits: string[];
    DigitSubstitution: number;
}
/**
 * Get culture settings for the invariant culture
 */
export declare function getInvariantCulture(): ICultureInfo;
/**
 * Get culture settings for the current user's preferred culture
 */
export declare function getCurrentCulture(): ICultureInfo;
/**
 * Get the name of the current culture being used on this page
 */
export declare function getCurrentCultureName(): string;
/**
 * Get the number format settings for the current culture
 */
export declare function getNumberFormat(): INumberFormatSettings;
/**
 * Get the Number Short Form setting for the current culture
 */
export declare function getNumberShortForm(): INumberShortForm;
