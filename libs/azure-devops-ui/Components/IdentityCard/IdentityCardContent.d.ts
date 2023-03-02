import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { IdentityCardContentProps } from "./IdentityCard.Props";
/**
 * The content of the callout for the persona card.
 */
export declare class IdentityCardContent extends React.Component<IdentityCardContentProps> {
    render(): JSX.Element;
    private onKeyDown;
    private renderCard;
    private renderInnerCard;
    private onDismissCallout;
}
