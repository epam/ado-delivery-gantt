import "../../CommonImports";
import "../../Core/core.css";
import "./Portal.css";
import * as React from "react";
import { IPortalProps } from "./Portal.Props";
/**
 * The Portal component is used to create a React Portal through a well known component.
 * This component allows the platform to control where portals are rooted in the document
 * and ensure these are managed properly.
 */
export declare class Portal extends React.Component<IPortalProps> {
    private parentElement;
    private hostElement;
    private mounted;
    constructor(props: IPortalProps);
    render(): React.ReactPortal;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
