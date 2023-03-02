import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { IDefaultCardProps } from "./ContactCard.Props";
export declare class DefaultCard extends React.Component<IDefaultCardProps> {
    private contactButtonRef;
    componentDidMount(): void;
    render(): JSX.Element;
    /**
     * Renders the direct manager for the persona.
     * @param managerIdentity The manager persona.
     */
    private renderDirectManagerElement;
}
