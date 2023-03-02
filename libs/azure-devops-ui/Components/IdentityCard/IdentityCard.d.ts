import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
/**
 * The IdentityCard is intended to show contact and organization information for an identity.
 * You may pass the entity directly or you may pass a unique attribute (e.g. uniqueName, entityID, signInAddress) as a prop.
 *
 */
import * as React from "react";
import { IDataState, IdentityCardProps } from "./IdentityCard.Props";
export interface IdentityCardState {
    /** Mimics stack to allow for breadcrumb */
    dataState: IDataState;
    /** Prevent requests if working */
    working: boolean;
    /** Set to true when complete identity information could not be loaded */
    showUnknownUser: boolean;
}
export declare class IdentityCard extends React.Component<IdentityCardProps, IdentityCardState> {
    private calloutRef;
    private dismissed;
    constructor(props: IdentityCardProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private onDismissCallback;
    private headerOnClickHandler;
    private onShowContactCard;
    private onShowOrganizationCard;
    private onClickEntity;
    private setupInitialData;
    private resolveIdentity;
    private resolveIEntity;
    private updateConnections;
    private updateEntity;
    private getIdentityByUniqueAttribute;
    private getEmail;
}
