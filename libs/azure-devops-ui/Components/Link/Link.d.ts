import "../../CommonImports";
import "../../Core/core.css";
import "./Link.css";
import * as React from "react";
import { ILink, ILinkProps } from "./Link.Props";
export declare class Link extends React.Component<ILinkProps> implements ILink {
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    private ref;
    render(): JSX.Element;
    focus(): void;
    private handleActivation;
    private onClick;
    private onKeyPress;
    private onFocus;
}
