/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
export interface IPersonaConnections {
    directReports?: IIdentity[];
    successors?: IIdentity[];
    managers?: IIdentity[];
}
export declare enum IdentityType {
    User = "user",
    Group = "group",
    Custom = "custom"
}
export interface IIdentity {
    active?: boolean;
    department?: string;
    description?: string;
    displayName?: string;
    entityId: string;
    entityType: string;
    guest?: boolean;
    image?: string;
    isHosted?: boolean;
    isMru?: boolean;
    jobTitle?: string;
    localDirectory?: string;
    localId?: string;
    mail?: string;
    mailNickname?: string;
    manager?: string;
    originDirectory: string;
    originId: string;
    physicalDeliveryOfficeName?: string;
    samAccountName?: string;
    scopeName?: string;
    signInAddress?: string;
    subjectDescriptor?: string;
    surname?: string;
    telephoneNumber?: string;
}
export interface IPeoplePickerProvider {
    /**
     * Add identities to the MRU
     * @returns A promise that returns true if successful false otherwise
     */
    addIdentitiesToMRU?: (identities: IIdentity[]) => Promise<boolean>;
    /**
     * Given a list of currently selected items and a filter string, return a list of suggestions to put in the suggestion list
     */
    onFilterIdentities: (filter: string, selectedItems?: IIdentity[]) => IIdentity[] | PromiseLike<IIdentity[]> | null;
    /**
     * If no input is in the search box when clicked, provide a set of identities to show (used for MRU)
     */
    onEmptyInputFocus?: () => IIdentity[] | PromiseLike<IIdentity[]> | null;
    /**
     * Request connection information about a given Entity.
     */
    onRequestConnectionInformation: (entity: IIdentity, getDirectReports?: boolean) => IPersonaConnections | PromiseLike<IPersonaConnections>;
    /**
     * Request Entity information given an entityId
     */
    getEntityFromUniqueAttribute: (entityId: string) => IIdentity | PromiseLike<IIdentity>;
    /**
     * Add identities to the MRU
     * @returns A promise that returns true if successful false otherwise
     */
    removeIdentitiesFromMRU?: (identities: IIdentity[]) => Promise<boolean>;
}
export interface ISharedIdentityPickerProps {
    /**
     * Aria label
     */
    ariaLabel?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     */
    ariaLabelledBy?: string;
    /**
     * A boolean value indicating should component gets auto focussed on mount
     */
    autoFocus?: boolean;
    /**
     * Width of callout
     * @default 300.
     */
    calloutWidth?: number;
    /**
     * The CSS classname of the people picker control.
     */
    className?: string;
    /**
     * Disables the identity picker if true.
     */
    disabled?: boolean;
    /**
     * Placeholder text for the input
     * @default "Assign People"
     */
    editPlaceholder?: string;
    /**
     * Optional Id that will be given to the input element
     */
    inputId?: string;
    /**
     * Indicates if the text in resultsFooter or resultsFooterFull should be shown at the end of the suggestion list.
     * @default true.
     */
    isResultsFooterVisible?: boolean;
    /**
     * String to display when there are no results found.
     */
    noResultsFoundText?: string;
    /**
     * A callback for when input gets blurred
     */
    onBlur?: () => void;
    /**
     * A callback for when a suggestion is clicked. If no valid suggestion has been selected, item is undefined.
     */
    onChange: (item?: IIdentity) => boolean | void;
    /**
     * A callback for when the search text is cleared.
     */
    onClear?: () => void;
    /**
     * A callback for when input gets focus
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Provider to handle how to filter the suggested people from a filter.
     */
    pickerProvider: IPeoplePickerProvider;
    /**
     * Placeholder text for the input
     * @default "No one selected"
     */
    placeholder?: string;
    /**
     * Render a suggestion item for a custom identity.
     */
    renderCustomIdentitySuggestion?: (identity: IIdentity) => JSX.Element;
    /**
     * Optional delegate to resolve identity input which did not resolve to any suggested
     * identity in the picker.
     */
    resolveUnrecognizedIdentity?: (identityInput: string) => IIdentity | undefined;
    /**
     * Maximum number of suggestions to show in the full suggestion list.
     */
    resultsMaximumNumber?: number;
    /**
     * Indicates whether textfield is required or not.
     * @default false.
     */
    required?: boolean;
    /**
     * An ARIA label for the container that is the parent of the suggestions.
     */
    suggestionsContainerAriaLabel?: string;
    /**
     * the classname of the suggestionitem.
     */
    suggestionsItemClassName?: string;
    /**
     * Identity value of the selected persona This prop is 100% controlled
     * by the consumer. onChange must also be implemented in order to
     * work properly. If this value is a an identity, the prop must be
     * updated to cause the IdentityPicker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the IdentityPicker
     * to re-render. The textValue may also need to be updated when you change
     * this to show the selected users display name
     */
    value: IReadonlyObservableValue<IIdentity | undefined> | IIdentity | undefined;
}
