/// <reference types="react" />
import { IReadonlyObservableArray } from '../../Core/Observable';
import { ISelectedTagProps } from '../../TagPicker';
import { IIdentity, IPeoplePickerProvider } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
export interface IIdentityPickerProps {
    /**
     * Aria label
     */
    ariaLabel?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     */
    ariaLabelledBy?: string;
    /**
     * Optional CSS class name to add to IdentityPicker
     */
    className?: string;
    /**
     * Custom converter to go from identity to tag props
     */
    convertItemToPill?: (person: IIdentity, index: number) => ISelectedTagProps;
    /**
     * String to display when there are no results found.
     */
    noResultsFoundText?: string;
    /**
     * Called on focus away
     * @param text text value of the picker before focus away
     */
    onBlur?: (text?: string) => void;
    /**
     * Called when the user clicks or enters on a suggested person
     */
    onIdentityAdded: (tag: IIdentity) => void;
    /**
     * Called when the user removes multiple identities by selecting them and hitting delete
     */
    onIdentitiesRemoved: (identities: IIdentity[]) => void;
    /**
     * Called when the user removes a previously selected person
     */
    onIdentityRemoved: (tag: IIdentity) => void;
    /**
     * This prop specifies a callback where, if this is specified, unresolved emails are allowed to be chosen.
     * This allows unresolved emails to be passed into the onIdentityAdded callback and they have the following properties
     * { entityId: emailAddress, originDirectory: "email", entityType: IdentityType.Custom}
     */
    onResolveEntity?: (email: string, identity: IIdentity | null) => void;
    /**
     * Provider to handle how to filter the suggested people from a filter.
     */
    pickerProvider: IPeoplePickerProvider;
    /**
     * String to show when there is no input in the text field.
     */
    placeholderText?: string;
    /**
     * Render a suggestion item for a custom identity.
     */
    renderCustomIdentitySuggestion?: (identity: IIdentity) => JSX.Element;
    /**
     * Identity values of the selected identities This prop is 100% controlled
     * by the consumer. onIdentityAdded/onIdentityRemoved/onIdentitiesRemoved must also be implemented in order to
     * work properly. If this value is a array of IIDentities, the prop must be
     * updated to cause the PeoplePicker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the PeoplePicker
     * to re-render.
     */
    selectedIdentities: IReadonlyObservableArray<IIdentity> | IIdentity[];
}
