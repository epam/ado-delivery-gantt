import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import { IDurationProps } from "./Duration.Props";
import { ITooltipProps } from '../../../TooltipEx';
export interface IDurationState {
    tooltipProps: ITooltipProps | null;
}
export declare class Duration extends React.Component<IDurationProps, IDurationState> {
    static getDerivedStateFromProps(props: Readonly<IDurationProps>): Partial<IDurationState>;
    constructor(props: Readonly<IDurationProps>);
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
    static durationNextInterval(startDate: Date, endDate?: Date, now?: Date): number;
}
