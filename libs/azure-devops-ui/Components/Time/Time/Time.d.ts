import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import { ITimeProps } from "./Time.Props";
export interface ITimeState {
    output: string;
}
export declare class Time extends React.Component<ITimeProps, ITimeState> {
    static getDerivedStateFromProps(props: Readonly<ITimeProps>): Partial<ITimeState>;
    private timerId;
    constructor(props: Readonly<ITimeProps>);
    render(): JSX.Element;
    componentDidUpdate(prevProps: ITimeProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    cancelNextRefresh(): void;
    private setNextRefresh;
}
