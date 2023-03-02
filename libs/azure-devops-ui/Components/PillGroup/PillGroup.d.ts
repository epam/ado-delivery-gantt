import "../../CommonImports";
import "../../Core/core.css";
import "./PillGroup.css";
import * as React from "react";
import { IPillGroupProps, PillGroupOverflow } from "./PillGroup.Props";
interface IPillGroupState {
    overflowing: boolean;
    overflow?: PillGroupOverflow;
}
export declare class PillGroup extends React.Component<IPillGroupProps, IPillGroupState> {
    private intersectionContext;
    private observing;
    constructor(props: IPillGroupProps);
    render(): any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onClick;
    private observeElement;
    private onIntersect;
}
export {};
