import "../../CommonImports";
import "../../Core/core.css";
import "./Coin.css";
import * as React from "react";
import { ICoinProps } from "./Coin.Props";
export interface ICoinState {
    imageError: boolean;
    imageLoaded: boolean;
    showIdentityCard: boolean;
}
/**
 * Renders a user's profile/identity/avatar image.
 */
export declare class Coin extends React.Component<ICoinProps, ICoinState> {
    constructor(props: ICoinProps);
    render(): JSX.Element;
    private onImageError;
    private onLoad;
    private handleKeyDown;
}
