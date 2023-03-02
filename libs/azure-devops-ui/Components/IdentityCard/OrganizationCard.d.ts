import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { IOrganizationCardProps } from "./ContactCard.Props";
export declare class OrganizationCard extends React.Component<IOrganizationCardProps> {
    render(): JSX.Element;
    private createManagerChainIdentityElements;
    private createDirectReportsIdentityElements;
}
