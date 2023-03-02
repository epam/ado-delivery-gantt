import "../../CommonImports";
import "../../Core/core.css";
import "./VssPersona.css";
import * as React from "react";
import { IVssPersonaProps } from "./VssPersona.Props";
export interface IVssPersonaState {
    imageError: boolean;
    imageUrlVal: string | undefined;
    showPersonaCard: boolean;
}
/**
 * Renders a user's profile/identity/avatar image.
 */
export declare class VssPersona extends React.Component<IVssPersonaProps, IVssPersonaState> {
    private targetElement;
    constructor(props: IVssPersonaProps);
    UNSAFE_componentWillReceiveProps(nextProps: IVssPersonaProps): void;
    shouldComponentUpdate(nextProps: IVssPersonaProps, nextState: IVssPersonaState): boolean;
    render(): JSX.Element;
    private setTargetElement;
    private onImageError;
    private handleKeyDown;
    private showPersonaCard;
    private hidePersonaCard;
    /**
     * Resolve the URL for the profile image.
     * @param props
     */
    private _getImageUrl;
    /**
     * Get the size in pixels for the given css class.
     * @param size
     */
    private _getSize;
}
