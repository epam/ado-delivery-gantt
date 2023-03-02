import { IIdentity } from "../Persona/Persona.Props";
/**
 * Definitions for ContactCardContactLine used by ContactCard.
 */
export interface IContactCardContactLineProps {
    /**
     * Content for line.
     */
    content?: string;
    /**
     * Label for line.
     */
    label?: string;
    /**
     * (Optional) Link for line.
     */
    link?: string;
    /**
     * (Optional) to pad top.
     */
    padTop?: boolean;
}
/**
 * Definitions for DefaultCardContactLine (used by DefaultCard, and GithubCard).
 */
export interface IContactLineProps {
    /**
     * Content for line.
     */
    content?: string;
    /**
     * Name for icon.
     */
    iconName?: string;
    /**
     * (Optional) Link for line.
     */
    link?: string;
}
/**
 * Definitions for ContactCard.
 */
export interface IContactCardProps {
    /**
     * Identity object for persona and contact information.
     */
    identity: IIdentity;
}
export interface IOrganizationCardProps extends IContactCardProps {
    /**
     * List of direct reports.
     */
    directReportList?: IIdentity[];
    /**
     * List of managers.
     */
    managerList?: IIdentity[];
    /**
     * Method to handle identity click.
     */
    onClickEntity?: (identifier: string | IIdentity) => void;
}
export interface IGroupMembersCardProps extends IContactCardProps {
    /**
     * List of members.
     */
    members?: IIdentity[];
    /**
     * List of managers.
     */
    managerList?: IIdentity[];
    /**
     * Method to handle identity click.
     */
    onClickEntity?: (identifier: string | IIdentity) => void;
}
/**
 * Definitions for DefaultCard.
 */
export interface IDefaultCardProps extends IContactCardProps {
    /**
     * Previous header exists boolean.
     */
    isPreviousHeader?: boolean;
    /**
     * Direct manager identity object.
     */
    manager?: IIdentity;
    /**
     * Method to handle identity click.
     */
    onClickEntity?: (identifier: string | IIdentity) => void;
    /**
     * Method to show contact card.
     */
    showContactCard: () => void;
    /**
     * Method to show organization card.
     */
    showOrganizationCard?: () => void;
}
/**
 * Definitions for GroupCard.
 */
export interface IGroupCardProps extends IContactCardProps {
    /**
     * Previous header exists boolean.
     */
    isPreviousHeader?: boolean;
    /**
     * Direct manager identity object.
     */
    members?: IIdentity[];
    /**
     * Method to show organization card.
     */
    showOrganizationCard?: () => void;
}
