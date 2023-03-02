/// <reference types="react" />
import { IReadonlyObservableValue, ObservableArray } from '../../Core/Observable';
export interface ISuggestionsListProps<T> {
    /**
     * The CSS classname of the suggestions list.
     */
    className?: string;
    /**
     * How the "no result found" should look in the suggestion list.
     */
    createDefaultItem?: (currentSuggestions: T[]) => T;
    /**
     * Used to indicate whether or not the suggestions are loading.
     */
    isLoading?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * The text to display while the results are loading.
     */
    loadingText?: string;
    /**
     * The text that should appear if no results are found when searching.
     */
    noResultsFoundText?: string;
    /**
     * What should occur the suggestion list loses focus.
     */
    onBlur?: () => void;
    /**
     * What should occur the suggestion list gets focus.
     */
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    /**
     * What should occur when a suggestion is clicked
     */
    onSuggestionClicked: (suggestion: ISuggestionItemProps<T>) => void;
    /**
     * How the "no result found" should look in the suggestion list.
     */
    renderNoResultFound?: () => JSX.Element;
    /**
     * How the suggestion should look in the suggestion list.
     */
    renderSuggestion?: (suggestionItemProps: ISuggestionItemProps<T>) => JSX.Element;
    /**
     * Maximum number of suggestions to show in the full suggestion list.
     */
    resultsMaximumNumber?: number;
    /**
     * The list of Suggestions that will be displayed
     */
    selectedIndex: IReadonlyObservableValue<number> | number;
    /**
     * The list of Suggestions that will be displayed
     */
    suggestions: ObservableArray<T> | T[];
    /**
     * An ARIA label for the container that is the parent of the suggestions.
     */
    suggestionsContainerAriaLabel?: string;
    /**
     * the classname of the suggestionitem.
     */
    suggestionsItemClassName?: string;
    /**
     * Width of the suggestion callout..
     */
    width?: number;
}
export interface ISuggestionItemProps<T> {
    /**
     * Class name to apply to the item.
     */
    className?: string;
    /**
     * The key for the item
     */
    id?: string;
    /**
     * Index of the suggestion item.
     */
    index: number;
    /**
     * Is the item selected.
     * @default false
     */
    isSelected?: boolean;
    /**
     * Item representing the suggestion.
     */
    item: T;
    /**
     * What should occur the suggestion item loses focus.
     */
    onBlur?: () => void;
    /**
     * What should occur the suggestion item gets focus.
     */
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    /**
     * The callback when an item is clicked
     */
    onClick: (suggestion: ISuggestionItemProps<T>) => void;
    /**
     * The callback used to render the suggestion item.
     */
    renderSuggestion: (suggestionItemProps?: ISuggestionItemProps<T>) => JSX.Element;
}
