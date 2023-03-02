/// <reference types="react" />
import { IIdentity, IIdentityConnections } from "../Persona/Persona.Props";
import { Callout } from '../../Callout';
export declare enum CardType {
    Default = 0,
    Contact = 1,
    Organization = 2
}
export interface IDataState {
    cardType?: CardType;
    directReportList?: IIdentity[];
    displayName?: string;
    email?: string;
    header?: IIdentity;
    identity?: IIdentity;
    imageUrl?: string;
    isGroup?: boolean;
    managerList?: IIdentity[];
    previousDataState?: IDataState;
    source?: string;
    successors?: IIdentity[];
}
export interface IdentityCardProps {
    consumerId?: string;
    displayName?: string;
    /**
     * Request Entity information about a given Entity.
     */
    getEntityFromUniqueAttribute: (entityId: string) => IIdentity | PromiseLike<IIdentity>;
    identity?: IIdentity;
    imageUrl?: string;
    initialHeader?: HeaderElementProps;
    onDismissCallback?: () => void;
    /**
     * Request connection information about a given Entity.
     */
    onRequestConnectionInformation: (entity: IIdentity | undefined, getDirectReports?: boolean) => IIdentityConnections | PromiseLike<IIdentityConnections>;
    referenceHTMLComponent?: HTMLElement;
    target?: HTMLElement;
    uniqueAttribute?: string;
}
export interface IdentityCardContentProps extends IdentityCardProps {
    calloutRef: React.RefObject<Callout>;
    dataProps: IDataState;
    onClickEntity?: (identity: IIdentity) => void;
    onHeaderClick?: () => void;
    onShowContactCard: () => void;
    onShowOrganizationCard?: () => void;
    /**
     * Set to true to force the unknown user message to show.
     */
    showUnknownUser?: boolean;
    working?: boolean;
}
/**
 * Definitions for HeaderElement used by IdentityCard.
 */
export interface HeaderElementProps {
    /**
     * Current data state (can be null).
     */
    identity?: IIdentity;
    /**
     * Function on click (show default card or pop breadcrumb).
     */
    onClickFunction?: () => void;
}
