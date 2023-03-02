import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import * as DateUtil from '../../../Utilities/Date';
import { IAgoProps } from "./Ago.Props";
import { ITooltipProps } from '../../../TooltipEx';
export interface IAgoState {
    tooltipProps: ITooltipProps | null;
}
export declare class Ago extends React.Component<IAgoProps, IAgoState> {
    static getDerivedStateFromProps(props: Readonly<IAgoProps>): Partial<IAgoState>;
    constructor(props: Readonly<IAgoProps>);
    render(): JSX.Element;
    private getTimeString;
    /**
     * Returns time in milliseconds for next refresh.
     *
     * @return A number indicating time to refresh in milliseconds
     */
    private getNextInterval;
    /**
     * Returns time in milliseconds for next refresh.
     *
     * @return A number indicating time to refresh in milliseconds
     */
    static agoNextInterval(date: Date, format?: DateUtil.AgoFormat, now?: Date): number;
}
