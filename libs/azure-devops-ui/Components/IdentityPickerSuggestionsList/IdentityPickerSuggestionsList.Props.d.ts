/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { ICalloutProps } from '../../Callout';
import { ISuggestionItemProps, ISuggestionsListProps } from '../../SuggestionsList';
import { IIdentity, IPeoplePickerProvider } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
export interface IdentityPickerSuggestionsListProps extends ISuggestionsListProps<IIdentity> {
    /**
     * Props to render the callout which shows the suggestions list
     */
    calloutProps: ICalloutProps;
    /**
     * String to display when there are no suggestsions found for a given search.
     */
    noResultsFoundText?: string;
    /**
     * Callback when the persona card is closed. This should set the openedIdentityCard value to undefined appropriately.
     */
    onClosePersonaCard: () => void;
    /**
     * Callback when the persona card is opened. This should set the openedIdentityCard value appropriately.
     */
    onOpenPersonaCard: (identity: IIdentity) => void;
    /**
     * Callback when the callout is dismissed. This should set the suggestionsVisible appropriately.
     */
    onDismiss: () => void;
    /**
     * IIdentity of the Persona Card if opened. The card is closed when set to undefined
     * @default undefined
     */
    openedIdentityCard?: IReadonlyObservableValue<IIdentity> | IIdentity;
    /**
     * How the suggestion should look in the suggestion list.
     */
    renderSuggestion?: (suggestionItemProps: ISuggestionItemProps<IIdentity>) => JSX.Element;
    /**
     * The target element that the callout should use to anchor to.
     */
    suggestionTarget?: HTMLElement;
    /**
     * Boolean indicating if the suggestions list should be shown
     * @default false
     */
    suggestionsVisible?: IReadonlyObservableValue<boolean> | boolean;
    /**
     * The picker provider that will get details for the Identities when the persona card is opened.
     * @default undefined
     */
    pickerProvider: IPeoplePickerProvider;
}
export interface IIdentitySuggestionItemProps extends ISuggestionItemProps<IIdentity> {
    /**
     * Callback to be called when the contact card button is activated.
     */
    onOpenPersonaCard?: (identity: IIdentity) => void;
}
