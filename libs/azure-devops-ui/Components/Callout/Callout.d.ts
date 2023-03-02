import "../../CommonImports";
import "../../Core/core.css";
import "./Callout.css";
import * as React from "react";
import { ICallout, ICalloutProps } from "./Callout.Props";
export declare class Callout extends React.Component<ICalloutProps> implements ICallout {
    static defaultProps: Partial<ICalloutProps>;
    private calloutContent;
    render(): JSX.Element;
    componentWillUnmount(): void;
    updateLayout(): void;
}
