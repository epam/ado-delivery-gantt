import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IPersonaProps } from "./Persona.Props";
export interface IPersonaState {
    imageError: boolean;
    imageLoaded: boolean;
    showIdentityCard: boolean;
}
/**
 * Renders a user's profile/identity/avatar image.
 */
export declare class Persona extends React.Component<IPersonaProps, IPersonaState> {
    private targetElement;
    constructor(props: IPersonaProps);
    render(): JSX.Element;
    showIdentityCard: () => void;
    private onClick;
    private hideIdentityCard;
    private getServerImageFromSize;
}
