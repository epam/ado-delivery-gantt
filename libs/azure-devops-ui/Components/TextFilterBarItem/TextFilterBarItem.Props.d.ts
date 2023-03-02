import { IFilterBarItemProps } from '../../FilterBarItem';
import { TextFieldStyle, TextFieldWidth } from '../../TextField';
import { IFilter } from '../../Utilities/Filter';
/**
 * Properties for a text-box filter bar item component
 */
export interface ITextFilterBarProps extends IFilterBarItemProps {
    /**
     * Optional className to use for the FilterBarItem
     */
    className?: string;
    /**
     * Show a clear button when the TextField has a value that resets the value to empty.
     */
    clearable?: boolean;
    /**
     * Optional className to use for the TextFilterBarItem's input element
     */
    inputClassName?: string;
    /**
     * Placeholder text for the TextField
     */
    placeholder?: string;
    /**
     * The maxLength property to be passed to the input in the TextField.
     * Default value is 200 characters.
     */
    maxTextLength?: number;
    /**
     * Changes visual appearance of TextField. Use TextFieldStyle.inline to style as an inline text field.
     * @default TextFieldStyle.normal
     */
    style?: TextFieldStyle;
    /**
     * The throttle wait time to use when updating the filter. The text field
     * will still update on every keystroke, but the updating the filter
     * itself will be throttled by this amount. The default value is 200 ms.
     * Passing a value of 0 here will cause this text field not to be throttled.
     */
    throttleWait?: number;
    /**
     * Changes visual appearance of TextField. Use TextFieldWidth.standard to get the standard text field width.
     * @default TextFieldWidth.auto
     */
    width?: TextFieldWidth;
}
export interface IInlineKeywordFilterBarItemProps extends ITextFilterBarProps {
    /**
     * The filter store that this filter bar updates (optional, the parent FilterBar's filter is used by default)
     */
    filter?: IFilter;
    /**
     * The unique key for this filter item whose value is updated by changes to this filter item.
     */
    filterItemKey: string;
    /**
     * The maxLength property to be passed to the input in the TextField.
     * Default value is 200 characters.
     */
    maxTextLength?: number;
    /**
     * Placeholder text for the TextField
     */
    placeholder?: string;
}
