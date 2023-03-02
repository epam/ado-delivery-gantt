import { ITooltipProps } from '../../TooltipEx';
/**
 * Preset sizes for the Persona.  Should match CoinSize in VSSUI/Coin
 */
export declare enum PersonaSize {
    size16 = 16,
    size20 = 20,
    size24 = 24,
    size32 = 32,
    size40 = 40,
    size72 = 72
}
export interface IIdentityConnections {
    directReports?: IIdentity[];
    successors?: IIdentity[];
    managers?: IIdentity[];
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
export interface IBasicIdentityRef {
    /**
     * Display name of the identity
     */
    displayName: string;
    /**
     * Unique ID that the PersonaProvider can be used to look up complete information for the identity
     */
    id: string;
    /**
     * Identity image url
     */
    imageUrl?: string;
}
export interface IIdentityDetailsProvider {
    /**
     * Request connection information about a given Entity.
     */
    onRequestConnectionInformation: (entity: IIdentity, getDirectReports?: boolean) => IIdentityConnections | PromiseLike<IIdentityConnections>;
    /**
     * Request Entity information given an entityId
     */
    getEntityFromUniqueAttribute: (entityId: string) => IIdentity | PromiseLike<IIdentity>;
}
export interface IPersonaProvider extends IIdentityDetailsProvider {
    renderIdentityCard?: (identity: IIdentity | IBasicIdentityRef, personaDetailsProvider: IIdentityDetailsProvider, onDismissCallback: () => void, target: HTMLElement | undefined) => void;
}
export interface IPeoplePickerProvider extends IIdentityDetailsProvider {
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
     * Add identities to the MRU
     * @returns A promise that returns true if successful false otherwise
     */
    removeIdentitiesFromMRU?: (identities: IIdentity[]) => Promise<boolean>;
}
/**
 * Props for Persona
 */
export interface IPersonaProps {
    /**
     * Sets the aria-label for the persona.
     * Defaults to the identity's display name.
     */
    ariaLabel?: string;
    /**
     * Sets aria-hidden for the persona
     *
     * @default false
     */
    ariaHidden?: boolean;
    /**
     * ClassName of the persona
     */
    className?: string;
    /**
     * Size of image to display. Use IdentitySize presets.
     */
    size?: PersonaSize;
    /**
     * Identity to show the coin from.
     */
    identity: IIdentity | IBasicIdentityRef;
    /**
     *Provides information about an identity.
     */
    personaProvider?: IPersonaProvider;
    /**
     * Custom tooltip props to be passed along to the Coin rendered by the Persona. Null indicates that no tooltip should be used.
     */
    tooltipProps?: ITooltipProps | null;
}
