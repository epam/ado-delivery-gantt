/// <reference types="react" />
import { IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IIconProps } from '../../Icon';
import { IPillProps } from '../../Pill';
import { ISuggestionItemProps } from '../../SuggestionsList';
export interface ISelectedTagProps extends IPillProps {
    /**
     * Content to show in the pill when selected.
     */
    content: string | JSX.Element;
}
export interface ITagPickerProps<T> {
    /**
     * Callback to determine if two tags are identical.
     */
    areTagsEqual: (first: T, second: T) => boolean;
    /**
     * Aria label
     */
    ariaLabel?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     * Defaults to FormItem's label if this TagPicker is used within.
     *
     */
    ariaLabelledBy?: string;
    /**
     * css class added to the tag picker.
     */
    className?: string;
    /**
     * Callback which converts one of the tag items to a pill.
     */
    convertItemToPill: (item: T, index: number) => ISelectedTagProps;
    /**
     * Callback to create a default item from a search string.
     */
    createDefaultItem?: (searchString: string) => T | undefined;
    /**
     * String used to break apart a search string. If this is set, you should also define onDelimitedSearch
     * to handle input where the user has pasted in several items delimited
     */
    deliminator?: string;
    /**
     * Text to show when the search does not show any suggestions
     */
    noResultsFoundText: string;
    /**
     * Callback when focus has entered the TagPicker input field.
     */
    onFocus?: () => void;
    /**
     * Callback when focus has left the TagPicker.
     * @param text text value of the tag pick before focusing away
     */
    onBlur?: (text?: string) => void;
    /**
     * Callback when the user has typed or pasted a string with the deliminator. The callback returns the equivalent of searchString.split(this.props.deliminator)
     */
    onDelimitedSearch?: (strings: string[]) => void;
    /**
     * Callback when the user clicks or focuses on an empty text field. This can be used to show an MRU list
     */
    onEmptyInputFocus?: () => void;
    /**
     * Callback for when the right arrow key is pressed inside the tag picker.
     */
    onSuggestionExpanded?: (tag: T) => void;
    /**
     * Callback when the text value of the input tag has changed. This callback should change the suggestions and suggestionsLoading values appropriately.
     */
    onSearchChanged: (searchValue: string) => void;
    /**
     * Number in milliseconds that determines how long to debounce the supplied onSearchChanged or onDelimitedSearch function for.
     * @default 250
     */
    onSearchChangedDebounceWait?: number;
    /**
     * Callback when a tag is chosen. Unless the tag is not valid, the consumer should update the suggestions list.
     */
    onTagAdded: (tag: T) => void;
    /**
     * Callback when a tag is removed. Unless the tag is not valid, the consumer should update the suggestions list.
     */
    onTagRemoved: (tag: T) => void;
    /**
     * Callback when a group of tags is removed. Unless the tag is not valid, the consumer should update the suggestions list. If this is not
     * specified, then the user cannot select multiple tags for deletion.
     */
    onTagsRemoved?: (tags: T[]) => void;
    /**
     * Placeholder text to show when the input has no text and there are no selected tags
     */
    placeholderText?: string;
    /**
     * Icon props to show at the beginning of the picker control when there is nothing selected
     */
    prefixIconProps?: IIconProps;
    /**
     * Callback to render the suggestion row for a given suggestion.
     */
    renderSuggestionItem: (itemProps: ISuggestionItemProps<T>) => JSX.Element;
    /**
     * List of tags currently selected by the user. This prop is 100% controlled
     * by the consumer. onTagAdded/onTagRemoved/onTagsRemoved must also be implemented in order to
     * work properly. If this value is a an item, the prop must be
     * updated to cause the Tag Picker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the Tag Picker
     * to re-render.
     */
    selectedTags: IReadonlyObservableArray<T> | T[];
    /**
     * Function to determine if blur should clear the textfield and close the suggestions list
     */
    shouldBlurClear?: () => boolean;
    /**
     * List of suggestions for the given search value. This prop is 100% controlled
     * by the consumer. onSearchChanged must also be implemented in order to
     * work properly. If this value is a an item, the prop must be
     * updated to cause the Tag Picker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the Tag Picker
     * to re-render.
     */
    suggestions: IReadonlyObservableArray<T> | T[];
    /**
     * boolean indicating if the control is waiting to generate its suggestions list. This prop is 100% controlled
     * by the consumer. onSearchChanged must also be implemented in order to
     * work properly. If this value is a an T, the prop must be
     * updated to cause the Tag Picker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the Tag Picker
     */
    suggestionsLoading: IReadonlyObservableValue<boolean> | boolean;
    /**
     * String to show when results are loading
     */
    suggestionsLoadingText?: string;
}
